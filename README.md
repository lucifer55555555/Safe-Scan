# SafeScan AI

> Scan a food product's barcode or ingredient label and get a personalized, evidence-backed safety assessment based on your allergies, diet, and ingredients you want to avoid.

SafeScan AI is a full-stack TypeScript web app (React + Express) that combines a **deterministic rules engine** with **retrieval-augmented generation (RAG)** and **Google Gemini**. The design principle is simple:

> **Rules decide. Evidence supports. The LLM only explains.**

The safety verdict is never produced by an LLM. It comes from a deterministic engine. Gemini is used only to turn the verdict and the retrieved scientific evidence into a plain-language explanation.

---

## Table of Contents

- [Features](#features)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Reference](#api-reference)
- [Assessment Response Schema](#assessment-response-schema)
- [Risk Levels](#risk-levels)
- [Confidence Scoring](#confidence-scoring)
- [Evaluation & Testing](#evaluation--testing)
- [Admin & Knowledge Base](#admin--knowledge-base)
- [Known Limitations](#known-limitations)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Disclaimer](#disclaimer)
- [License](#license)

---

## Features

- **Barcode lookup**: fetches product data from [Open Food Facts](https://world.openfoodfacts.org/).
- **OCR ingredient scanning**: reads ingredient labels from photos using Tesseract.js, as a fallback when a barcode is not found.
- **Ingredient normalization**: maps messy label text, aliases, and E-numbers to canonical ingredient names.
- **Personalized safety rules**: checks against allergies, diet type (e.g. vegan, vegetarian), and a custom avoid-list.
- **Evidence retrieval (RAG)**: pulls supporting passages from an FDA / EFSA scientific corpus for the ingredients that matter.
- **Grounded AI explanation**: Gemini explains the result using only the retrieved evidence.
- **Confidence scoring**: combines OCR quality, ingredient-matching quality, and evidence strength into one overall score.
- **Scan history**: every assessment is saved per user and can be reopened later.
- **Ingredient knowledge base**: searchable by name, description, category, E-number, or allergen.
- **Admin tooling**: add ingredients and aliases, and review a queue of unresolved ingredients.
- **Built-in evaluation**: unit tests and a benchmark report exposed as API endpoints.
- **Polished UI**: Tailwind CSS v4, Motion animations, Lucide icons, and confetti for safe results.

---

## How It Works

```
 ┌─────────────┐   barcode    ┌──────────────────┐
 │  Scan input │─────────────▶│  Open Food Facts │
 │ (barcode /  │              └──────────────────┘
 │  OCR label) │                       │
 └─────┬───────┘                       ▼
       │ raw ingredient text   ┌──────────────────┐
       └──────────────────────▶│ 1. User profile  │
                               │ 2. Normalizer    │
                               └────────┬─────────┘
                                        ▼
                               ┌──────────────────┐
                               │ 3. Rules engine  │  ◀── deterministic verdict
                               │  (score + risk)  │
                               └────────┬─────────┘
                                        ▼
                               ┌──────────────────┐
                               │ 4. RAG retrieval │  ◀── FDA / EFSA corpus
                               └────────┬─────────┘
                                        ▼
                               ┌──────────────────┐
                               │ 5. Gemini        │  ◀── explanation only,
                               │  explanation     │      bound to evidence
                               └────────┬─────────┘
                                        ▼
                               ┌──────────────────┐
                               │ 6. Assessment +  │
                               │  saved scan      │
                               └──────────────────┘
```

The pipeline behind `POST /api/v1/assessment/analyze`:

1. **Fetch the user profile** (allergies, diet type, avoid-list).
2. **Normalize ingredients** to canonical names with a confidence per match.
3. **Log unresolved ingredients** to a knowledge-base review queue.
4. **Evaluate safety with the rules engine** to produce a score, risk level, and conflicts.
5. **Retrieve evidence** for the conflicting ingredients (or all ingredients if there are no conflicts).
6. **Compute confidence** from OCR, ingredient matching, and evidence strength.
7. **Generate a grounded explanation** with Gemini.
8. **Persist the scan** and return the full assessment.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite 6, Tailwind CSS 4, Motion, Lucide React, canvas-confetti |
| Backend | Node.js, Express 4, TypeScript |
| AI | Google Gemini via `@google/genai` |
| OCR | Tesseract.js |
| Product data | Open Food Facts API |
| Tooling | tsx, esbuild, TypeScript 5.8, Bun/npm lockfiles |

In development, Vite runs in middleware mode inside the Express server, so the frontend and API share a single origin and port.

---

## Project Structure

```
Safe-Scan/
├── backend/               # Backend-related assets
├── src/
│   ├── services/
│   │   ├── database.ts        # In-memory data store (users, profiles, scans, ingredients, sources)
│   │   ├── normalizer.ts      # Ingredient normalization & alias resolution
│   │   ├── rulesEngine.ts     # Deterministic safety rules + unit tests
│   │   ├── ragService.ts      # Evidence retrieval from FDA / EFSA corpus
│   │   ├── geminiService.ts   # Grounded explanation generation
│   │   ├── openFoodFacts.ts   # Barcode product lookup
│   │   └── evaluator.ts       # Evaluation benchmark
│   └── types.ts               # Shared TypeScript types
├── server.ts              # Express server + API routes (/api/v1)
├── index.html             # Vite entry
├── vite.config.ts
├── tsconfig.json
├── package.json
├── .env.example
└── metadata.json
```

> The tree above is based on the imports in `server.ts`. Exact file names inside `src/` may differ slightly.

---

## Getting Started

### Prerequisites

- **Node.js 18+** (Node 20+ recommended)
- **npm** (or Bun, since a `bun.lock` is included)
- A **Gemini API key** from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/lucifer55555555/Safe-Scan.git
cd Safe-Scan

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# then edit .env and add your GEMINI_API_KEY

# 4. Start the dev server
npm run dev
```

The app will be available at **http://localhost:3000**.

### Production build

```bash
npm run build     # builds the Vite frontend and bundles the server to dist/server.cjs
NODE_ENV=production npm start
```

In production, Express serves the static files from `dist/` and falls back to `index.html` for client-side routing.

---

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `GEMINI_API_KEY` | Yes | API key for Gemini, used to generate grounded explanations. |
| `APP_URL` | No | Public URL where the app is hosted, used for self-referential links and callbacks. |
| `NODE_ENV` | No | Set to `production` to serve the built frontend from `dist/`. |

Never commit your real `.env` file. It is already listed in `.gitignore`.

---

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Starts the Express server with Vite middleware (hot reload) on port 3000. |
| `npm run build` | Builds the frontend with Vite and bundles `server.ts` to `dist/server.cjs`. |
| `npm start` | Runs the production server from `dist/server.cjs`. |
| `npm run preview` | Previews the Vite production build. |
| `npm run clean` | Deletes the `dist/` directory. |
| `npm run lint` | Type-checks the project with `tsc --noEmit`. |

---

## API Reference

**Base URL:** `http://localhost:3000/api/v1`

### Health

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/health` | Service status, version, and timestamp. |

### Auth (demo-grade)

| Method | Endpoint | Body | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | `{ name, email, password }` | Creates a user with an empty profile. Returns `{ user, token }`. |
| POST | `/auth/login` | `{ email }` | Looks up a user by email. Falls back to the demo user. |

### User profile

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/users/profile?user_id=` | Returns the user's dietary profile. |
| PUT | `/users/profile` | Updates `dietType`, `allergies`, and `avoidIngredients`. |

### Products & ingredients

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/products/:barcode` | Looks up a product (Open Food Facts + cache). Returns 404 with a suggestion to use OCR if not found. |
| POST | `/ingredients/normalize` | Normalizes a list of raw ingredient strings. |
| GET | `/ingredients?q=` | Searches the knowledge base (first 100 when no query). |
| GET | `/ingredients/:id` | Ingredient detail. |

### Assessment

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/assessment/analyze` | Runs the full safety pipeline (see below). |
| GET | `/assessment/:id` | Fetches a previously saved assessment. |
| GET | `/scans/history?user_id=` | Lists a user's scan history. |

**Example request**

```bash
curl -X POST http://localhost:3000/api/v1/assessment/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "usr_demo_walkthrough",
    "product_name": "Chocolate Spread",
    "brand": "Example Brand",
    "barcode": "1234567890123",
    "scan_method": "ocr",
    "ocr_confidence": 0.94,
    "ingredients": ["sugar", "palm oil", "hazelnuts", "skimmed milk powder", "lecithin (E322)"]
  }'
```

| Field | Type | Notes |
| --- | --- | --- |
| `ingredients` | `string[]` or `string` | **Required.** Raw ingredient list. |
| `user_id` | string | Defaults to the demo user. |
| `product_id`, `barcode`, `product_name`, `brand` | string | Optional product metadata. |
| `scan_method` | string | `manual`, `barcode`, or `ocr`. Defaults to `manual`. |
| `ocr_text` | string | Raw OCR output, stored with the scan. |
| `ocr_confidence` | number (0–1) | Defaults to `0.97`. |

### Knowledge sources

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/sources` | Lists all scientific sources. |
| GET | `/sources/:id` | Source detail. |

### Admin

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/admin/stats` | Aggregate stats. |
| POST | `/admin/ingredients` | Adds an ingredient (`canonicalName` required, plus optional `description`, `category`, `allergens`, `aliases`, `dietaryConflicts`, `eNumber`). |
| POST | `/admin/aliases` | Adds an alias (`ingredientId`, `alias`). |
| GET | `/admin/unresolved` | Lists ingredients the normalizer could not resolve. |

### Evaluation

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/evaluation/unittests` | Runs the rules-engine unit tests. |
| GET | `/evaluation/report` | Runs the evaluation benchmark and returns a report. |

---

## Assessment Response Schema

```jsonc
{
  "id": "assess_1712345678901",
  "status": "clear | caution | warning | unknown",
  "score": 0,
  "risk_level": "SAFE | CAUTION | WARNING | CRITICAL | UNKNOWN",
  "conflicts": [],                 // rule violations for this user's profile
  "unresolved_ingredients": [],    // ingredients that could not be identified
  "evidence": [],                  // retrieved FDA / EFSA passages
  "confidence": {
    "ocr": 0.97,
    "ingredient_matching": 0.95,
    "evidence": "high | medium | low",
    "overall": 0.96
  },
  "explanation": "Plain-language, evidence-grounded summary",
  "normalized_ingredients": [],
  "product": { "id": "", "name": "", "brand": "", "barcode": "" },
  "scanned_method": "manual | barcode | ocr",
  "created_at": "2026-01-01T00:00:00.000Z"
}
```

---

## Risk Levels

The rules engine produces a `risk_level`, which is mapped to a UI-friendly `status`:

| Risk level | Status | Meaning |
| --- | --- | --- |
| `CRITICAL` | `warning` | Direct conflict, such as a declared allergen. |
| `WARNING` / `CAUTION` | `caution` | Diet conflict or avoid-list match, or a possible concern. |
| `UNKNOWN` | `unknown` | Ingredients could not be resolved, so no confident verdict is possible. |
| Otherwise | `clear` | No conflicts found for this profile. |

---

## Confidence Scoring

The overall confidence is a weighted blend of three signals:

```
overall = 0.4 × OCR confidence
        + 0.4 × mean ingredient-matching confidence
        + 0.2 × evidence confidence   (0.98 if "high", otherwise 0.85)
```

A low overall score is a signal to re-scan the label or confirm ingredients manually.

---

## Evaluation & Testing

Quality checks are built into the app and exposed over HTTP:

```bash
# Rules-engine unit tests
curl http://localhost:3000/api/v1/evaluation/unittests

# Full benchmark report
curl http://localhost:3000/api/v1/evaluation/report
```

Run `npm run lint` for type-checking.

---

## Admin & Knowledge Base

Ingredients that the normalizer cannot resolve are logged to an **unresolved queue** (`GET /admin/unresolved`). A maintainer can review the queue and then:

1. Add a new canonical ingredient via `POST /admin/ingredients`, or
2. Attach the raw string as an alias of an existing ingredient via `POST /admin/aliases`.

This makes the knowledge base grow from real-world scans.

---

## Known Limitations

- **In-memory database.** Users, scans, and knowledge-base edits are lost on server restart.
- **Demo-grade authentication.** Tokens are placeholders (`token_<userId>`), passwords are not validated, and no endpoints are protected. Do **not** deploy this to the public internet with real user data without replacing auth (e.g. real JWTs, hashed passwords) and protecting the `/admin` routes.
- **Limited knowledge base and evidence corpus.** Coverage of ingredients and scientific sources is finite; unknown ingredients return `UNKNOWN`.
- **OCR accuracy** depends on image quality, lighting, and label language.
- **Open Food Facts data** is crowd-sourced and may be incomplete or outdated.

---

## Roadmap

- [ ] Persistent database (PostgreSQL / SQLite)
- [ ] Real authentication and authorization
- [ ] Role-protected admin dashboard
- [ ] Larger FDA / EFSA evidence corpus with vector search
- [ ] Multi-language label support
- [ ] Automated test suite in CI
- [ ] Docker support

---

## Contributing

Contributions are welcome.

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push the branch: `git push origin feature/your-feature`
5. Open a Pull Request

Please run `npm run lint` before submitting.

---

## Disclaimer

SafeScan AI is an informational tool and **not a medical device or a substitute for professional medical advice**. Always read the physical product label and consult a qualified healthcare professional if you have severe allergies or medical dietary restrictions. Ingredient data and OCR results may be incomplete or inaccurate.

---

## License

No license has been specified yet. Add a `LICENSE` file (e.g. MIT) to define how others may use this project.
