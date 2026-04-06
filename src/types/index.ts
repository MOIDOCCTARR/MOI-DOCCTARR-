export type UrgencyLevel = "low" | "medium" | "high";

export interface TriageAssessmentInput {
  ageRange: "0-17" | "18-35" | "36-55" | "55+";
  gender: "Female" | "Male" | "Non-binary / Other" | null;
  knownConditions: string[];
  selectedSymptoms?: string[];
  symptoms: string;
}

export interface TriageAssessmentResult {
  possible_conditions: string[];
  urgency_level: UrgencyLevel;
  recommendation: string;
  follow_up_questions: string[];
  matched_symptoms: string[];
}

export interface SymptomSuggestion {
  key: string;
  label: string;
}
