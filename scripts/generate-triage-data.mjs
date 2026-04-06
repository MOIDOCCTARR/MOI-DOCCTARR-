import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const sourcePath = resolve(projectRoot, "data", "Training.csv");
const outputPath = resolve(projectRoot, "src", "data.js");

const SYMPTOM_LABEL_OVERRIDES = {
  "spotting_ urination": "Spotting urination",
  "swelled_lymph_nodes": "Swollen lymph nodes",
  "foul_smell_of urine": "Foul-smelling urine",
  "dischromic _patches": "Discolored patches",
  "toxic_look_(typhos)": "Very ill appearance",
  scurring: "Scarring",
  swollen_extremeties: "Swollen extremities",
  cold_hands_and_feets: "Cold hands and feet",
  blurred_and_distorted_vision: "Blurred vision",
  fluid_overload: "Fluid overload",
};

const CONDITION_NAME_OVERRIDES = {
  "(vertigo) Paroymsal  Positional Vertigo": "Paroxysmal positional vertigo",
  "Dimorphic hemmorhoids(piles)": "Hemorrhoids (piles)",
  "Paralysis (brain hemorrhage)": "Stroke / brain hemorrhage",
  "Peptic ulcer diseae": "Peptic ulcer disease",
  Osteoarthristis: "Osteoarthritis",
};

const SYMPTOM_ALIAS_OVERRIDES = {
  abdominal_pain: ["belly pain", "stomach pain", "tummy pain"],
  acidity: ["acid reflux", "heartburn"],
  altered_sensorium: ["confusion", "mental confusion"],
  anxiety: ["feeling anxious", "panic"],
  back_pain: ["back pain", "lower back pain"],
  belly_pain: ["belly pain", "tummy pain"],
  blackheads: ["black heads"],
  bladder_discomfort: ["bladder pain", "bladder discomfort"],
  blood_in_sputum: ["coughing blood", "bloody sputum"],
  breathlessness: ["shortness of breath", "difficulty breathing", "hard to breathe"],
  bruising: ["easy bruising", "bruises"],
  burning_micturition: ["burning urination", "burning while urinating", "painful urination"],
  chest_pain: ["tight chest", "chest discomfort"],
  chills: ["feeling cold", "cold chills"],
  congestion: ["blocked nose", "nasal congestion"],
  continuous_sneezing: ["sneezing", "sneezes"],
  cough: ["coughing"],
  dark_urine: ["dark pee", "dark urine"],
  dehydration: ["dry mouth", "dehydrated"],
  diarrhoea: ["diarrhea", "loose stool", "runny stomach"],
  dizziness: ["dizzy", "lightheaded"],
  fatigue: ["tired", "tiredness", "weak", "weakness"],
  "foul_smell_of urine": ["smelly urine", "foul urine smell"],
  headache: ["head pain"],
  high_fever: ["fever", "high temperature", "hot body"],
  indigestion: ["upset stomach"],
  itching: ["itchy skin", "itching skin"],
  joint_pain: ["body pain", "body ache", "body aches"],
  loss_of_appetite: ["no appetite", "reduced appetite", "not eating"],
  mild_fever: ["low fever"],
  mood_swings: ["mood changes"],
  muscle_pain: ["body pain", "body ache", "body aches"],
  nausea: ["feeling sick", "queasy"],
  neck_pain: ["stiff neck", "neck ache"],
  passage_of_gases: ["gas", "passing gas", "bloating gas"],
  phlegm: ["catarrh", "mucus"],
  polyuria: ["frequent urination", "urinating often"],
  redness_of_eyes: ["red eyes"],
  runny_nose: ["nose running"],
  skin_rash: ["rash", "skin rash", "rashes"],
  stomach_bleeding: ["vomiting blood", "bleeding in stomach"],
  sweating: ["sweats", "sweaty"],
  swelling_joints: ["joint swelling"],
  vomiting: ["throwing up", "vomit"],
  watering_from_eyes: ["watery eyes", "teary eyes"],
  weight_gain: ["gaining weight"],
  weight_loss: ["losing weight"],
  yellowing_of_eyes: ["yellow eyes"],
  yellowish_skin: ["yellow skin", "jaundice"],
};

function normalizeWhitespace(value) {
  return value.replace(/\s+/gu, " ").trim();
}

function toTitleCase(value) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function toDisplayLabel(rawKey) {
  if (SYMPTOM_LABEL_OVERRIDES[rawKey]) {
    return SYMPTOM_LABEL_OVERRIDES[rawKey];
  }

  return toTitleCase(normalizeWhitespace(rawKey.replaceAll("_", " ")));
}

function normalizeSearchTerm(value) {
  return normalizeWhitespace(
    value
      .toLowerCase()
      .replace(/[^a-z0-9\s]/gu, " ")
      .replace(/\s+/gu, " "),
  );
}

function createAliases(symptomKey, label) {
  const aliases = new Set([
    normalizeSearchTerm(symptomKey.replaceAll("_", " ")),
    normalizeSearchTerm(label),
  ]);

  for (const alias of SYMPTOM_ALIAS_OVERRIDES[symptomKey] ?? []) {
    aliases.add(normalizeSearchTerm(alias));
  }

  if (symptomKey.includes("_")) {
    const compact = normalizeSearchTerm(symptomKey.replaceAll("_", ""));

    if (compact) {
      aliases.add(compact);
    }
  }

  return Array.from(aliases).filter(Boolean).sort();
}

function toConditionName(rawName) {
  return CONDITION_NAME_OVERRIDES[rawName] ?? toTitleCase(normalizeWhitespace(rawName));
}

function toSlug(value) {
  return normalizeSearchTerm(value).replaceAll(" ", "-");
}

function parseCsvLine(line) {
  return line.split(",");
}

const rawCsv = readFileSync(sourcePath, "utf8").trim();
const lines = rawCsv.split(/\r?\n/u);
const headerCells = parseCsvLine(lines[0]);
const symptomColumns = headerCells.slice(0, -1).map((cell) => cell.trim());
const uniqueSymptomKeys = Array.from(new Set(symptomColumns));

const conditionBuckets = new Map();

for (const line of lines.slice(1)) {
  const cells = parseCsvLine(line);
  const rawCondition = normalizeWhitespace(cells.at(-1) ?? "");

  if (!rawCondition) {
    continue;
  }

  const presentSymptoms = new Set();

  for (let index = 0; index < symptomColumns.length; index += 1) {
    if (cells[index] === "1") {
      presentSymptoms.add(symptomColumns[index]);
    }
  }

  const currentBucket = conditionBuckets.get(rawCondition) ?? {
    rawName: rawCondition,
    rowCount: 0,
    symptomHits: new Map(),
  };

  currentBucket.rowCount += 1;

  for (const symptomKey of presentSymptoms) {
    currentBucket.symptomHits.set(
      symptomKey,
      (currentBucket.symptomHits.get(symptomKey) ?? 0) + 1,
    );
  }

  conditionBuckets.set(rawCondition, currentBucket);
}

const symptomConditionCounts = new Map();

const conditionProfiles = Array.from(conditionBuckets.values())
  .map((bucket) => {
    const symptomEntries = Array.from(bucket.symptomHits.entries())
      .map(([symptomKey, hitCount]) => ({
        key: symptomKey,
        weight: Number((hitCount / bucket.rowCount).toFixed(3)),
      }))
      .sort((left, right) => right.weight - left.weight || left.key.localeCompare(right.key));

    for (const entry of symptomEntries) {
      symptomConditionCounts.set(
        entry.key,
        (symptomConditionCounts.get(entry.key) ?? 0) + 1,
      );
    }

    const totalWeight = Number(
      symptomEntries.reduce((sum, entry) => sum + entry.weight, 0).toFixed(3),
    );

    return {
      rawName: bucket.rawName,
      name: toConditionName(bucket.rawName),
      slug: toSlug(toConditionName(bucket.rawName)),
      rowCount: bucket.rowCount,
      symptomKeys: symptomEntries.map((entry) => entry.key),
      symptomWeights: Object.fromEntries(
        symptomEntries.map((entry) => [entry.key, entry.weight]),
      ),
      totalWeight,
    };
  })
  .sort((left, right) => left.name.localeCompare(right.name));

const symptomCatalog = uniqueSymptomKeys
  .map((symptomKey) => {
    const label = toDisplayLabel(symptomKey);

    return {
      key: symptomKey,
      label,
      aliases: createAliases(symptomKey, label),
      conditionCount: symptomConditionCounts.get(symptomKey) ?? 0,
    };
  })
  .sort((left, right) => left.label.localeCompare(right.label));

const featuredSymptomKeys = [...symptomCatalog]
  .sort(
    (left, right) =>
      right.conditionCount - left.conditionCount || left.label.localeCompare(right.label),
  )
  .slice(0, 12)
  .map((item) => item.key);

const diagnosisDataSource = {
  dataset: "Disease-Prediction-from-Symptoms training dataset",
  sourceUrl:
    "https://github.com/sarthak25/Disease-Prediction-from-Symptoms/blob/master/Training.csv",
  license: "MIT",
  rowCount: lines.length - 1,
  symptomCount: symptomCatalog.length,
  conditionCount: conditionProfiles.length,
  generatedAt: new Date().toISOString(),
};

const output = `export const diagnosisDataSource = ${JSON.stringify(diagnosisDataSource, null, 2)};

export const symptomCatalog = ${JSON.stringify(symptomCatalog, null, 2)};

export const featuredSymptomKeys = ${JSON.stringify(featuredSymptomKeys, null, 2)};

export const conditionProfiles = ${JSON.stringify(conditionProfiles, null, 2)};
`;

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, output);

console.log(
  `Generated src/data.js from ${diagnosisDataSource.rowCount} rows, ${diagnosisDataSource.symptomCount} symptoms, and ${diagnosisDataSource.conditionCount} conditions.`,
);
