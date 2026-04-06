import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiActivity,
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiShield,
} from "react-icons/fi";
const flowSteps = [
  {
    title: "Describe symptoms",
    description: "Capture concerns through a simple text-first flow built for clarity.",
    icon: FiFileText,
  },
  {
    title: "Understand urgency",
    description: "Translate symptoms into a clear low, medium, or high-priority triage signal.",
    icon: FiActivity,
  },
  {
    title: "Take the right next step",
    description: "Show self-care, pharmacy, or hospital guidance without overwhelming the user.",
    icon: FiCheckCircle,
  },
] as const;

const trustSignals = [
  "Mobile-first layout for low to mid-range devices",
  "Readable, calm interface for high-stress moments",
  "Clinical-style urgency cues without alarm fatigue",
] as const;

const previewItems = [
  {
    label: "Urgency",
    value: "Medium",
    tone: "bg-amber-100 text-amber-700",
  },
  {
    label: "Likely next step",
    value: "Talk to a clinician today",
    tone: "bg-sky-100 text-sky-700",
  },
  {
    label: "Confidence",
    value: "Guided by structured symptom intake",
    tone: "bg-emerald-100 text-emerald-700",
  },
] as const;

export function HomePage() {
  return (
    <main className="relative overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col justify-center gap-6">
        <motion.section
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <div className="glass-panel p-8 sm:p-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold tracking-wide text-sky-700">
              <span className="h-2 w-2 rounded-full bg-sky-500" />
              AI Health Triage Assistant
            </div>

            <h1 className="mt-6 max-w-2xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Calm, fast symptom guidance before the panic sets in.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              MOI DOCCTARR helps people explain symptoms, understand urgency, and
              get the next best action in seconds.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className="primary-button"
                to="/assessment/start"
              >
                Start Assessment
                <FiArrowRight className="text-base" />
              </Link>

              <a
                className="secondary-button"
                href="#overview"
              >
                See How It Works
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="stat-card">
                <span className="stat-kicker">Flow</span>
                <strong className="stat-value">3 guided steps</strong>
                <p className="stat-copy">From symptom input to action.</p>
              </div>

              <div className="stat-card">
                <span className="stat-kicker">Support</span>
                <strong className="stat-value">Text-first intake</strong>
                <p className="stat-copy">Focused on clear symptom guidance without extra clutter.</p>
              </div>

              <div className="stat-card">
                <span className="stat-kicker">Design</span>
                <strong className="stat-value">Mobile first</strong>
                <p className="stat-copy">Optimized for smaller screens.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <motion.section
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel p-6"
              initial={{ opacity: 0, x: 20 }}
              transition={{ delay: 0.1, duration: 0.45 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Preview
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-950">
                    Triage Snapshot
                  </h2>
                </div>

                <div className="icon-chip">
                  <FiClock />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {previewItems.map((item) => (
                  <div
                    className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-[0_16px_45px_-30px_rgba(15,23,42,0.55)]"
                    key={item.label}
                  >
                    <p className="text-sm text-slate-500">{item.label}</p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <strong className="text-base text-slate-900">
                        {item.value}
                      </strong>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.tone}`}>
                        Active
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            <motion.section
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel p-6"
              initial={{ opacity: 0, x: 20 }}
              transition={{ delay: 0.18, duration: 0.45 }}
            >
              <div className="flex items-center gap-3">
                <div className="icon-chip icon-chip-success">
                  <FiShield />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-950">Trust Signals</h2>
                  <p className="text-sm text-slate-500">
                    Designed for reassurance, not noise.
                  </p>
                </div>
              </div>

              <ul className="mt-5 space-y-3">
                {trustSignals.map((signal) => (
                  <li
                    className="flex items-start gap-3 rounded-2xl bg-white/65 px-4 py-3 text-sm text-slate-700"
                    key={signal}
                  >
                    <FiCheckCircle className="mt-0.5 shrink-0 text-emerald-600" />
                    <span>{signal}</span>
                  </li>
                ))}
              </ul>
            </motion.section>
          </div>
        </motion.section>

        <section
          className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]"
          id="overview"
        >
          <motion.article
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8"
            initial={{ opacity: 0, y: 16 }}
            transition={{ delay: 0.24, duration: 0.45 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Mission
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950">
              Clearer health decisions for underserved communities.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              The first page focuses on confidence: simple language, visible urgency
              states, and a design system that feels steady on both mobile and desktop.
            </p>

            <div className="mt-6 rounded-3xl bg-slate-950 px-5 py-4 text-sm text-slate-100">
              This webapp is set up with React, TypeScript, Vite, Tailwind, routing,
              React Query providers, and a landing page ready for the next feature.
            </div>
          </motion.article>

          <div className="grid gap-4 md:grid-cols-3">
            {flowSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.article
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel p-6"
                  initial={{ opacity: 0, y: 18 }}
                  key={step.title}
                  transition={{ delay: 0.3 + index * 0.08, duration: 0.4 }}
                >
                  <div className="icon-chip">
                    <Icon />
                  </div>
                  <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-3 text-xl font-bold text-slate-950">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {step.description}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </section>

        <footer className="px-2 pb-2 text-center text-sm text-slate-500">
          MOI DOCCTARR provides preliminary health guidance and does not replace
          professional medical advice.
        </footer>
      </div>
    </main>
  );
}
