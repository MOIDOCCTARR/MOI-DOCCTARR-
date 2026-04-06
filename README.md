# 🩺 MOI DOCCTARR — AI Health Triage Assistant

> **Fast. Accessible. Trustworthy.**
> MOI DOCCTARR is a mobile-first AI-powered health triage assistant that helps users understand symptoms, assess urgency, and take the right next step — in seconds.

---

<p align="center">
  <b>⚡ Symptom → 🧠 Analysis → 🚦 Action</b>
</p>

---

## 📚 Table of Contents

* [Product Overview](#product-overview)
* [Core Features](#core-features)
* [Tech Stack](#tech-stack)
* [System Architecture](#system-architecture)
* [Getting Started](#getting-started)
* [Project Structure](#project-structure)
* [Design System](#design-system)
* [State & Data Flow](#state--data-flow)
* [Coding Standards](#coding-standards)
* [Git Workflow](#git-workflow)
* [Environment Variables](#environment-variables)
* [Performance & Accessibility](#performance--accessibility)
* [Security & Privacy](#security--privacy)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [Disclaimer](#disclaimer)

---

# 🧭 Product Overview

**MOI DOCCTARR** bridges the gap between **uncertainty and informed health decisions**.

Users can:

* Describe symptoms (text, voice, body map)
* Receive possible conditions
* Understand urgency level
* Get clear next steps

---

## 🎯 Mission

> Reduce delays in accessing medical insight by delivering fast, reliable preliminary guidance — especially in underserved communities.

---

## 👤 Target Users

* Mobile-first users (low to mid-end devices)
* Individuals with limited healthcare access
* Users with varying literacy levels (voice support)

---

# 🧩 Core Features

| Feature                     | Description                                      |
| --------------------------- | ------------------------------------------------ |
| 🧠 **Symptom Analysis**     | Intelligent processing of user symptoms          |
| 🚦 **Triage Engine**        | Urgency classification: Low / Medium / High      |
| 📋 **Actionable Guidance**  | Clear next steps (self-care, pharmacy, hospital) |
| 🧍 **Interactive Body Map** | Visual symptom input                             |
| 🎤 **Voice Interaction**    | Speech input & output                            |
| 🌍 **Localization**         | Support for local languages (planned)            |
| ⚡ **PWA Support**           | Installable, offline-capable web app             |

---

# 🏗️ Tech Stack

## 🧪 Core Technologies

| Layer         | Technology                |
| ------------- | ------------------------- |
| Framework     | React + TypeScript + Vite |
| Styling       | Tailwind CSS              |
| Routing       | React Router              |
| Server State  | TanStack Query            |
| Global State  | Zustand                   |
| HTTP          | Axios                     |
| Forms         | React Hook Form + Zod     |
| Animations    | Framer Motion             |
| Icons         | React Icons               |
| Notifications | Sonner                    |
| Date Utils    | date-fns                  |

---

## ⚙️ Advanced Capabilities

| Feature  | Tool                          |
| -------- | ----------------------------- |
| PWA      | vite-plugin-pwa               |
| Body Map | SVG (MVP) → react-three-fiber |
| Voice    | Web Speech API                |
| Caching  | Service Workers               |

---

# 🧠 System Architecture

```id="arch1"
User Input (Text / Voice / Body)
        ↓
Frontend (React UI)
        ↓
API Layer (Axios / React Query)
        ↓
Triage Engine (Backend Logic)
        ↓
Response:
- Condition
- Urgency
- Next Step
```

---

# 🚀 Getting Started

## Prerequisites

* Node.js ≥ 18
* npm ≥ 9

---

## Setup

```bash id="setup1"
git clone <repo-url>
cd moi-docctarr-frontend
npm install
cp .env.example .env
npm run dev
```

---

## Scripts

| Command          | Description          |
| ---------------- | -------------------- |
| npm run dev      | Start dev server     |
| npm run build    | Build for production |
| npm run preview  | Preview build        |
| npx tsc --noEmit | Type check           |

---

# 🗂️ Project Structure

```id="struct1"
src/
├── app/                # App providers, router setup
├── assets/             # Images, icons
├── components/
│   ├── ui/             # Buttons, inputs
│   └── shared/         # Navbar, layout
│
├── config/             # Env & theme config
├── features/           # Domain-based modules
│   ├── symptom/
│   ├── triage/
│
├── hooks/              # Custom hooks
├── pages/              # Route-level views
├── services/           # API layer
├── store/              # Zustand state
├── utils/              # Helpers
├── types/              # TS types
│
├── main.tsx
└── router.tsx
```

---

# 🎨 Design System

## 🎯 Philosophy

> Clean. Calm. Medical-grade clarity.

---

## 🎨 Color Palette

### Primary

* Blue: `#0D6EFD`
* White: `#FFFFFF`

### Supporting

* Light Blue: `#E7F1FF`
* Dark Blue: `#0A58CA`

### Semantic (Critical)

| Type       | Color     | Meaning        |
| ---------- | --------- | -------------- |
| 🟢 Success | `#198754` | Low urgency    |
| 🟡 Warning | `#FFC107` | Medium urgency |
| 🔴 Danger  | `#DC3545` | High urgency   |

---

## ✍️ Typography

* Headings: Bold, high contrast
* Body: Clean, readable
* Avoid clutter

---

# 🔄 State & Data Flow

| State Type  | Tool        |
| ----------- | ----------- |
| Local UI    | useState    |
| Server Data | React Query |
| Global      | Zustand     |

---

# 🧼 Coding Standards

## TypeScript

* Strict mode enabled
* No `any`
* Strong typing for all APIs

---

## Component Rules

* Single responsibility
* Reusable
* Clean props

---

## Naming

| Type      | Format       |
| --------- | ------------ |
| Component | PascalCase   |
| Hook      | useSomething |
| Function  | camelCase    |

---

# 🌿 Git Workflow

## Branching

* `main`
* `dev`
* `feature/*`
* `fix/*`

---

## Commit Convention

```id="commit1"
feat: add triage logic
fix: correct symptom parsing
style: improve UI spacing
```

---

# 🔐 Environment Variables

```env id="env1"
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=MOI DOCCTARR
```

---

# ⚡ Performance & Accessibility

## Performance

* Lazy loading routes
* Optimize assets
* Avoid unnecessary re-renders

## Accessibility

* Proper labels
* High contrast UI
* Voice interaction support

---

# 🔒 Security & Privacy

* No sensitive data storage
* HTTPS required
* Input validation
* Minimal data collection

---

# 🛣️ Roadmap

## Phase 1 (MVP)

* Text input
* Basic triage
* Result screen

## Phase 2

* Voice input/output
* Body map UI

## Phase 3

* AI improvements
* Localization

---

# 🤝 Contributing

## Rules

* Use TypeScript properly
* Follow design system
* Use feature-based structure

---

## Commit Style

* feat:
* fix:
* chore:
* refactor:
* style:

---

# ⚠️ Disclaimer

> MOI DOCCTARR provides preliminary health guidance only and does not replace professional medical advice. Always consult a qualified healthcare professional.

---

# 💥 Final Principle

> **Clarity over complexity. Speed over perfection. Trust above all.**

---

<p align="center">
Built with ❤️ to improve healthcare accessibility
</p>
