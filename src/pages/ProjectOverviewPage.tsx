import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiActivity,
  FiAlertTriangle,
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiCpu,
  FiFileText,
  FiGlobe,
  FiLayers,
  FiMic,
  FiShield,
  FiZap,
} from "react-icons/fi";

const coreFlow = [
  "User enters symptoms",
  "AI analyzes",
  "System returns possible conditions, urgency level, and what to do next",
] as const;

const promptRules = [
  "Do not provide a definitive diagnosis",
  "Do not cause panic",
  "Do not mention life-threatening diseases unless clearly relevant",
  "Always stay calm, neutral, and professional",
  "Always include a disclaimer in the recommendation",
] as const;

const userInputSignals = [
  "Symptoms = main signal",
  "Age = risk factor",
  "Duration = severity indicator",
] as const;

const triageLevels = [
  {
    level: "Low",
    meaning: "Minor issue",
    action: "Self-care",
    toneClassName: "urgency-pill-low",
  },
  {
    level: "Medium",
    meaning: "Needs attention",
    action: "Pharmacy / clinic",
    toneClassName: "urgency-pill-medium",
  },
  {
    level: "High",
    meaning: "Serious",
    action: "Hospital immediately",
    toneClassName: "urgency-pill-high",
  },
] as const;

const frontendMapping = [
  ["possible_conditions", "list"],
  ["urgency_level", "colored badge"],
  ["recommendation", "main message"],
  ["follow_up_questions", "next interaction"],
] as const;

const mvpFeatures = [
  "Text symptom input",
  "AI response",
  "Triage level",
  "Clean UI",
] as const;

const futureFeatures = [
  { label: "Voice input/output", icon: FiMic },
  { label: "Body map interaction", icon: FiActivity },
  { label: "Local language support", icon: FiGlobe },
  { label: "Smarter AI personalization", icon: FiCpu },
] as const;

const principleCards = [
  "Keep it simple",
  "Keep it fast",
  "Build trust",
] as const;

const sections = [
  {
    id: "core-idea",
    kicker: "1. Core Idea",
    title: "This is a triage system, not a diagnosis app.",
    icon: FiLayers,
  },
  {
    id: "system-prompt",
    kicker: "2. System Prompt",
    title: "The prompt is the brain that keeps outputs safe and structured.",
    icon: FiCpu,
  },
  {
    id: "user-input",
    kicker: "3. User Input Structure",
    title: "Inputs should stay simple but clinically useful.",
    icon: FiFileText,
  },
  {
    id: "backend",
    kicker: "4. AI Function",
    title: "Backend logic turns symptom input into structured JSON.",
    icon: FiZap,
  },
  {
    id: "triage-logic",
    kicker: "5. Triage Logic",
    title: "The real value is helping users decide how worried they should be.",
    icon: FiActivity,
  },
  {
    id: "follow-up",
    kicker: "6. Follow-Up Questions",
    title: "Short follow-ups improve accuracy and guide next steps.",
    icon: FiCheckCircle,
  },
  {
    id: "frontend",
    kicker: "7. Frontend Mapping",
    title: "The UI should map directly to the structured response.",
    icon: FiLayers,
  },
  {
    id: "safety",
    kicker: "8. Safety Layer",
    title: "Manual overrides must sit above model output.",
    icon: FiShield,
  },
  {
    id: "mvp",
    kicker: "9. MVP Features",
    title: "Start with the smallest useful version.",
    icon: FiArrowRight,
  },
  {
    id: "future",
    kicker: "10. Future Features",
    title: "Expand once the core triage loop is trusted.",
    icon: FiMic,
  },
  {
    id: "performance",
    kicker: "11. Performance Settings",
    title: "Use fast, cheap, and consistent model settings.",
    icon: FiZap,
  },
  {
    id: "disclaimer",
    kicker: "12. Safety & Disclaimer",
    title: "Always remind users this is not a diagnosis.",
    icon: FiAlertTriangle,
  },
  {
    id: "final-product",
    kicker: "13. Final Product Idea",
    title: "MOI DOCTAR is a health decision assistant.",
    icon: FiShield,
  },
] as const;

const systemPromptSnippet = `const SYSTEM_PROMPT = \`
You are MOI DOCTAR, an AI-powered health triage assistant.

Your role is to provide SAFE, CLEAR, and STRUCTURED preliminary health guidance.

Rules:
- Do not provide a definitive diagnosis
- Do not cause panic
- Do not mention life-threatening diseases unless clearly relevant
- Always stay calm, neutral, and professional
- Always include a disclaimer in recommendation

Return:
1. possible_conditions
2. urgency_level
3. recommendation
4. follow_up_questions
\`;`;

const userPromptSnippet = `const userPrompt = \`
Symptoms: \${symptoms}
Age: \${age || "unknown"}
Duration: \${duration || "not specified"}
\`;`;

const backendSnippet = `export async function analyzeSymptoms(data) {
  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0.3,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: \`
Symptoms: \${data.symptoms}
Age: \${data.age || "unknown"}
Duration: \${data.duration || "not specified"}
        \`,
      },
    ],
  });

  return JSON.parse(response.choices[0].message.content);
}`;

const uiLogicSnippet = `if (urgency === "high") showRedAlert();
if (urgency === "medium") showWarning();
if (urgency === "low") showSafeState();`;

const safetySnippet = `if (symptoms.includes("chest pain")) {
  return {
    urgency_level: "high",
    recommendation: "Seek immediate medical attention.",
  };
}`;

const performanceSnippet = `model: "gpt-4.1-mini"
temperature: 0.3`;

function renderCodeCard(title: string, code: string) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-5 shadow-[0_24px_50px_-36px_rgba(15,23,42,0.65)]">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">{title}</p>
      <pre className="mt-4 overflow-x-auto text-sm leading-6 text-slate-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function ProjectOverviewPage() {
  return (
    <main className="relative overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col gap-6">
        <motion.header
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel flex flex-col gap-4 px-5 py-5 sm:px-6"
          initial={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-sky-700"
              to="/"
            >
              <FiArrowLeft className="text-base" />
              Back to home
            </Link>

            <div className="inline-flex items-center gap-2 self-start rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700 sm:self-auto">
              <FiLayers />
              Overall project overview
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                MOI DOCTAR
              </p>
              <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
                AI triage system vision, product logic, and rollout direction.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
                This page captures the full product intent for the main webapp: what the system
                is, how the AI should behave, how safety works, how the UI maps to responses,
                and where the MVP should go first.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  className="primary-button"
                  to="/assessment/start"
                >
                  Open Demo Assessment
                  <FiArrowRight className="text-base" />
                </Link>

                <a
                  className="secondary-button"
                  href="#overview-sections"
                >
                  Jump To Breakdown
                </a>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <div className="stat-card">
                <span className="stat-kicker">Product Type</span>
                <strong className="stat-value">Health decision assistant</strong>
                <p className="stat-copy">Built to guide urgency and next action.</p>
              </div>

              <div className="stat-card">
                <span className="stat-kicker">Core Loop</span>
                <strong className="stat-value">Input → AI → JSON → UI</strong>
                <p className="stat-copy">A structured response powers the experience.</p>
              </div>

              <div className="stat-card">
                <span className="stat-kicker">Safety Goal</span>
                <strong className="stat-value">Clarity without panic</strong>
                <p className="stat-copy">Helpful, calm, and never positioned as a doctor.</p>
              </div>
            </div>
          </div>
        </motion.header>

        <section
          className="grid gap-4 md:grid-cols-3"
          id="overview-sections"
        >
          {sections.map((section, index) => {
            const Icon = section.icon;

            return (
              <motion.article
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-5"
                initial={{ opacity: 0, y: 18 }}
                key={section.id}
                transition={{ delay: 0.06 * index, duration: 0.35 }}
              >
                <div className="icon-chip">
                  <Icon />
                </div>
                <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
                  {section.kicker}
                </p>
                <h2 className="mt-3 text-xl font-bold text-slate-950">{section.title}</h2>
              </motion.article>
            );
          })}
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <motion.article
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8"
            initial={{ opacity: 0, y: 18 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              1. Core Idea
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950">
              Build triage, not diagnosis.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              The system should help a user understand urgency and choose the next action. It is
              not meant to behave like a doctor or replace clinical care.
            </p>

            <div className="mt-6 rounded-[1.75rem] border border-sky-100 bg-sky-50/90 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
                Flow
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                {coreFlow.map((item) => (
                  <li
                    className="flex items-start gap-3"
                    key={item}
                  >
                    <FiArrowRight className="mt-1 shrink-0 text-sky-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.article>

          <motion.article
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8"
            initial={{ opacity: 0, y: 18 }}
            transition={{ delay: 0.16, duration: 0.4 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              2. System Prompt
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950">
              The prompt should constrain the model before anything else.
            </h2>

            <ul className="mt-5 space-y-3">
              {promptRules.map((rule) => (
                <li
                  className="flex items-start gap-3 rounded-2xl bg-white/70 px-4 py-3 text-sm text-slate-700"
                  key={rule}
                >
                  <FiShield className="mt-0.5 shrink-0 text-emerald-600" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6">{renderCodeCard("System Prompt", systemPromptSnippet)}</div>
          </motion.article>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <motion.article
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8"
            initial={{ opacity: 0, y: 18 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              3. User Input Structure
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950">
              Symptoms, age, and duration give the model useful context.
            </h2>
            <div className="mt-6">{renderCodeCard("User Prompt", userPromptSnippet)}</div>

            <div className="mt-6 space-y-3">
              {userInputSignals.map((signal) => (
                <div
                  className="rounded-2xl bg-white/70 px-4 py-3 text-sm font-medium text-slate-700"
                  key={signal}
                >
                  {signal}
                </div>
              ))}
            </div>
          </motion.article>

          <motion.article
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8"
            initial={{ opacity: 0, y: 18 }}
            transition={{ delay: 0.24, duration: 0.4 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              4. AI Function
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950">
              Backend analysis should return strict structured output.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              The backend should own the model call, keep settings controlled, and parse the
              response into the same object shape the frontend expects.
            </p>
            <div className="mt-6">{renderCodeCard("Backend Function", backendSnippet)}</div>
          </motion.article>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <motion.article
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8"
            initial={{ opacity: 0, y: 18 }}
            transition={{ delay: 0.28, duration: 0.4 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              5. Triage Logic
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950">
              Users mostly want to know whether they should worry.
            </h2>

            <div className="mt-6 space-y-4">
              {triageLevels.map((item) => (
                <div
                  className="rounded-[1.75rem] border border-white/60 bg-white/75 p-5 shadow-[0_20px_48px_-34px_rgba(15,23,42,0.45)]"
                  key={item.level}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-500">Meaning</p>
                      <strong className="mt-2 block text-xl text-slate-950">{item.meaning}</strong>
                    </div>
                    <span className={`urgency-pill ${item.toneClassName}`}>{item.level}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">Action: {item.action}</p>
                </div>
              ))}
            </div>
          </motion.article>

          <motion.article
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8"
            initial={{ opacity: 0, y: 18 }}
            transition={{ delay: 0.32, duration: 0.4 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              6. Follow-Up Questions
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950">
              Follow-ups make the experience feel interactive and useful.
            </h2>
            <div className="mt-6 rounded-[1.75rem] border border-sky-100 bg-sky-50/90 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
                Example output
              </p>
              <pre className="mt-4 overflow-x-auto text-sm leading-6 text-slate-800">
                <code>{`"follow_up_questions": [
  "Do you have a fever?",
  "How long has the pain lasted?"
]`}</code>
              </pre>
            </div>

            <ul className="mt-6 space-y-3 text-sm leading-6 text-slate-700">
              <li className="flex items-start gap-3">
                <FiCheckCircle className="mt-1 shrink-0 text-emerald-600" />
                <span>Improve accuracy</span>
              </li>
              <li className="flex items-start gap-3">
                <FiCheckCircle className="mt-1 shrink-0 text-emerald-600" />
                <span>Create interaction</span>
              </li>
              <li className="flex items-start gap-3">
                <FiCheckCircle className="mt-1 shrink-0 text-emerald-600" />
                <span>Guide next steps</span>
              </li>
            </ul>
          </motion.article>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <motion.article
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8"
            initial={{ opacity: 0, y: 18 }}
            transition={{ delay: 0.36, duration: 0.4 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              7. Frontend Mapping
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950">
              Every response field should map cleanly to a visible UI block.
            </h2>

            <div className="mt-6 space-y-3">
              {frontendMapping.map(([data, ui]) => (
                <div
                  className="flex items-center justify-between gap-4 rounded-2xl bg-white/70 px-4 py-4 text-sm"
                  key={data}
                >
                  <code className="font-semibold text-slate-900">{data}</code>
                  <span className="text-slate-600">{ui}</span>
                </div>
              ))}
            </div>

            <div className="mt-6">{renderCodeCard("UI Logic", uiLogicSnippet)}</div>
          </motion.article>

          <motion.article
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8"
            initial={{ opacity: 0, y: 18 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              8. Safety Layer
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950">
              Manual overrides should catch obvious red-flag symptoms immediately.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              The system should never rely only on AI. Some symptoms must hard-force a high
              urgency recommendation even before model interpretation is trusted.
            </p>
            <div className="mt-6">{renderCodeCard("Manual Override", safetySnippet)}</div>
          </motion.article>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <motion.article
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8"
            initial={{ opacity: 0, y: 18 }}
            transition={{ delay: 0.44, duration: 0.4 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              9. MVP Features
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950">
              Start lean and prove the triage loop first.
            </h2>
            <ul className="mt-6 space-y-3">
              {mvpFeatures.map((feature) => (
                <li
                  className="flex items-start gap-3 rounded-2xl bg-white/70 px-4 py-3 text-sm text-slate-700"
                  key={feature}
                >
                  <FiCheckCircle className="mt-0.5 shrink-0 text-emerald-600" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </motion.article>

          <motion.article
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8"
            initial={{ opacity: 0, y: 18 }}
            transition={{ delay: 0.48, duration: 0.4 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              10. Future Features
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950">
              Expand only after the foundation feels reliable.
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {futureFeatures.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    className="rounded-[1.75rem] border border-white/60 bg-white/75 p-5 shadow-[0_20px_48px_-34px_rgba(15,23,42,0.45)]"
                    key={feature.label}
                  >
                    <div className="icon-chip">
                      <Icon />
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-slate-950">{feature.label}</h3>
                  </div>
                );
              })}
            </div>
          </motion.article>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <motion.article
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8"
            initial={{ opacity: 0, y: 18 }}
            transition={{ delay: 0.52, duration: 0.4 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              11. Performance
            </p>
            <h2 className="mt-3 text-2xl font-bold text-slate-950">
              Fast, cheap, consistent.
            </h2>
            <div className="mt-6">{renderCodeCard("Recommended Settings", performanceSnippet)}</div>
          </motion.article>

          <motion.article
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8"
            initial={{ opacity: 0, y: 18 }}
            transition={{ delay: 0.56, duration: 0.4 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              12. Disclaimer
            </p>
            <h2 className="mt-3 text-2xl font-bold text-slate-950">
              Always keep the safety statement visible.
            </h2>
            <div className="mt-6 rounded-[1.75rem] border border-amber-200 bg-amber-50/90 p-5 text-sm leading-6 text-slate-700">
              This is not a medical diagnosis. Consult a healthcare professional.
            </div>
          </motion.article>

          <motion.article
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8"
            initial={{ opacity: 0, y: 18 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              13. Final Product
            </p>
            <h2 className="mt-3 text-2xl font-bold text-slate-950">
              A health decision assistant, not a doctor.
            </h2>
            <ul className="mt-6 space-y-3 text-sm leading-6 text-slate-700">
              {principleCards.map((principle) => (
                <li
                  className="rounded-2xl bg-white/70 px-4 py-3 font-medium"
                  key={principle}
                >
                  {principle}
                </li>
              ))}
            </ul>
          </motion.article>
        </section>

        <motion.section
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8"
          initial={{ opacity: 0, y: 18 }}
          transition={{ delay: 0.64, duration: 0.4 }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Summary
          </p>
          <h2 className="mt-3 text-3xl font-bold text-slate-950">
            Input → AI → Structured JSON → UI → User decision
          </h2>
          <p className="mt-4 max-w-4xl text-base leading-7 text-slate-600">
            That is the full product direction. Keep the system simple, fast, structured, and
            trustworthy, and let every layer support a single goal: helping the user make a safer
            next decision.
          </p>
        </motion.section>
      </div>
    </main>
  );
}
