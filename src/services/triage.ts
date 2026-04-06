import { appConfig } from "../config";
import type { TriageAssessmentInput, TriageAssessmentResult } from "../types";

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
} as const;

interface OpenAiResponseContentItem {
  type?: string;
  text?: string;
}

interface OpenAiResponseItem {
  content?: OpenAiResponseContentItem[];
}

interface OpenAiResponsesApiPayload {
  output_text?: string;
  output?: OpenAiResponseItem[];
  error?: {
    message?: string;
  };
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function sanitizeText(value: string, maxLength: number) {
  return value.replace(/\s+/gu, " ").trim().slice(0, maxLength);
}

function createUserPrompt(input: TriageAssessmentInput) {
  const knownConditions =
    input.knownConditions.length > 0 ? input.knownConditions.join(", ") : "None reported";
  const gender = input.gender ?? "Not shared";

  return [
    "Review these details together and return only the required JSON structure.",
    `Age range: ${input.ageRange}`,
    `Gender: ${gender}`,
    `Known conditions: ${knownConditions}`,
    `Symptoms: ${sanitizeText(input.symptoms, 1500)}`,
  ].join("\n");
}

function extractOutputText(payload: OpenAiResponsesApiPayload) {
  if (typeof payload.output_text === "string" && payload.output_text.trim().length > 0) {
    return payload.output_text;
  }

  const outputItems = Array.isArray(payload.output) ? payload.output : [];
  const textParts: string[] = [];

  for (const item of outputItems) {
    const contentItems = Array.isArray(item.content) ? item.content : [];

    for (const content of contentItems) {
      if (content.type === "output_text" && typeof content.text === "string") {
        textParts.push(content.text);
      }
    }
  }

  if (textParts.length > 0) {
    return textParts.join("");
  }

  throw new Error("OpenAI returned an empty response.");
}

function parseTriageAssessmentResult(payload: unknown): TriageAssessmentResult {
  if (typeof payload !== "object" || payload === null) {
    throw new Error("The triage service returned an invalid response.");
  }

  const candidate = payload as Partial<TriageAssessmentResult>;
  const validUrgencyLevels = ["low", "medium", "high"] as const;
  const urgencyLevel = candidate.urgency_level;

  if (
    !isStringArray(candidate.possible_conditions) ||
    typeof candidate.recommendation !== "string" ||
    !isStringArray(candidate.follow_up_questions) ||
    !validUrgencyLevels.includes(urgencyLevel as (typeof validUrgencyLevels)[number])
  ) {
    throw new Error("The triage service returned incomplete data.");
  }

  const recommendation = candidate.recommendation.includes(DISCLAIMER)
    ? candidate.recommendation.trim()
    : `${candidate.recommendation.trim()} ${DISCLAIMER}`;

  return {
    possible_conditions: candidate.possible_conditions.filter(Boolean).slice(0, 4),
    urgency_level: urgencyLevel as TriageAssessmentResult["urgency_level"],
    recommendation,
    follow_up_questions: candidate.follow_up_questions.filter(Boolean).slice(0, 3),
  };
}

function getOpenAiErrorMessage(payload: unknown) {
  if (
    payload &&
    typeof payload === "object" &&
    "error" in payload &&
    payload.error &&
    typeof payload.error === "object" &&
    "message" in payload.error &&
    typeof payload.error.message === "string"
  ) {
    return payload.error.message;
  }

  return "We could not complete the symptom check right now.";
}

export async function requestTriageAssessment(
  input: TriageAssessmentInput,
): Promise<TriageAssessmentResult> {
  if (!appConfig.openAiApiKey) {
    throw new Error("VITE_OPENAI_API_KEY is missing for this demo.");
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${appConfig.openAiApiKey}`,
    },
    body: JSON.stringify({
      model: appConfig.openAiModel,
      input: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: createUserPrompt(input),
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

  const rawPayload = (await response.json().catch(() => null)) as OpenAiResponsesApiPayload | null;

  if (!response.ok) {
    throw new Error(getOpenAiErrorMessage(rawPayload));
  }

  const outputText = extractOutputText(rawPayload ?? {});
  const parsedPayload = JSON.parse(outputText) as unknown;

  return parseTriageAssessmentResult(parsedPayload);
}
