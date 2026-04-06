import { randomUUID } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");

loadEnvFile(join(projectRoot, ".env"));

const PORT = Number.parseInt(process.env.TRIAGE_SERVER_PORT ?? "8787", 10);
const ALLOWED_ORIGIN = process.env.TRIAGE_ALLOWED_ORIGIN ?? "http://localhost:5173";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? "";
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-5.4-mini";
const DISCLAIMER =
  "This is not a medical diagnosis. Please consult a healthcare professional if symptoms persist or worsen.";

const SYSTEM_PROMPT = `
You are MOI DOCCTARR, an AI-powered health triage assistant.

Your role is to provide safe, clear, calm, and structured preliminary health guidance.

Rules:
- Do not provide a definitive diagnosis.
- Do not mention rare or life-threatening diseases unless the reported symptoms clearly make them relevant.
- Do not cause panic.
- Stay calm, neutral, and professional.
- Prefer common everyday conditions when listing possibilities.
- Keep language simple and human-friendly.
- Always include this exact sentence at the end of recommendation: "${DISCLAIMER}"

Return strict JSON only with:
1. possible_conditions: 2 to 4 likely common conditions
2. urgency_level: low, medium, or high
3. recommendation: clear next step ending with the required disclaimer sentence
4. follow_up_questions: 1 to 3 helpful next questions

Urgency rules:
- High: chest pain, difficulty breathing, severe bleeding, unconsciousness, stroke symptoms, or other clearly dangerous symptoms
- Medium: persistent fever, moderate pain, worsening symptoms, or symptoms needing prompt clinical review
- Low: mild symptoms, likely self-care situations, or minor discomfort
`.trim();

const TRIAGE_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    possible_conditions: {
      type: "array",
      items: { type: "string" },
      minItems: 2,
      maxItems: 4,
    },
    urgency_level: {
      type: "string",
      enum: ["low", "medium", "high"],
    },
    recommendation: {
      type: "string",
    },
    follow_up_questions: {
      type: "array",
      items: { type: "string" },
      minItems: 1,
      maxItems: 3,
    },
  },
  required: [
    "possible_conditions",
    "urgency_level",
    "recommendation",
    "follow_up_questions",
  ],
  additionalProperties: false,
};

class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
  }
}

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return;
  }

  const fileContents = readFileSync(filePath, "utf8");

  for (const rawLine of fileContents.split(/\r?\n/u)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function sendJson(response, statusCode, payload, origin, requestId) {
  response.writeHead(statusCode, {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Origin": origin ?? ALLOWED_ORIGIN,
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    Vary: "Origin",
    "X-Request-Id": requestId,
  });
  response.end(JSON.stringify(payload));
}

function sanitizeText(value, maxLength) {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/\s+/gu, " ").trim().slice(0, maxLength);
}

function normalizeKnownConditions(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  const conditions = [];

  for (const item of value) {
    const condition = sanitizeText(item, 80);

    if (!condition || condition === "None yet") {
      continue;
    }

    if (!conditions.includes(condition)) {
      conditions.push(condition);
    }
  }

  return conditions.slice(0, 8);
}

function validatePayload(body) {
  const validAgeRanges = new Set(["0-17", "18-35", "36-55", "55+"]);
  const validGenders = new Set(["Female", "Male", "Non-binary / Other"]);

  const ageRange = sanitizeText(body?.ageRange, 20);
  const gender = sanitizeText(body?.gender, 40);
  const symptoms = sanitizeText(body?.symptoms, 1500);
  const knownConditions = normalizeKnownConditions(body?.knownConditions);

  if (!validAgeRanges.has(ageRange)) {
    throw new HttpError(400, "Please choose a valid age range.");
  }

  if (gender && !validGenders.has(gender)) {
    throw new HttpError(400, "Please choose a valid gender option.");
  }

  if (symptoms.length < 10) {
    throw new HttpError(400, "Please describe the symptoms in a little more detail.");
  }

  return {
    ageRange,
    gender: gender || null,
    knownConditions,
    symptoms,
  };
}

function createUserPrompt(payload) {
  const knownConditions =
    payload.knownConditions.length > 0 ? payload.knownConditions.join(", ") : "None reported";
  const gender = payload.gender ?? "Not shared";

  return [
    "Review these details together and return only the required JSON structure.",
    `Age range: ${payload.ageRange}`,
    `Gender: ${gender}`,
    `Known conditions: ${knownConditions}`,
    `Symptoms: ${payload.symptoms}`,
  ].join("\n");
}

function extractOutputText(responsePayload) {
  if (
    typeof responsePayload?.output_text === "string" &&
    responsePayload.output_text.trim().length > 0
  ) {
    return responsePayload.output_text;
  }

  const contentBlocks = Array.isArray(responsePayload?.output) ? responsePayload.output : [];
  const textParts = [];

  for (const item of contentBlocks) {
    const contentItems = Array.isArray(item?.content) ? item.content : [];

    for (const content of contentItems) {
      if (content?.type === "output_text" && typeof content?.text === "string") {
        textParts.push(content.text);
      }
    }
  }

  if (textParts.length > 0) {
    return textParts.join("");
  }

  throw new HttpError(502, "OpenAI returned an empty structured response.");
}

function normalizeTriageResponse(candidate) {
  const possibleConditions = Array.isArray(candidate?.possible_conditions)
    ? candidate.possible_conditions
        .filter((item) => typeof item === "string")
        .map((item) => sanitizeText(item, 120))
        .filter(Boolean)
        .slice(0, 4)
    : [];

  const followUpQuestions = Array.isArray(candidate?.follow_up_questions)
    ? candidate.follow_up_questions
        .filter((item) => typeof item === "string")
        .map((item) => sanitizeText(item, 160))
        .filter(Boolean)
        .slice(0, 3)
    : [];

  const urgencyLevel = sanitizeText(candidate?.urgency_level, 10).toLowerCase();
  const recommendation = sanitizeText(candidate?.recommendation, 800);

  if (!["low", "medium", "high"].includes(urgencyLevel)) {
    throw new HttpError(502, "OpenAI returned an invalid urgency level.");
  }

  if (possibleConditions.length < 2) {
    throw new HttpError(502, "OpenAI returned too few possible conditions.");
  }

  if (followUpQuestions.length < 1) {
    throw new HttpError(502, "OpenAI returned too few follow-up questions.");
  }

  if (!recommendation) {
    throw new HttpError(502, "OpenAI returned an empty recommendation.");
  }

  const finalRecommendation = recommendation.includes(DISCLAIMER)
    ? recommendation
    : `${recommendation} ${DISCLAIMER}`;

  return {
    possible_conditions: possibleConditions,
    urgency_level: urgencyLevel,
    recommendation: finalRecommendation,
    follow_up_questions: followUpQuestions,
  };
}

async function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let totalBytes = 0;

    request.on("data", (chunk) => {
      totalBytes += chunk.length;

      if (totalBytes > 100_000) {
        reject(new HttpError(413, "Request body is too large."));
        request.destroy();
        return;
      }

      chunks.push(chunk);
    });

    request.on("end", () => {
      const rawBody = Buffer.concat(chunks).toString("utf8").trim();

      if (!rawBody) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(rawBody));
      } catch {
        reject(new HttpError(400, "Request body must be valid JSON."));
      }
    });

    request.on("error", (error) => {
      reject(error);
    });
  });
}

async function requestTriageFromOpenAI(payload) {
  if (!OPENAI_API_KEY) {
    throw new HttpError(
      500,
      "OPENAI_API_KEY is not configured on the server. Add it to your environment before running triage.",
    );
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      input: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: createUserPrompt(payload),
        },
      ],
      max_output_tokens: 700,
      text: {
        format: {
          type: "json_schema",
          name: "triage_response",
          strict: true,
          schema: TRIAGE_RESPONSE_SCHEMA,
        },
      },
    }),
    signal: AbortSignal.timeout(30_000),
  });

  const rawText = await response.text();
  let responsePayload = null;

  try {
    responsePayload = rawText ? JSON.parse(rawText) : null;
  } catch {
    throw new HttpError(502, "OpenAI returned a non-JSON response.");
  }

  if (!response.ok) {
    const apiMessage =
      sanitizeText(responsePayload?.error?.message, 240) ||
      "The model request did not complete successfully.";
    throw new HttpError(response.status, apiMessage);
  }

  const outputText = extractOutputText(responsePayload);
  let parsedResult = null;

  try {
    parsedResult = JSON.parse(outputText);
  } catch {
    throw new HttpError(502, "OpenAI returned invalid structured JSON.");
  }

  return normalizeTriageResponse(parsedResult);
}

const server = createServer(async (request, response) => {
  const requestId = randomUUID();
  const originHeader = request.headers.origin;
  const requestOrigin = typeof originHeader === "string" ? originHeader : null;

  try {
    if (requestOrigin && requestOrigin !== ALLOWED_ORIGIN) {
      throw new HttpError(403, "This origin is not allowed to call the triage server.");
    }

    if (request.method === "OPTIONS") {
      sendJson(response, 204, {}, requestOrigin, requestId);
      return;
    }

    if (request.method === "GET" && request.url === "/health") {
      sendJson(
        response,
        200,
        {
          ok: true,
          model: OPENAI_MODEL,
        },
        requestOrigin,
        requestId,
      );
      return;
    }

    if (request.method !== "POST" || request.url !== "/api/triage") {
      throw new HttpError(404, "Route not found.");
    }

    const body = await readJsonBody(request);
    const payload = validatePayload(body);
    const result = await requestTriageFromOpenAI(payload);

    sendJson(response, 200, result, requestOrigin, requestId);
  } catch (error) {
    const statusCode = error instanceof HttpError ? error.statusCode : 500;
    const message =
      error instanceof Error ? error.message : "Unexpected server error.";

    sendJson(
      response,
      statusCode,
      {
        error: message,
      },
      requestOrigin,
      requestId,
    );
  }
});

server.listen(PORT, () => {
  console.log(
    `MOI DOCCTARR triage server listening on http://localhost:${PORT} with model ${OPENAI_MODEL}`,
  );
});
