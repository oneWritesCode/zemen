# Zemen — Macro Economic Regime Detector

> **The economy explained. In one answer.**

Zemen watches 10+ live economic indicators 24 / 7 and tells you exactly what the economy is doing right now — and what history says happens next. Built at the **Zerve AI Hackathon 2025**, powered by the Federal Reserve's open data API (FRED).

---

## What is Zemen?

Most people understand *that* the economy is doing something — but not *what* or *why*. Government data sites dump raw numbers with no context. Zemen fixes that.

Think of Zemen like a **weather app for the economy**. A weather app does not show you temperature, humidity, and pressure separately and leave you guessing — it says "rainy tomorrow, bring an umbrella." Zemen does the same: it ingests macroeconomic data, runs an unsupervised machine-learning model, and distils everything into a single human-readable label:

| Regime | Meaning |
|---|---|
| 🟢 **Goldilocks** | Solid growth, tame inflation, healthy labour market |
| 🔵 **Recovery** | Rebound in growth and employment after a downturn |
| 🟠 **Overheating** | Tight labour, strong demand, building price pressure |
| 🔴 **Stagflation** | Elevated inflation with weak growth |
| 🟥 **Recession** | Rising joblessness, wide credit spreads, contracting activity |

---

## Who Is It For?

- **Retail investors** — want to know if now is a good time to buy or hold
- **Small business owners** — deciding whether to hire, expand, or wait
- **Students** — learning macroeconomics with real live data
- **Financial analysts** — need a fast macro snapshot without 10 browser tabs

---

## Key Features

### 🏠 Landing Page
- Live regime badge with confidence percentage
- "Last 3 times we were in this regime" — historical context
- "What to watch" — tailored indicator links for the current regime
- Regime explainer cards for all 5 economic phases

### 📊 Dashboard (`/dashboard`)
A dynamic, data-driven dashboard covering **10 macro topic areas**:

| Slug | What it tracks |
|---|---|
| `interest-rates` | Fed funds rate, 2Y/10Y Treasury yields, yield curve spread, prime rate |
| `inflation` | CPI, PCE, 10-year breakeven inflation |
| `unemployment` | U-3 (headline) and U-6 (broad) unemployment rates |
| `gdp-growth` | Real GDP level and YoY growth |
| `housing` | Case-Shiller home price index, 30Y mortgage rate |
| `credit-spreads` | High-yield (HY) and investment-grade (IG) option-adjusted spreads |
| `gold` | London PM gold fix (USD/oz) |
| `stock-market` | S&P 500 index and VIX volatility index |
| `trade-dollar` | Trade-weighted broad dollar index, goods trade balance |
| `consumer-sentiment` | University of Michigan consumer sentiment index |

Each topic page renders interactive charts (via **Recharts**) and a KPI strip showing the latest data point.

### 🧠 Regime Detector (`/regime-detector`)
The core ML engine:
- Fetches a multi-year panel from FRED
- Standardises indicators (z-score normalisation, column-wise)
- Runs **k-means clustering** (k = 5, seeded for reproducibility via Mulberry32 PRNG)
- Maps each cluster to a named regime using a rule-based label assignment
- Outputs the **current regime + confidence probability** (softmax over Gaussian distances)

### 📅 Weekly Briefing (`/briefing`)
- A human-readable summary of the week's macro moves
- Direction (up/down) and economy impact for each indicator
- Current regime status with confidence and transition risk
- Editorial "big story" and watchlist commentary

### 💬 Ask Zemen AI Chat
A floating AI assistant that can answer plain-English macro questions:
- Fullscreen mode with a centered composer (inspired by modern AI chat UIs)
- Quick-access pill buttons: *Current regime, Market outlook, Fed rate impact, Yield curve analysis, Asset allocation, Risk assessment…*
- Chat bubbles with **hover actions**: edit your message or resend for a fresh response
- Session persistence via `sessionStorage` (last 10 messages)
- Powered by **Groq** (llama-3.3-70b-versatile by default via `/api/ask-zemen`)

### 📈 Macro Health Score
A composite **0–100 score** computed from 5 equally-weighted sub-dimensions:

| Dimension | FRED series used |
|---|---|
| Labour market | UNRATE |
| Inflation vs. 2% target | CPIAUCSL (YoY) |
| Real GDP growth | GDPC1 (YoY) |
| Credit stress | BAMLH0A0HYM2 (HY OAS) |
| Policy rate stance | FEDFUNDS |

### 🚨 Regime Alert Banner
A site-wide banner that surfaces whenever the current regime is particularly notable (e.g. Stagflation or Recession), appearing inline on the hero and optionally as a sticky top bar.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | **Next.js 16** (App Router, React Server Components) |
| Language | **TypeScript 5** |
| UI | **React 19**, **Tailwind CSS v4** |
| Charts | **Recharts 3** |
| Animations | **Framer Motion 12** |
| Icons | **Lucide React** |
| Data source | **FRED API** (Federal Reserve Economic Data) |
| AI / LLM | **Groq** (`llama-3.3-70b-versatile`) |
| ML | Custom k-means implementation (pure TypeScript, no ML library) |

---

## Project Structure

```
zemen-next/
├── app/
│   ├── page.tsx                # Landing page (server component)
│   ├── layout.tsx              # Root layout with global providers
│   ├── dashboard/              # Dynamic dashboard ([topic] segment)
│   ├── briefing/               # Weekly macro briefing
│   ├── regime-detector/        # Regime detector deep-dive page
│   ├── regimes/                # Regime reference pages
│   ├── how-it-works/           # Methodology explanation
│   └── api/
│       ├── ask-zemen/          # AI chat endpoint (Groq)
│       ├── dashboard/          # Dashboard data API
│       ├── macros/             # Raw macro data API
│       └── regime/             # Regime analysis API
│
├── components/
│   ├── global/
│   │   ├── ask-zemen-chat.tsx  # Floating AI chat widget
│   │   └── regime-alert-banner.tsx
│   ├── dashboard/              # Chart and KPI components
│   ├── landing/                # Landing page sections
│   ├── regime/                 # Regime cards and visualisations
│   ├── site/                   # Shell, nav, backgrounds
│   └── ui/                     # Shared UI primitives
│
├── lib/
│   ├── fred/
│   │   ├── client.ts           # FRED API HTTP client
│   │   ├── topics-config.ts    # All 10 topic definitions (series, charts, KPIs)
│   │   ├── get-topic-dataset.ts
│   │   └── panel.ts            # Multi-series panel builder
│   ├── regime/
│   │   ├── kmeans.ts           # Pure-TS k-means + softmax scoring
│   │   ├── build-panel.ts      # Feature row builder
│   │   ├── assign-labels.ts    # Cluster → regime name mapping
│   │   ├── get-analysis.ts     # Top-level regime analysis function
│   │   ├── playbook.ts         # Per-regime asset/strategy playbook
│   │   └── types.ts            # RegimeId, RegimeMeta, REGIMES
│   ├── macro-health-score.ts   # Composite 0–100 health score
│   ├── personalization.ts      # User persona-based recommendations
│   └── format-metric.ts        # Number formatting helpers
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A [FRED API key](https://fred.stlouisfed.org/docs/api/api_key.html) (free)
- A [Groq API key](https://console.groq.com/) (free tier available)

### 1. Clone and install

```bash
git clone <repo-url>
cd zemen-next
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in your keys:

```bash
cp .env.example .env
```

```env
FRED_API_KEY=your_fred_key_here
GROQ_API_KEY=your_groq_key_here
GROQ_MODEL=llama-3.3-70b-versatile   # optional, this is the default
```

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## How the Regime Model Works

1. **Data ingestion** — FRED API is queried for monthly observations of Fed funds rate, CPI, unemployment, real GDP, and HY credit spreads back to 1995.
2. **Feature engineering** — Real GDP YoY and CPI YoY are computed from the raw index levels.
3. **Standardisation** — Each feature is z-score normalised (column-wise mean / std) so no single indicator dominates by scale.
4. **K-means clustering** — A seeded k-means (k = 5) groups every historical month into one of five economic environments.
5. **Label assignment** — Each cluster is mapped to a named regime via rule-based checks on centroid position (e.g. high inflation + low growth → Stagflation).
6. **Current state** — Today's feature vector is standardised, then assigned to the nearest centroid. A softmax over Gaussian distances produces the **confidence probability**.

> All ML code is pure TypeScript with zero external ML dependencies.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Build for production |
| `npm start` | Run the production build |
| `npm run lint` | Lint with ESLint |

---

## Acknowledgements

- Data: [Federal Reserve Bank of St. Louis — FRED](https://fred.stlouisfed.org/)
- LLM inference: [Groq](https://groq.com/)
- Built at the **Zerve AI Hackathon 2025**
