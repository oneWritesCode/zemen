# ZEMEN - Macro Intelligence

ZEMEN is an educational macroeconomic intelligence app that converts raw economic data into simple, actionable context.

Instead of showing only charts, ZEMEN answers:
- What is happening in the economy right now
- Which macro regime we are in
- What similar historical periods looked like next
- Why each indicator matters in plain English

The project includes:
- A presentation website (landing + explainer pages)
- A live dashboard with topic-level charts
- A regime detector powered by clustering
- Per-chart Intelligence Panels for interpretation, context, and history

---

## What This Project Does

### 1) Presentation Website

The public-facing pages explain the product and economic concepts:
- `/` - landing page
- `/how-it-works` - step-by-step pipeline explanation
- `/indicators` - simple guide to each macro indicator
- `/regimes` - deep dives into each macro regime
- `/readme` - in-app documentation-style page

### 2) Dashboard

The dashboard provides data-backed chart pages for each macro topic:
- `/dashboard/interest-rates`
- `/dashboard/inflation`
- `/dashboard/unemployment`
- `/dashboard/gdp-growth`
- `/dashboard/housing`
- `/dashboard/credit-spreads`
- `/dashboard/gold`
- `/dashboard/stock-market`
- `/dashboard/trade-dollar`
- `/dashboard/consumer-sentiment`

Features:
- KPI strip (current value + 1-year change)
- Range sliders and historical comparison windows
- Multiple chart layouts (split/full)
- Retry/error handling for API/data issues
- Fixed sidebar navigation

### 3) Intelligence Panel (below every chart)

Every chart has a collapsible Intelligence Panel that explains:
1. What you are looking at (plain English + unit + normal range + current reading)
2. Why the number matters (high/low/rising/falling interpretation)
3. What affects the number (factor cards + direction + impact speed)
4. Key players (institutions/actors + power level + examples)
5. Historical context timeline (clickable events)
6. Why this matters now (2025-2026 context)

### 4) Regime Detector

The regime detector page (`/regime-detector`) classifies the current macro environment using clustering on monthly features.

It shows:
- Current regime label
- Confidence score
- Feature input table
- Historical playbook (forward returns after similar historical regime entries)
- Regime-by-year timeline

When some values are missing, UI surfaces "Data not available" instead of placeholder dashes.

---

## How It Works (Data and Modeling Flow)

1. Fetch macro series from FRED
2. Convert to monthly-aligned observations
3. Compute derived series (for example year-over-year changes and spreads)
4. Build chart rows and KPI metrics
5. Render topic charts with filters/comparison overlays
6. Run regime analysis (k-means-based clustering + regime label mapping)
7. Build historical playbook (average 90/180-day forward behavior by regime)

Core data/model modules:
- `lib/fred/client.ts` - FRED API fetch layer
- `lib/fred/monthly.ts` - monthly alignment helpers
- `lib/fred/get-topic-dataset.ts` - dataset assembly for dashboard topics
- `lib/fred/topics-config.ts` - topic definitions, series metadata, chart specs
- `lib/regime/get-analysis.ts` - main regime analysis orchestrator
- `lib/regime/kmeans.ts` - clustering logic
- `lib/regime/assign-labels.ts` - map clusters to human regime labels
- `lib/regime/playbook.ts` - forward historical outcome statistics
- `lib/intelligence/intelligence-content.ts` - per-topic intelligence panel content

---

## Tech Stack

- Framework: Next.js (App Router)
- Language: TypeScript
- UI: Tailwind CSS
- Animations: Framer Motion + CSS transitions
- Icons: Lucide React + React Icons
- Charts: Recharts
- Data Source: FRED (Federal Reserve Economic Data)

---

## Project Structure

```txt
app/
  page.tsx
  how-it-works/page.tsx
  indicators/page.tsx
  regimes/page.tsx
  readme/page.tsx
  dashboard/
    page.tsx
    [topic]/page.tsx
  regime-detector/page.tsx

components/
  dashboard/
  regime/
  site/
  icons/

lib/
  fred/
  regime/
  intelligence/
```

---

## Environment Variables

Create `.env` (or `.env.local`) with:

```bash
FRED_API_KEY=your_fred_api_key_here
```

Without a valid key, data-backed views can show fallback or error states.

---

## Local Development

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build production bundle:

```bash
npm run build
```

Run lint:

```bash
npm run lint
```

---

## UI/Design System

- Dark-first interface
- Primary accent color: `#FFD000`
- Responsive layout across desktop/tablet/mobile
- Fixed/sticky dashboard sidebar for faster navigation
- Educational writing style aimed at non-experts

---

## Notes

- This project is educational and informational.
- It is not financial advice.
- Historical playbooks describe past behavior, not guaranteed future outcomes.
