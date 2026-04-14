export type SeriesUnit = "percent" | "index" | "usd" | "points" | "billionsUsd";

/** Lucide-based topic icons (see `TopicIcon`). */
export type TopicIconId =
  | "rates"
  | "inflation"
  | "labor"
  | "gdp"
  | "housing"
  | "credit"
  | "gold"
  | "equity"
  | "globe"
  | "sentiment";

export type FredSeriesSpec = {
  key: string;
  fredId: string;
  label: string;
  color: string;
  unit: SeriesUnit;
};

export type ComputedSeriesSpec =
  | {
      key: string;
      label: string;
      color: string;
      unit: SeriesUnit;
      op: "diff";
      left: string;
      right: string;
    }
  | {
      key: string;
      label: string;
      color: string;
      unit: SeriesUnit;
      op: "yoy";
      source: string;
    };

export type TopicChartSpec = {
  title: string;
  seriesKeys: string[];
  /** `split` = half-width in a two-column row on large screens. */
  span: "split" | "full";
  /** Plot these keys on a secondary Y axis (different scale). */
  useRightAxis?: string[];
};

export type TopicDefinition = {
  slug: string;
  label: string;
  description: string;
  icon: TopicIconId;
  observationStart: string;
  series: FredSeriesSpec[];
  computed?: ComputedSeriesSpec[];
  charts: TopicChartSpec[];
  /** Up to four keys for KPI strip (raw or computed). */
  kpiKeys: string[];
};

export const DASHBOARD_TOPICS: TopicDefinition[] = [
  {
    slug: "interest-rates",
    label: "Interest Rates",
    description:
      "Federal Reserve policy rates, Treasury yields, and the yield curve.",
    icon: "rates",
    observationStart: "1995-01-01",
    series: [
      {
        key: "fed",
        fredId: "FEDFUNDS",
        label: "Fed funds",
        color: "#60a5fa",
        unit: "percent",
      },
      {
        key: "gs2",
        fredId: "DGS2",
        label: "2Y Treasury",
        color: "#fb923c",
        unit: "percent",
      },
      {
        key: "gs10",
        fredId: "DGS10",
        label: "10Y Treasury",
        color: "#4ade80",
        unit: "percent",
      },
      {
        key: "prime",
        fredId: "DPRIME",
        label: "Prime rate",
        color: "#f472b6",
        unit: "percent",
      },
    ],
    computed: [
      {
        key: "curve10y2y",
        label: "10y − 2y spread",
        color: "#c084fc",
        unit: "percent",
        op: "diff",
        left: "gs10",
        right: "gs2",
      },
    ],
    charts: [
      {
        title: "Policy rate vs Treasury yields",
        seriesKeys: ["fed", "gs2", "gs10"],
        span: "split",
      },
      {
        title: "Yield curve slope (10y − 2y)",
        seriesKeys: ["curve10y2y"],
        span: "split",
      },
      {
        title: "Prime rate vs Fed funds",
        seriesKeys: ["prime", "fed"],
        span: "full",
      },
    ],
    kpiKeys: ["fed", "gs2", "gs10", "prime"],
  },
  {
    slug: "inflation",
    label: "Inflation",
    description: "Price levels, breakevens, and year-over-year inflation.",
    icon: "inflation",
    observationStart: "1995-01-01",
    series: [
      {
        key: "cpi",
        fredId: "CPIAUCSL",
        label: "CPI (index)",
        color: "#fbbf24",
        unit: "index",
      },
      {
        key: "pce",
        fredId: "PCEPI",
        label: "PCE (index)",
        color: "#38bdf8",
        unit: "index",
      },
      {
        key: "breakeven10y",
        fredId: "T10YIE",
        label: "10Y breakeven",
        color: "#f472b6",
        unit: "percent",
      },
    ],
    computed: [
      {
        key: "cpiYoy",
        label: "CPI YoY",
        color: "#fbbf24",
        unit: "percent",
        op: "yoy",
        source: "cpi",
      },
      {
        key: "pceYoy",
        label: "PCE YoY",
        color: "#38bdf8",
        unit: "percent",
        op: "yoy",
        source: "pce",
      },
    ],
    charts: [
      {
        title: "CPI vs PCE (YoY %)",
        seriesKeys: ["cpiYoy", "pceYoy"],
        span: "split",
      },
      {
        title: "10-year breakeven inflation",
        seriesKeys: ["breakeven10y"],
        span: "split",
      },
      {
        title: "Price indices (levels)",
        seriesKeys: ["cpi", "pce"],
        span: "full",
        useRightAxis: ["pce"],
      },
    ],
    kpiKeys: ["cpiYoy", "pceYoy", "breakeven10y", "cpi"],
  },
  {
    slug: "unemployment",
    label: "Unemployment",
    description: "Headline and broad labor underutilization.",
    icon: "labor",
    observationStart: "1995-01-01",
    series: [
      {
        key: "u3",
        fredId: "UNRATE",
        label: "U-3 unemployment",
        color: "#60a5fa",
        unit: "percent",
      },
      {
        key: "u6",
        fredId: "U6RATE",
        label: "U-6 unemployment",
        color: "#c084fc",
        unit: "percent",
      },
    ],
    charts: [
      {
        title: "Unemployment rate (U-3 vs U-6)",
        seriesKeys: ["u3", "u6"],
        span: "full",
      },
    ],
    kpiKeys: ["u3", "u6"],
  },
  {
    slug: "gdp-growth",
    label: "GDP Growth",
    description: "Real GDP level and implied growth from quarterly prints.",
    icon: "gdp",
    observationStart: "1995-01-01",
    series: [
      {
        key: "rgdpGrowth",
        fredId: "A191RL1Q225SBEA",
        label: "Real GDP growth (annualized)",
        color: "#fbbf24",
        unit: "percent",
      },
      {
        key: "rgdp",
        fredId: "GDPC1",
        label: "Real GDP",
        color: "#4ade80",
        unit: "index",
      },
    ],
    computed: [
      {
        key: "rgdpYoy",
        label: "Real GDP YoY %",
        color: "#fbbf24",
        unit: "percent",
        op: "yoy",
        source: "rgdp",
      },
    ],
    charts: [
      {
        title: "Real GDP (level, billions chained 2017 $)",
        seriesKeys: ["rgdp"],
        span: "split",
      },
      {
        title: "YoY % change in real GDP",
        seriesKeys: ["rgdpYoy"],
        span: "split",
      },
      {
        title: "Real GDP growth (annualized, QoQ)",
        seriesKeys: ["rgdpGrowth"],
        span: "full",
      },
    ],
    kpiKeys: ["rgdpGrowth", "rgdpYoy", "rgdp"],
  },
  {
    slug: "housing",
    label: "Housing Market",
    description: "Home prices and mortgage rates.",
    icon: "housing",
    observationStart: "1995-01-01",
    series: [
      {
        key: "cs",
        fredId: "CSUSHPINSA",
        label: "Case-Shiller national",
        color: "#60a5fa",
        unit: "index",
      },
      {
        key: "mort30",
        fredId: "MORTGAGE30US",
        label: "30Y mortgage",
        color: "#fb923c",
        unit: "percent",
      },
    ],
    charts: [
      {
        title: "Case-Shiller national index",
        seriesKeys: ["cs"],
        span: "split",
      },
      {
        title: "30-year fixed mortgage rate",
        seriesKeys: ["mort30"],
        span: "split",
      },
    ],
    kpiKeys: ["cs", "mort30"],
  },
  {
    slug: "credit-spreads",
    label: "Credit & Spreads",
    description: "Corporate and high-yield option-adjusted spreads.",
    icon: "credit",
    observationStart: "1995-01-01",
    series: [
      {
        key: "hy",
        fredId: "BAMLH0A0HYM2",
        label: "HY OAS",
        color: "#f87171",
        unit: "percent",
      },
      {
        key: "ig",
        fredId: "BAMLC0A0CM",
        label: "IG corporate OAS",
        color: "#60a5fa",
        unit: "percent",
      },
    ],
    charts: [
      {
        title: "HY vs IG OAS",
        seriesKeys: ["hy", "ig"],
        span: "full",
      },
    ],
    kpiKeys: ["hy", "ig"],
  },
  {
    slug: "gold",
    label: "Gold",
    description:
      "Gold spot is not reliably available via FRED; this view uses 10Y real yields (a gold-sensitive proxy).",
    icon: "gold",
    observationStart: "1995-01-01",
    series: [
      {
        key: "gold",
        fredId: "DFII10",
        label: "10Y real yield (DFII10)",
        color: "#fbbf24",
        unit: "percent",
      },
    ],
    charts: [
      {
        title: "10Y real yield (month-end)",
        seriesKeys: ["gold"],
        span: "full",
      },
    ],
    kpiKeys: ["gold"],
  },
  {
    slug: "stock-market",
    label: "Stock market",
    description: "S&P 500 levels and the VIX.",
    icon: "equity",
    observationStart: "1995-01-01",
    series: [
      {
        key: "sp500",
        fredId: "SP500",
        label: "S&P 500",
        color: "#60a5fa",
        unit: "index",
      },
      {
        key: "vix",
        fredId: "VIXCLS",
        label: "VIX",
        color: "#f87171",
        unit: "points",
      },
    ],
    charts: [
      {
        title: "S&P 500 (monthly)",
        seriesKeys: ["sp500"],
        span: "split",
      },
      {
        title: "VIX (month-end)",
        seriesKeys: ["vix"],
        span: "split",
      },
    ],
    kpiKeys: ["sp500", "vix"],
  },
  {
    slug: "trade-dollar",
    label: "Trade & Dollar",
    description: "Broad dollar and goods trade balance.",
    icon: "globe",
    observationStart: "1995-01-01",
    series: [
      {
        key: "dxybroad",
        fredId: "DTWEXBGS",
        label: "Broad dollar index",
        color: "#a78bfa",
        unit: "index",
      },
      {
        key: "tradebal",
        fredId: "BOPGSTB",
        label: "Goods trade balance",
        color: "#4ade80",
        unit: "billionsUsd",
      },
    ],
    charts: [
      {
        title: "Trade-weighted broad dollar",
        seriesKeys: ["dxybroad"],
        span: "split",
      },
      {
        title: "Goods trade balance (USD, billions)",
        seriesKeys: ["tradebal"],
        span: "split",
      },
    ],
    kpiKeys: ["dxybroad", "tradebal"],
  },
  {
    slug: "consumer-sentiment",
    label: "Consumer Sentiment",
    description: "University of Michigan consumer sentiment.",
    icon: "sentiment",
    observationStart: "1995-01-01",
    series: [
      {
        key: "umich",
        fredId: "UMCSENT",
        label: "UMich sentiment",
        color: "#fbbf24",
        unit: "index",
      },
    ],
    charts: [
      {
        title: "University of Michigan: Consumer Sentiment",
        seriesKeys: ["umich"],
        span: "full",
      },
    ],
    kpiKeys: ["umich"],
  },
];

export function getTopicBySlug(slug: string): TopicDefinition | undefined {
  return DASHBOARD_TOPICS.find((t) => t.slug === slug);
}
