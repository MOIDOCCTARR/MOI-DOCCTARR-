import { startTransition, useDeferredValue, useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiActivity,
  FiAlertTriangle,
  FiArrowLeft,
  FiCheckCircle,
  FiFileText,
  FiHelpCircle,
  FiSearch,
  FiShield,
  FiUser,
  FiX,
} from "react-icons/fi";
import { toast } from "sonner";
import {
  getSymptomDisplayLabel,
  getSymptomSuggestions,
  requestTriageAssessment,
  triageDataSummary,
} from "../services";
import type { SymptomSuggestion, TriageAssessmentInput, UrgencyLevel } from "../types";

const ageRanges = ["0-17", "18-35", "36-55", "55+"] as const;
const genderOptions = ["Female", "Male", "Non-binary / Other"] as const;
const conditionOptions = [
  "Asthma",
  "Diabetes",
  "Hypertension",
  "Pregnancy",
  "None yet",
] as const;

const setupReasons = [
  {
    title: "Dataset-backed symptom matching",
    copy: "The demo now runs on a local symptom-condition dataset, so it works without live AI calls.",
  },
  {
    title: "Autocomplete support",
    copy: "Start typing a symptom, pick from the library, and the matcher cross-checks the selected symptoms instantly.",
  },
  {
    title: "Clear next steps",
    copy: "Each result returns possible conditions, an urgency level, a recommendation, and follow-up questions.",
  },
] as const;

const urgencyCopy: Record<UrgencyLevel, { description: string; toneClassName: string }> = {
  low: {
    description: "Usually points toward self-care, monitoring, or pharmacy advice.",
    toneClassName: "urgency-pill-low",
  },
  medium: {
    description: "Suggests a prompt clinical review, especially if symptoms continue or worsen.",
    toneClassName: "urgency-pill-medium",
  },
  high: {
    description: "Signals that urgent medical attention may be needed soon.",
    toneClassName: "urgency-pill-high",
  },
};

function getOptionClassName(isActive: boolean) {
  return `rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
    isActive
      ? "border-sky-600 bg-sky-600 text-white shadow-[0_18px_40px_-26px_rgba(13,110,253,0.92)]"
      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-sky-300 hover:bg-white"
  }`;
}

function getKnownConditionsSummary(knownConditions: string[]) {
  return knownConditions.filter((condition) => condition !== "None yet");
}

export function StartAssessmentPage() {
  const [selectedAgeRange, setSelectedAgeRange] = useState<(typeof ageRanges)[number] | null>(
    null,
  );
  const [selectedGender, setSelectedGender] = useState<
    (typeof genderOptions)[number] | null
  >(null);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [symptomQuery, setSymptomQuery] = useState("");
  const deferredSymptomQuery = useDeferredValue(symptomQuery);

  const triageMutation = useMutation({
    mutationFn: requestTriageAssessment,
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleConditionToggle = (condition: (typeof conditionOptions)[number]) => {
    setSelectedConditions((currentConditions) => {
      if (condition === "None yet") {
        return currentConditions.includes(condition) ? [] : [condition];
      }

      const nextConditions = currentConditions.filter((item) => item !== "None yet");

      if (nextConditions.includes(condition)) {
        return nextConditions.filter((item) => item !== condition);
      }

      return [...nextConditions, condition];
    });
  };

  const handleSymptomSelect = (symptomKey: SymptomSuggestion["key"]) => {
    startTransition(() => {
      setSelectedSymptoms((currentSymptoms) => {
        if (currentSymptoms.includes(symptomKey)) {
          return currentSymptoms;
        }

        return [...currentSymptoms, symptomKey];
      });
      setSymptomQuery("");
    });
  };

  const handleSymptomRemove = (symptomKey: SymptomSuggestion["key"]) => {
    startTransition(() => {
      setSelectedSymptoms((currentSymptoms) =>
        currentSymptoms.filter((currentSymptom) => currentSymptom !== symptomKey),
      );
    });
  };

  const handleStartAssessment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedAgeRange) {
      toast.error("Choose an age range before continuing.");
      return;
    }

    if (selectedSymptoms.length === 0) {
      toast.error("Add at least one symptom before searching.");
      return;
    }

    const payload: TriageAssessmentInput = {
      ageRange: selectedAgeRange,
      gender: selectedGender,
      knownConditions: getKnownConditionsSummary(selectedConditions),
      selectedSymptoms,
      symptoms: "",
    };

    await triageMutation.mutateAsync(payload);
  };

  const cleanedKnownConditions = getKnownConditionsSummary(selectedConditions);
  const triageResult = triageMutation.data;
  const activeUrgencyTone = triageResult ? urgencyCopy[triageResult.urgency_level] : null;
  const symptomSuggestions = getSymptomSuggestions(deferredSymptomQuery, selectedSymptoms);

  return (
    <main className="relative overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1540px] flex-col gap-6">
        <motion.header
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
          initial={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Link
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-sky-700"
            to="/"
          >
            <FiArrowLeft className="text-base" />
            Back to home
          </Link>

          <div className="inline-flex items-center gap-2 self-start rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700 sm:self-auto">
            <FiShield />
            Safe triage start
          </div>
        </motion.header>

        <div className="grid gap-6 xl:grid-cols-[1.22fr_0.78fr]">
          <motion.section
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8 sm:p-10"
            initial={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.48, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold tracking-wide text-sky-700">
              <span className="h-2 w-2 rounded-full bg-sky-500" />
              Assessment
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
              Describe symptoms and get calm, structured triage guidance.
            </h1>

            <p className="mt-5 max-w-4xl text-base leading-7 text-slate-600 sm:text-lg">
              Share the age range, any known conditions, and what the person is feeling.
              Everything is reviewed together in one symptom check.
            </p>

            <div className="assessment-alert mt-8">
              <div className="icon-chip icon-chip-warning">
                <FiAlertTriangle />
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-700">
                  Emergency note
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700 sm:text-base">
                  If someone has severe trouble breathing, chest pain, heavy bleeding,
                  seizures, stroke symptoms, or is unresponsive, skip this flow and get
                  emergency help immediately.
                </p>
              </div>
            </div>

            <form
              className="mt-10 space-y-5"
              onSubmit={handleStartAssessment}
            >
              <div className="grid gap-5 md:grid-cols-2">
                <section className="rounded-[1.75rem] border border-white/65 bg-white/75 p-6 shadow-[0_22px_60px_-40px_rgba(15,23,42,0.45)]">
                  <div className="flex items-center gap-3">
                    <div className="icon-chip">
                      <FiUser />
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Required
                      </p>
                      <h2 className="mt-1 text-xl font-bold text-slate-950">Age range</h2>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {ageRanges.map((ageRange) => (
                      <button
                        aria-pressed={selectedAgeRange === ageRange}
                        className={getOptionClassName(selectedAgeRange === ageRange)}
                        key={ageRange}
                        onClick={() => setSelectedAgeRange(ageRange)}
                        type="button"
                      >
                        {ageRange}
                      </button>
                    ))}
                  </div>
                </section>

                <section className="rounded-[1.75rem] border border-white/65 bg-white/75 p-6 shadow-[0_22px_60px_-40px_rgba(15,23,42,0.45)]">
                  <div className="flex items-center gap-3">
                    <div className="icon-chip">
                      <FiUser />
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Optional
                      </p>
                      <h2 className="mt-1 text-xl font-bold text-slate-950">Gender</h2>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      {genderOptions.slice(0, 2).map((gender) => (
                        <button
                          aria-pressed={selectedGender === gender}
                          className={getOptionClassName(selectedGender === gender)}
                          key={gender}
                          onClick={() => setSelectedGender(gender)}
                          type="button"
                        >
                          {gender}
                        </button>
                      ))}
                    </div>

                    <button
                      aria-pressed={selectedGender === genderOptions[2]}
                      className={getOptionClassName(selectedGender === genderOptions[2])}
                      onClick={() => setSelectedGender(genderOptions[2])}
                      type="button"
                    >
                      {genderOptions[2]}
                    </button>

                    <button
                      className="text-left text-sm font-semibold text-slate-500 transition hover:text-sky-700"
                      onClick={() => setSelectedGender(null)}
                      type="button"
                    >
                      Prefer not to say
                    </button>
                  </div>
                </section>
              </div>

              <section className="rounded-[1.75rem] border border-white/65 bg-white/75 p-6 shadow-[0_22px_60px_-40px_rgba(15,23,42,0.45)]">
                <div className="flex items-center gap-3">
                  <div className="icon-chip">
                    <FiShield />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Optional
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-slate-950">Known conditions</h2>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Pick any that matter. These details are included in the same symptom search.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  {conditionOptions.map((condition) => {
                    const isActive = selectedConditions.includes(condition);

                    return (
                      <button
                        aria-pressed={isActive}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                          isActive
                            ? "border-sky-600 bg-sky-600 text-white shadow-[0_16px_35px_-24px_rgba(13,110,253,0.9)]"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:border-sky-300 hover:bg-white"
                        }`}
                        key={condition}
                        onClick={() => handleConditionToggle(condition)}
                        type="button"
                      >
                        {condition}
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="rounded-[1.75rem] border border-white/65 bg-white/75 p-6 shadow-[0_22px_60px_-40px_rgba(15,23,42,0.45)]">
                <div className="flex items-center gap-3">
                  <div className="icon-chip">
                    <FiFileText />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Required
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-slate-950">Symptoms</h2>
                  </div>
                </div>

                <div className="mt-5 rounded-[1.5rem] border border-sky-100 bg-sky-50/90 p-4 text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">Demo data source</p>
                  <p className="mt-2 leading-6">
                    Autocomplete and matching are backed by {triageDataSummary.rowCount.toLocaleString()}{" "}
                    public symptom profiles, {triageDataSummary.symptomCount} symptom terms, and{" "}
                    {triageDataSummary.conditionCount} condition patterns.
                  </p>
                </div>

                <label
                  className="mt-5 block text-sm font-semibold text-slate-700"
                  htmlFor="assessment-symptom-search"
                >
                  Add symptoms from data
                </label>
                <div className="mt-2 rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-sky-400 focus-within:bg-white">
                  <div className="flex items-center gap-3">
                    <FiSearch className="shrink-0 text-slate-400" />
                    <input
                      autoComplete="off"
                      className="w-full border-none bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                      id="assessment-symptom-search"
                      onChange={(event) => setSymptomQuery(event.target.value)}
                      placeholder="Search symptoms like fever, cough, rash, dizziness..."
                      value={symptomQuery}
                    />
                  </div>
                </div>

                {selectedSymptoms.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedSymptoms.map((symptomKey) => (
                      <button
                        className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-3 py-2 text-sm font-semibold text-sky-800 transition hover:border-sky-400"
                        key={symptomKey}
                        onClick={() => handleSymptomRemove(symptomKey)}
                        type="button"
                      >
                        <span>{getSymptomDisplayLabel(symptomKey)}</span>
                        <FiX className="text-sm" />
                      </button>
                    ))}
                  </div>
                ) : null}

                <div className="mt-4 flex flex-wrap gap-2">
                  {symptomSuggestions.map((suggestion) => (
                    <button
                      className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
                      key={suggestion.key}
                      onClick={() => handleSymptomSelect(suggestion.key)}
                      type="button"
                    >
                      {suggestion.label}
                    </button>
                  ))}
                </div>

                {symptomSuggestions.length === 0 && deferredSymptomQuery.trim().length > 0 ? (
                  <p className="mt-3 text-sm text-slate-500">
                    No exact symptom match found. Try a simpler word.
                  </p>
                ) : null}

                <div className="mt-5 flex flex-col gap-4 rounded-[1.5rem] bg-slate-950 px-5 py-4 text-sm text-slate-100 md:flex-row md:items-center md:justify-between">
                  <p className="max-w-2xl leading-6 text-slate-200">
                    One search cross-matches age, known conditions, and selected symptoms
                    before returning possible conditions, urgency, and next steps.
                  </p>

                  <button
                    className="primary-button min-w-52 disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={triageMutation.isPending}
                    type="submit"
                  >
                    <FiSearch className={triageMutation.isPending ? "animate-spin" : ""} />
                    {triageMutation.isPending ? "Checking symptoms..." : "Get guidance"}
                  </button>
                </div>
              </section>
            </form>
          </motion.section>

          <div className="flex flex-col gap-6">
            <motion.section
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel p-6"
              initial={{ opacity: 0, x: 18 }}
              transition={{ delay: 0.08, duration: 0.45 }}
            >
              <div className="flex items-center gap-3">
                <div className="icon-chip">
                  <FiCheckCircle />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                    How this works
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-950">
                    One combined symptom check
                  </h2>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {setupReasons.map((reason) => (
                  <article
                    className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-[0_16px_45px_-30px_rgba(15,23,42,0.55)]"
                    key={reason.title}
                  >
                    <h3 className="text-base font-bold text-slate-950">{reason.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{reason.copy}</p>
                  </article>
                ))}
              </div>

              <div className="mt-6 rounded-3xl bg-slate-950 px-5 py-4 text-sm leading-6 text-slate-100">
                The demo stays deterministic and structured. It cross-matches the local dataset,
                avoids definitive diagnosis, and always includes a medical disclaimer.
              </div>
            </motion.section>

            <motion.section
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel p-6"
              initial={{ opacity: 0, x: 18 }}
              transition={{ delay: 0.16, duration: 0.45 }}
            >
              <div className="flex items-center gap-3">
                <div className="icon-chip icon-chip-active">
                  <FiActivity />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Result
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-950">
                    Assessment output
                  </h2>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-white/68 p-4">
                  <p className="text-sm text-slate-500">Submitted age range</p>
                  <strong className="mt-2 block text-base text-slate-950">
                    {selectedAgeRange ?? "Not selected"}
                  </strong>
                </div>

                <div className="rounded-2xl bg-white/68 p-4">
                  <p className="text-sm text-slate-500">Known conditions</p>
                  <strong className="mt-2 block text-base text-slate-950">
                    {cleanedKnownConditions.length > 0
                      ? cleanedKnownConditions.join(", ")
                      : "None added"}
                  </strong>
                </div>

                <div className="rounded-2xl bg-white/68 p-4">
                  <p className="text-sm text-slate-500">Selected symptoms</p>
                  <strong className="mt-2 block text-base text-slate-950">
                    {selectedSymptoms.length > 0
                      ? selectedSymptoms
                          .map((symptomKey) => getSymptomDisplayLabel(symptomKey))
                          .join(", ")
                      : "None added"}
                  </strong>
                </div>

                {!triageResult ? (
                  <div className="rounded-[1.75rem] border border-dashed border-slate-200 bg-slate-50/80 p-5 text-sm leading-6 text-slate-600">
                    Results will appear here after you submit the combined symptom check.
                  </div>
                ) : (
                  <>
                    <div className="rounded-[1.75rem] border border-white/60 bg-white/75 p-5 shadow-[0_20px_48px_-34px_rgba(15,23,42,0.45)]">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm text-slate-500">Urgency level</p>
                          <strong className="mt-2 block text-2xl capitalize text-slate-950">
                            {triageResult.urgency_level}
                          </strong>
                        </div>
                        <span className={`urgency-pill ${activeUrgencyTone?.toneClassName ?? ""}`}>
                          {triageResult.urgency_level}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {activeUrgencyTone?.description}
                      </p>
                    </div>

                    <div className="rounded-[1.75rem] border border-white/60 bg-white/75 p-5 shadow-[0_20px_48px_-34px_rgba(15,23,42,0.45)]">
                      <div className="flex items-center gap-3">
                        <div className="icon-chip">
                          <FiSearch />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Cross-matched symptoms</p>
                          <strong className="mt-1 block text-lg text-slate-950">
                            Symptoms found in the dataset
                          </strong>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {triageResult.matched_symptoms.map((symptom) => (
                          <span
                            className="rounded-full bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-800"
                            key={symptom}
                          >
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[1.75rem] border border-white/60 bg-white/75 p-5 shadow-[0_20px_48px_-34px_rgba(15,23,42,0.45)]">
                      <div className="flex items-center gap-3">
                        <div className="icon-chip">
                          <FiShield />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Possible conditions</p>
                          <strong className="mt-1 block text-lg text-slate-950">
                            Common likely causes
                          </strong>
                        </div>
                      </div>

                      <ul className="mt-4 space-y-3">
                        {triageResult.possible_conditions.map((condition) => (
                          <li
                            className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
                            key={condition}
                          >
                            <FiCheckCircle className="mt-0.5 shrink-0 text-emerald-600" />
                            <span>{condition}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-[1.75rem] border border-white/60 bg-white/75 p-5 shadow-[0_20px_48px_-34px_rgba(15,23,42,0.45)]">
                      <div className="flex items-center gap-3">
                        <div className="icon-chip">
                          <FiFileText />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Recommendation</p>
                          <strong className="mt-1 block text-lg text-slate-950">
                            Suggested next step
                          </strong>
                        </div>
                      </div>

                      <p className="mt-4 text-sm leading-7 text-slate-700">
                        {triageResult.recommendation}
                      </p>
                    </div>

                    <div className="rounded-[1.75rem] border border-white/60 bg-white/75 p-5 shadow-[0_20px_48px_-34px_rgba(15,23,42,0.45)]">
                      <div className="flex items-center gap-3">
                        <div className="icon-chip">
                          <FiHelpCircle />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Follow-up questions</p>
                          <strong className="mt-1 block text-lg text-slate-950">
                            Helpful details to confirm next
                          </strong>
                        </div>
                      </div>

                      <ul className="mt-4 space-y-3">
                        {triageResult.follow_up_questions.map((question) => (
                          <li
                            className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700"
                            key={question}
                          >
                            <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">
                              ?
                            </span>
                            <span>{question}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </main>
  );
}
