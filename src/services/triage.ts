import {
  conditionProfiles,
  diagnosisDataSource,
  featuredSymptomKeys,
  symptomCatalog,
} from "../data.js";
import type { TriageAssessmentInput, TriageAssessmentResult, SymptomSuggestion } from "../types";

const DISCLAIMER =
  "This is not a medical diagnosis. Please consult a healthcare professional if symptoms persist or worsen.";

const VALID_AGE_RANGES = new Set(["0-17", "18-35", "36-55", "55+"]);
const VALID_GENDERS = new Set(["Female", "Male", "Non-binary / Other"]);
const HIGH_ALERT_SYMPTOMS = new Set([
  "altered_sensorium",
  "blood_in_sputum",
  "breathlessness",
  "chest_pain",
  "coma",
  "fast_heart_rate",
  "slurred_speech",
  "stomach_bleeding",
  "weakness_of_one_body_side",
]);
const MEDIUM_ALERT_SYMPTOMS = new Set([
  "abdominal_pain",
  "bloody_stool",
  "dark_urine",
  "dehydration",
  "high_fever",
  "yellowing_of_eyes",
  "yellowish_skin",
  "vomiting",
]);
const HIGH_ALERT_CONDITIONS = new Set([
  "heart attack",
  "pneumonia",
  "stroke brain hemorrhage",
  "tuberculosis",
]);
const HIGH_RISK_OLDER_AGE_CONDITIONS = new Set([
  "heart attack",
  "hypertension",
  "pneumonia",
  "stroke brain hemorrhage",
]);
const COMMON_YOUNGER_AGE_CONDITIONS = new Set([
  "allergy",
  "bronchial asthma",
  "chicken pox",
  "common cold",
]);
const RESPIRATORY_SYMPTOMS = new Set([
  "breathlessness",
  "chest_pain",
  "congestion",
  "cough",
  "mucoid_sputum",
  "phlegm",
  "runny_nose",
]);
const DIGESTIVE_SYMPTOMS = new Set([
  "abdominal_pain",
  "acidity",
  "belly_pain",
  "constipation",
  "diarrhoea",
  "indigestion",
  "nausea",
  "passage_of_gases",
  "stomach_pain",
  "vomiting",
]);
const URINARY_SYMPTOMS = new Set([
  "bladder_discomfort",
  "burning_micturition",
  "continuous_feel_of_urine",
  "foul_smell_of urine",
  "spotting_ urination",
]);
const NEUROLOGICAL_SYMPTOMS = new Set([
  "altered_sensorium",
  "dizziness",
  "headache",
  "loss_of_balance",
  "slurred_speech",
  "visual_disturbances",
  "weakness_of_one_body_side",
]);
const RASH_SYMPTOMS = new Set([
  "blister",
  "itching",
  "nodal_skin_eruptions",
  "pus_filled_pimples",
  "red_spots_over_body",
  "skin_rash",
  "skin_peeling",
]);

const searchableSymptoms = symptomCatalog.map((item) => ({
  ...item,
  normalizedLabel: normalizeForSearch(item.label),
  searchTerms: Array.from(new Set([normalizeForSearch(item.label), ...item.aliases])),
}));
const searchableSymptomsByKey = new Map(searchableSymptoms.map((item) => [item.key, item]));
const featuredSymptoms = featuredSymptomKeys
  .map((key) => searchableSymptomsByKey.get(key))
  .filter((item): item is (typeof searchableSymptoms)[number] => Boolean(item));

export const triageDataSummary = diagnosisDataSource;

interface NormalizedInput {
  ageRange: TriageAssessmentInput["ageRange"];
  gender: TriageAssessmentInput["gender"];
  knownConditions: string[];
  selectedSymptoms: string[];
  symptoms: string;
}

interface RankedCondition {
  name: string;
  score: number;
  matchedSymptoms: string[];
}

function normalizeForSearch(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function sanitizeText(value: string, maxLength: number) {
  return value.replace(/\s+/gu, " ").trim().slice(0, maxLength);
}

function normalizeKnownConditions(value: string[]) {
  const conditions: string[] = [];

  for (const item of value) {
    const condition = sanitizeText(item, 80);

    if (!condition || condition === "None yet" || conditions.includes(condition)) {
      continue;
    }

    conditions.push(condition);
  }

  return conditions.slice(0, 8);
}

function normalizeSelectedSymptoms(value: string[] | undefined) {
  const selectedSymptoms: string[] = [];

  for (const item of value ?? []) {
    const symptomKey = sanitizeText(item, 80);

    if (!searchableSymptomsByKey.has(symptomKey) || selectedSymptoms.includes(symptomKey)) {
      continue;
    }

    selectedSymptoms.push(symptomKey);
  }

  return selectedSymptoms.slice(0, 12);
}

function validateInput(input: TriageAssessmentInput): NormalizedInput {
  if (!VALID_AGE_RANGES.has(input.ageRange)) {
    throw new Error("Choose a valid age range before continuing.");
  }

  if (input.gender && !VALID_GENDERS.has(input.gender)) {
    throw new Error("Choose a valid gender option before continuing.");
  }

  const selectedSymptoms = normalizeSelectedSymptoms(input.selectedSymptoms);
  const symptoms = sanitizeText(input.symptoms, 1500);

  if (symptoms.length < 10 && selectedSymptoms.length === 0) {
    throw new Error("Add symptoms from the list before searching.");
  }

  return {
    ageRange: input.ageRange,
    gender: input.gender,
    knownConditions: normalizeKnownConditions(input.knownConditions),
    selectedSymptoms,
    symptoms,
  };
}

function isPhraseMatch(normalizedText: string, searchTerm: string) {
  if (!searchTerm) {
    return false;
  }

  const paddedText = ` ${normalizedText} `;
  const paddedTerm = ` ${searchTerm} `;

  return paddedText.includes(paddedTerm) || normalizedText.includes(searchTerm);
}

function extractSymptomsFromNarrative(symptomsText: string) {
  const normalizedText = normalizeForSearch(symptomsText);
  const matchedSymptoms = new Set<string>();

  if (!normalizedText) {
    return [];
  }

  for (const item of searchableSymptoms) {
    if (item.searchTerms.some((searchTerm) => isPhraseMatch(normalizedText, searchTerm))) {
      matchedSymptoms.add(item.key);
    }
  }

  return Array.from(matchedSymptoms);
}

function getKnownConditionBoost(
  conditionName: string,
  knownConditions: string[],
  matchedSymptoms: string[],
) {
  const hasRespiratoryPattern = matchedSymptoms.some((symptom) => RESPIRATORY_SYMPTOMS.has(symptom));
  const hasDiabetesPattern = matchedSymptoms.some((symptom) =>
    ["fatigue", "polyuria", "increased_appetite", "weight_loss"].includes(symptom),
  );
  const hasHypertensionPattern = matchedSymptoms.some((symptom) =>
    ["chest_pain", "dizziness", "headache", "palpitations"].includes(symptom),
  );

  let boost = 0;

  if (
    knownConditions.includes("Asthma") &&
    conditionName === "Bronchial Asthma" &&
    hasRespiratoryPattern
  ) {
    boost += 0.09;
  }

  if (
    knownConditions.includes("Diabetes") &&
    conditionName === "Diabetes" &&
    hasDiabetesPattern
  ) {
    boost += 0.09;
  }

  if (
    knownConditions.includes("Hypertension") &&
    conditionName === "Hypertension" &&
    hasHypertensionPattern
  ) {
    boost += 0.08;
  }

  return boost;
}

function getAgeBoost(conditionName: string, ageRange: NormalizedInput["ageRange"]) {
  const normalizedConditionName = normalizeForSearch(conditionName);

  if (ageRange === "55+" && HIGH_RISK_OLDER_AGE_CONDITIONS.has(normalizedConditionName)) {
    return 0.03;
  }

  if (ageRange === "0-17" && COMMON_YOUNGER_AGE_CONDITIONS.has(normalizedConditionName)) {
    return 0.025;
  }

  return 0;
}

function rankConditions(input: NormalizedInput, matchedSymptoms: string[]) {
  const totalMatchedSymptomCount = matchedSymptoms.length;

  if (totalMatchedSymptomCount === 0) {
    return [];
  }

  return conditionProfiles
    .map((condition) => {
      const directMatches = matchedSymptoms.filter(
        (symptomKey) => condition.symptomWeights[symptomKey] !== undefined,
      );

      if (directMatches.length === 0) {
        return null;
      }

      const weightedHits = directMatches.reduce(
        (sum, symptomKey) => sum + (condition.symptomWeights[symptomKey] ?? 0),
        0,
      );
      const coverageScore = weightedHits / condition.totalWeight;
      const precisionScore = directMatches.length / totalMatchedSymptomCount;
      const score =
        coverageScore * 0.72 +
        precisionScore * 0.28 +
        getKnownConditionBoost(condition.name, input.knownConditions, matchedSymptoms) +
        getAgeBoost(condition.name, input.ageRange) +
        (directMatches.length >= 3 ? 0.04 : 0);

      return {
        name: condition.name,
        score: Number(score.toFixed(3)),
        matchedSymptoms: directMatches,
      };
    })
    .filter((item): item is RankedCondition => Boolean(item))
    .sort((left, right) => right.score - left.score || left.name.localeCompare(right.name));
}

function getUrgencyLevel(matches: RankedCondition[], matchedSymptoms: string[]) {
  if (matchedSymptoms.some((symptom) => HIGH_ALERT_SYMPTOMS.has(symptom))) {
    return "high" as const;
  }

  if (matches[0] && HIGH_ALERT_CONDITIONS.has(normalizeForSearch(matches[0].name)) && matches[0].score >= 0.45) {
    return "high" as const;
  }

  if (
    matchedSymptoms.some((symptom) => MEDIUM_ALERT_SYMPTOMS.has(symptom)) ||
    (matches[0]?.score ?? 0) >= 0.38
  ) {
    return "medium" as const;
  }

  return "low" as const;
}

function getSymptomLabel(symptomKey: string) {
  return searchableSymptomsByKey.get(symptomKey)?.label ?? symptomKey;
}

function buildRecommendation(
  urgencyLevel: TriageAssessmentResult["urgency_level"],
  matches: RankedCondition[],
  matchedSymptoms: string[],
) {
  const leadConditions = matches.slice(0, 2).map((match) => match.name);
  const conditionSummary =
    leadConditions.length > 0 ? leadConditions.join(" or ") : "common mild conditions";
  const symptomSummary = matchedSymptoms
    .slice(0, 3)
    .map((symptomKey) => getSymptomLabel(symptomKey).toLowerCase())
    .join(", ");

  if (urgencyLevel === "high") {
    return `This symptom mix needs prompt medical review, especially because of ${symptomSummary || "the current warning signs"}. The strongest matches in this demo dataset are ${conditionSummary}. Please seek urgent medical attention now. ${DISCLAIMER}`;
  }

  if (urgencyLevel === "medium") {
    return `This pattern is worth a same-day or next-day clinical review. The strongest matches in this demo dataset are ${conditionSummary}, and the cross-match was driven by ${symptomSummary || "the entered symptoms"}. Keep fluids up, avoid self-medicating aggressively, and arrange a professional review soon. ${DISCLAIMER}`;
  }

  return `This pattern looks closer to lower-urgency issues such as ${conditionSummary}. Rest, hydration, and pharmacy-level support may help if symptoms stay mild, but monitor closely and escalate care if anything gets worse or new symptoms appear. ${DISCLAIMER}`;
}

function pushQuestion(questions: string[], question: string) {
  if (!questions.includes(question) && questions.length < 3) {
    questions.push(question);
  }
}

function buildFollowUpQuestions(matchedSymptoms: string[]) {
  const questions: string[] = [];

  if (matchedSymptoms.some((symptom) => HIGH_ALERT_SYMPTOMS.has(symptom))) {
    pushQuestion(
      questions,
      "Did any severe warning signs start suddenly, or are they getting worse quickly?",
    );
  }

  if (matchedSymptoms.some((symptom) => RESPIRATORY_SYMPTOMS.has(symptom))) {
    pushQuestion(
      questions,
      "Is there wheezing, chest tightness, or any trouble speaking in full sentences?",
    );
  }

  if (matchedSymptoms.some((symptom) => DIGESTIVE_SYMPTOMS.has(symptom))) {
    pushQuestion(
      questions,
      "Any vomiting, diarrhoea, black stool, or trouble keeping fluids down?",
    );
  }

  if (matchedSymptoms.some((symptom) => URINARY_SYMPTOMS.has(symptom))) {
    pushQuestion(
      questions,
      "Is urination painful, unusually frequent, or darker or smellier than normal?",
    );
  }

  if (matchedSymptoms.some((symptom) => NEUROLOGICAL_SYMPTOMS.has(symptom))) {
    pushQuestion(
      questions,
      "Any confusion, fainting, weakness on one side, or changes in vision or speech?",
    );
  }

  if (matchedSymptoms.some((symptom) => RASH_SYMPTOMS.has(symptom))) {
    pushQuestion(
      questions,
      "Did the rash or skin change begin after a new food, medicine, soap, or skin product?",
    );
  }

  pushQuestion(
    questions,
    "How long has this been going on, and is it clearly improving, staying the same, or worsening?",
  );

  pushQuestion(
    questions,
    "Has the person checked temperature, blood pressure, blood sugar, or oxygen level recently?",
  );

  return questions.slice(0, 3);
}

function buildFallbackResult(input: NormalizedInput): TriageAssessmentResult {
  const hasDigestiveWords = /(stomach|belly|vomit|nausea|diarrh|constipat)/i.test(input.symptoms);
  const hasRespiratoryWords = /(cough|breath|nose|cold|fever|flu)/i.test(input.symptoms);
  const hasSkinWords = /(rash|itch|skin|pimple)/i.test(input.symptoms);

  const possibleConditions = hasDigestiveWords
    ? ["Gastroenteritis", "GERD", "Peptic ulcer disease"]
    : hasRespiratoryWords
      ? ["Common Cold", "Bronchial Asthma", "Pneumonia"]
      : hasSkinWords
        ? ["Allergy", "Fungal Infection", "Drug Reaction"]
        : ["Allergy", "Common Cold", "Gastroenteritis"];

  return {
    possible_conditions: possibleConditions,
    urgency_level: "low",
    recommendation: `The current selection did not cleanly map to the demo symptom library, so this result is a broad fallback. For a stronger match, add a few more symptoms from the autocomplete list. ${DISCLAIMER}`,
    follow_up_questions: [
      "Can you add 2 to 4 specific symptoms from the autocomplete list?",
      "When did the symptoms start, and what is getting worse?",
      "Any fever, pain level, breathing trouble, vomiting, or rash?",
    ],
    matched_symptoms: input.selectedSymptoms.map((symptomKey) => getSymptomLabel(symptomKey)),
  };
}

export function getSymptomSuggestions(
  query: string,
  selectedSymptoms: string[],
  limit = 8,
): SymptomSuggestion[] {
  const normalizedQuery = normalizeForSearch(query);
  const selectedSymptomSet = new Set(selectedSymptoms);
  const source = normalizedQuery ? searchableSymptoms : featuredSymptoms;

  return source
    .filter((item) => !selectedSymptomSet.has(item.key))
    .filter((item) => {
      if (!normalizedQuery) {
        return true;
      }

      return item.searchTerms.some((searchTerm) => searchTerm.includes(normalizedQuery));
    })
    .sort((left, right) => {
      const leftLabelStarts = Number(!normalizedQuery || left.normalizedLabel.startsWith(normalizedQuery));
      const rightLabelStarts = Number(
        !normalizedQuery || right.normalizedLabel.startsWith(normalizedQuery),
      );

      if (leftLabelStarts !== rightLabelStarts) {
        return rightLabelStarts - leftLabelStarts;
      }

      return (
        right.conditionCount - left.conditionCount || left.label.localeCompare(right.label)
      );
    })
    .slice(0, limit)
    .map((item) => ({
      key: item.key,
      label: item.label,
    }));
}

export function getSymptomDisplayLabel(symptomKey: string) {
  return getSymptomLabel(symptomKey);
}

export async function requestTriageAssessment(
  input: TriageAssessmentInput,
): Promise<TriageAssessmentResult> {
  const normalizedInput = validateInput(input);
  const detectedSymptoms = extractSymptomsFromNarrative(normalizedInput.symptoms);
  const matchedSymptoms = Array.from(
    new Set([...normalizedInput.selectedSymptoms, ...detectedSymptoms]),
  );
  const rankedConditions = rankConditions(normalizedInput, matchedSymptoms);

  if (rankedConditions.length === 0) {
    return buildFallbackResult(normalizedInput);
  }

  const urgencyLevel = getUrgencyLevel(rankedConditions, matchedSymptoms);

  return {
    possible_conditions: rankedConditions.slice(0, 4).map((match) => match.name),
    urgency_level: urgencyLevel,
    recommendation: buildRecommendation(urgencyLevel, rankedConditions, matchedSymptoms),
    follow_up_questions: buildFollowUpQuestions(matchedSymptoms),
    matched_symptoms: matchedSymptoms.slice(0, 8).map((symptomKey) => getSymptomLabel(symptomKey)),
  };
}
