import type { RegimeId } from "@/lib/regime/types";

export type SectorId =
  | "technology"
  | "healthcare"
  | "financials"
  | "energy"
  | "consumer-staples"
  | "consumer-discretionary"
  | "industrials"
  | "real-estate"
  | "utilities"
  | "materials"
  | "emerging-tech";

export type RegimeFit = "HOT" | "NEUTRAL" | "COLD";

export type FactorCard = {
  name: string;
  direction: "up" | "down";
  impactLabel: "HELPS" | "HURTS";
  explanation: string;
  speed: "Days" | "Weeks" | "Months" | "Years";
};

export type TrendCard = {
  name: string;
  whyEmerging: string;
  bestPositioned: string[];
  timeline: string;
  risk: "Low" | "Medium" | "High";
};

export type CompanyTrustBadge = {
  label: string;
  color: "green" | "yellow" | "gray" | "red";
};

export type CompanyCardConfig = {
  ticker: string;
  name?: string;
};

export type SectorConfig = {
  id: SectorId;
  iconId: SectorId;
  name: string;
  ticker: string;
  plainEnglish: string;
  color: string;

  /** Used for top-level "why now" and details. */
  whyNowByRegime: Partial<Record<RegimeId, string>>;
  riskLevelByRegime: Partial<Record<RegimeId, "Low" | "Medium" | "High">>;

  factors: FactorCard[];
  trends: TrendCard[];
  companies: CompanyCardConfig[];
};

export const SECTORS: SectorConfig[] = [
  {
    id: "technology",
    iconId: "technology",
    name: "Technology",
    ticker: "XLK",
    plainEnglish: "Companies that build software, hardware, and the internet",
    color: "#3b82f6",
    whyNowByRegime: {
      goldilocks: "Lower inflation + steady growth can support tech earnings multiples.",
      recovery: "Rebuilding capital spending often lifts software, cloud, and hardware demand.",
      overheating: "Higher rates can pressure long-duration tech, but AI spend can remain resilient.",
      stagflation: "Falling real purchasing power can slow enterprise upgrades.",
      recession: "Selective tech spend and cost-cutting can still keep demand focused.",
    },
    riskLevelByRegime: {
      goldilocks: "Medium",
      overheating: "High",
      recession: "Medium",
    },
    factors: [
      {
        name: "Interest rates",
        direction: "down",
        impactLabel: "HELPS",
        explanation: "Lower rates make future tech profits worth more today, supporting valuations.",
        speed: "Weeks",
      },
      {
        name: "AI adoption",
        direction: "up",
        impactLabel: "HELPS",
        explanation: "More businesses using AI increases demand for compute and software deployments.",
        speed: "Months",
      },
      {
        name: "Regulation",
        direction: "down",
        impactLabel: "HURTS",
        explanation: "Restrictive rules can limit platform growth and add compliance costs.",
        speed: "Months",
      },
      {
        name: "Consumer spending",
        direction: "up",
        impactLabel: "HELPS",
        explanation: "Higher spending directly increases sales for devices and subscriptions.",
        speed: "Months",
      },
      {
        name: "Dollar strength",
        direction: "down",
        impactLabel: "HURTS",
        explanation: "A stronger USD can reduce overseas revenue translation for US tech.",
        speed: "Months",
      },
      {
        name: "Earnings growth",
        direction: "up",
        impactLabel: "HELPS",
        explanation: "When tech companies report strong profits, investors re-rate the sector.",
        speed: "Days",
      },
    ],
    trends: [
      {
        name: "AI Infrastructure Buildout",
        whyEmerging:
          "Spending on data centers and chips to power AI models is creating a multi-year investment boom.",
        bestPositioned: ["NVDA", "MSFT", "AVGO", "GOOGL"],
        timeline: "2-5 years",
        risk: "Medium",
      },
      {
        name: "Edge Computing",
        whyEmerging:
          "Computing closer to devices improves latency and boosts demand for networking and chips.",
        bestPositioned: ["AMD", "QCOM", "INTC"],
        timeline: "3-5 years",
        risk: "Medium",
      },
      {
        name: "Cybersecurity Expansion",
        whyEmerging:
          "New AI-driven attack vectors keep security budgets from slowing too much during cycles.",
        bestPositioned: ["CRWD", "PANW", "ZS"],
        timeline: "1-3 years",
        risk: "Low",
      },
    ],
    companies: [
      { ticker: "AAPL" },
      { ticker: "MSFT" },
      { ticker: "NVDA" },
      { ticker: "GOOGL" },
      { ticker: "META" },
      { ticker: "AMD" },
      { ticker: "AVGO" },
      { ticker: "CRM" },
    ],
  },
  {
    id: "healthcare",
    iconId: "healthcare",
    name: "Healthcare",
    ticker: "XLV",
    plainEnglish: "Hospitals, drug companies, and medical device makers",
    color: "#22c55e",
    whyNowByRegime: {
      goldilocks: "Stable demand for care plus steady innovation supports sector defensiveness.",
      recovery: "Growth rebounds often improve procedures and elective treatment volumes.",
      overheating: "Tighter financing can pressure some buyers, but essential healthcare demand persists.",
      stagflation: "Inflation can raise costs, but pricing power can protect margins for leaders.",
      recession: "Non-cyclical demand can cushion downturn volatility.",
    },
    riskLevelByRegime: {
      overheating: "Medium",
      recession: "Low",
    },
    factors: [
      {
        name: "Policy & reimbursement",
        direction: "down",
        impactLabel: "HURTS",
        explanation: "Changes in coverage and reimbursement rates can swing profits quickly.",
        speed: "Months",
      },
      {
        name: "Drug pipelines",
        direction: "up",
        impactLabel: "HELPS",
        explanation: "New approvals and trial results can accelerate revenue and investor confidence.",
        speed: "Months",
      },
      {
        name: "Aging population",
        direction: "up",
        impactLabel: "HELPS",
        explanation: "More people needing care increases long-run demand for healthcare services.",
        speed: "Years",
      },
      {
        name: "Interest rates",
        direction: "down",
        impactLabel: "HELPS",
        explanation: "Lower rates reduce discounting pressure for growth-oriented healthcare firms.",
        speed: "Weeks",
      },
      {
        name: "Cost inflation",
        direction: "down",
        impactLabel: "HURTS",
        explanation: "Rising input costs can squeeze margins unless pricing keeps up.",
        speed: "Months",
      },
      {
        name: "Procedure volumes",
        direction: "up",
        impactLabel: "HELPS",
        explanation: "Improving employment can raise elective procedure demand.",
        speed: "Months",
      },
    ],
    trends: [
      {
        name: "Innovation in biologics",
        whyEmerging: "Next-gen therapies expand treatment options and can lift long-run revenue growth.",
        bestPositioned: ["LLY", "ABBV", "MRK"],
        timeline: "2-5 years",
        risk: "Medium",
      },
      {
        name: "Medical devices modernization",
        whyEmerging: "Hospital tech upgrades and minimally invasive procedures support steady device demand.",
        bestPositioned: ["ISRG", "TMO"],
        timeline: "1-3 years",
        risk: "Low",
      },
      {
        name: "Managed care efficiency",
        whyEmerging: "Better cost controls and outcomes tracking can improve margins even in slower periods.",
        bestPositioned: ["UNH", "JNJ"],
        timeline: "1-3 years",
        risk: "Low",
      },
    ],
    companies: [
      { ticker: "JNJ" },
      { ticker: "UNH" },
      { ticker: "LLY" },
      { ticker: "PFE" },
      { ticker: "ABBV" },
      { ticker: "MRK" },
      { ticker: "TMO" },
      { ticker: "ISRG" },
    ],
  },
  {
    id: "financials",
    iconId: "financials",
    name: "Financials",
    ticker: "XLF",
    plainEnglish: "Banks, insurance companies, and investment firms",
    color: "#8b5cf6",
    whyNowByRegime: {
      goldilocks: "Healthy activity supports credit growth and fee-based revenue for financials.",
      recovery: "Improving demand and capital markets often boost both lending and trading.",
      overheating: "Higher rates can help net interest income, but credit quality risk rises.",
      stagflation: "Sticky inflation can lift costs, while loan losses become a concern.",
      recession: "Defensiveness rises with credit risk and tighter lending conditions.",
    },
    riskLevelByRegime: {
      stagflation: "High",
      recession: "High",
    },
    factors: [
      {
        name: "Yield curve shape",
        direction: "up",
        impactLabel: "HELPS",
        explanation: "A steeper curve can improve bank profitability through net interest spread.",
        speed: "Months",
      },
      {
        name: "Credit spreads",
        direction: "down",
        impactLabel: "HURTS",
        explanation: "Wider credit spreads can signal higher default risk and stress capital buffers.",
        speed: "Weeks",
      },
      {
        name: "Economic growth",
        direction: "up",
        impactLabel: "HELPS",
        explanation: "Stronger growth improves borrower health and fee activity.",
        speed: "Months",
      },
      {
        name: "Regulatory capital",
        direction: "down",
        impactLabel: "HURTS",
        explanation: "More conservative capital requirements can reduce lending capacity.",
        speed: "Months",
      },
      {
        name: "Market volatility",
        direction: "down",
        impactLabel: "HELPS",
        explanation: "Lower volatility can support advisory and investment-banking deal flow.",
        speed: "Weeks",
      },
      {
        name: "Inflation",
        direction: "down",
        impactLabel: "HELPS",
        explanation: "Lower inflation can stabilize funding costs and reduce surprises in rates.",
        speed: "Months",
      },
    ],
    trends: [
      {
        name: "Higher-quality underwriting",
        whyEmerging: "Banks emphasize stronger credit selection to protect margins in shifting cycles.",
        bestPositioned: ["JPM", "BAC", "AXP"],
        timeline: "1-3 years",
        risk: "Medium",
      },
      {
        name: "Asset-management resilience",
        whyEmerging: "Long-term wealth trends can support flows even when trading volumes vary.",
        bestPositioned: ["BLK", "MS", "GS"],
        timeline: "2-5 years",
        risk: "Low",
      },
      {
        name: "Payment rails growth",
        whyEmerging: "Digital payments continue to expand with card volume and merchant adoption.",
        bestPositioned: ["V", "MA", "AXP"],
        timeline: "1-3 years",
        risk: "Low",
      },
    ],
    companies: [
      { ticker: "JPM" },
      { ticker: "BRK-B" },
      { ticker: "GS" },
      { ticker: "BAC" },
      { ticker: "V" },
      { ticker: "MA" },
      { ticker: "BLK" },
      { ticker: "AXP" },
    ],
  },
  {
    id: "energy",
    iconId: "energy",
    name: "Energy",
    ticker: "XLE",
    plainEnglish: "Oil, gas, and renewable energy companies",
    color: "#f97316",
    whyNowByRegime: {
      overheating: "Energy often benefits from strong demand and pricing power during demand-led inflation.",
      stagflation: "Commodities pressure tends to support energy profitability.",
      recession: "Weak growth can reduce prices, but disciplined supply can cushion outcomes.",
      goldilocks: "Steadier growth can keep energy fundamentals aligned.",
    },
    riskLevelByRegime: {
      overheating: "High",
      recession: "Medium",
    },
    factors: [
      {
        name: "Crude oil & natural gas prices",
        direction: "up",
        impactLabel: "HELPS",
        explanation: "Higher energy prices directly lift cash flows for producers.",
        speed: "Weeks",
      },
      {
        name: "OPEC / supply discipline",
        direction: "up",
        impactLabel: "HELPS",
        explanation: "Tighter supply can support prices and improve utilization rates.",
        speed: "Months",
      },
      {
        name: "Dollar strength",
        direction: "down",
        impactLabel: "HURTS",
        explanation: "A stronger USD can weigh on commodity prices in global markets.",
        speed: "Months",
      },
      {
        name: "Economic growth",
        direction: "up",
        impactLabel: "HELPS",
        explanation: "More industrial activity drives energy demand and refinery throughput.",
        speed: "Months",
      },
      {
        name: "Regulatory pressure on emissions",
        direction: "down",
        impactLabel: "HURTS",
        explanation: "Stricter rules can increase costs, shifting investment decisions.",
        speed: "Years",
      },
      {
        name: "Capex cycle",
        direction: "up",
        impactLabel: "HELPS",
        explanation: "Higher spending can sustain production and support long-run returns.",
        speed: "Years",
      },
    ],
    trends: [
      {
        name: "Nuclear Renaissance",
        whyEmerging:
          "AI data centers need reliable 24/7 power; nuclear is a clean option with stable output.",
        bestPositioned: ["CEG", "VST", "NRG"],
        timeline: "3-7 years",
        risk: "High",
      },
      {
        name: "LNG Export Boom",
        whyEmerging:
          "Europe and Asia paying premium prices can create multi-year demand for US LNG infrastructure.",
        bestPositioned: ["LNG", "CQP", "ET"],
        timeline: "2-5 years",
        risk: "Medium",
      },
      {
        name: "Grid Modernization",
        whyEmerging:
          "Utilities and engineering services benefit from upgrades required for EVs, AI, and renewables.",
        bestPositioned: ["AMETEK", "ROP", "ETN"],
        timeline: "5-10 years",
        risk: "Low",
      },
    ],
    companies: [
      { ticker: "XOM" },
      { ticker: "CVX" },
      { ticker: "COP" },
      { ticker: "EOG" },
      { ticker: "SLB" },
      { ticker: "PXD" },
      { ticker: "WMB" },
      { ticker: "KMI" },
    ],
  },
  {
    id: "consumer-staples",
    iconId: "consumer-staples",
    name: "Consumer Staples",
    ticker: "XLP",
    plainEnglish: "Companies making everyday essentials — food, cleaning products, toiletries",
    color: "#06b6d4",
    whyNowByRegime: {
      recession: "Defensive demand can hold up better when consumers cut discretionary spending.",
      goldilocks: "Steady consumption supports margins when inflation is manageable.",
      stagflation: "Pricing power can help, but volumes may soften.",
    },
    riskLevelByRegime: {
      recession: "Low",
      stagflation: "Medium",
    },
    factors: [
      {
        name: "Real wages",
        direction: "up",
        impactLabel: "HELPS",
        explanation: "Higher real wages support stable demand even when budgets tighten elsewhere.",
        speed: "Months",
      },
      {
        name: "Input costs",
        direction: "down",
        impactLabel: "HELPS",
        explanation: "Lower commodity and logistics costs can expand operating margins.",
        speed: "Months",
      },
      {
        name: "Consumer confidence",
        direction: "up",
        impactLabel: "HELPS",
        explanation: "Confidence supports purchasing frequency and premium product mix.",
        speed: "Weeks",
      },
      {
        name: "Interest rates",
        direction: "down",
        impactLabel: "HELPS",
        explanation: "Lower rates can improve valuation for defensive cash-flow stocks.",
        speed: "Weeks",
      },
      {
        name: "Promotional intensity",
        direction: "down",
        impactLabel: "HELPS",
        explanation: "Fewer discounting periods can stabilize revenue and margins.",
        speed: "Months",
      },
      {
        name: "Pricing power",
        direction: "up",
        impactLabel: "HELPS",
        explanation: "Ability to raise prices without losing too much demand supports results.",
        speed: "Months",
      },
    ],
    trends: [
      {
        name: "Defensive staples rotation",
        whyEmerging:
          "When recession risk rises, investors often rotate into cash-flow steadier consumer staples.",
        bestPositioned: ["PG", "KO", "WMT"],
        timeline: "0-12 months",
        risk: "Low",
      },
      {
        name: "Premiumization",
        whyEmerging:
          "Consumers trade to higher-quality products, supporting brand strength and pricing.",
        bestPositioned: ["COST", "MDLZ", "EL"],
        timeline: "1-3 years",
        risk: "Medium",
      },
      {
        name: "Supply-chain normalization",
        whyEmerging:
          "Improved logistics can reduce costs and help margins recover from prior inflation.",
        bestPositioned: ["PG", "PEP", "KMI"],
        timeline: "6-18 months",
        risk: "Medium",
      },
    ],
    companies: [
      { ticker: "PG" },
      { ticker: "KO" },
      { ticker: "PEP" },
      { ticker: "WMT" },
      { ticker: "COST" },
      { ticker: "PM" },
      { ticker: "CL" },
      { ticker: "MDLZ" },
    ],
  },
  {
    id: "consumer-discretionary",
    iconId: "consumer-discretionary",
    name: "Consumer Discretionary",
    ticker: "XLY",
    plainEnglish:
      "Companies selling things people want but don't need — cars, restaurants, entertainment",
    color: "#ec4899",
    whyNowByRegime: {
      goldilocks: "Stable growth and employment often support discretionary spending and margins.",
      recovery: "Reopening and spending normalization can boost sales for discretionary brands.",
      overheating: "Higher rates can reduce financing affordability, pressuring demand.",
      recession: "Consumers cut back on big-ticket purchases, hurting revenue growth.",
    },
    riskLevelByRegime: {
      overheating: "High",
      recession: "High",
    },
    factors: [
      {
        name: "Household balance sheets",
        direction: "up",
        impactLabel: "HELPS",
        explanation: "Stronger balance sheets increase willingness to buy discretionary products.",
        speed: "Months",
      },
      {
        name: "Interest rates",
        direction: "down",
        impactLabel: "HELPS",
        explanation: "Lower rates reduce financing costs for cars, retail credit, and consumer loans.",
        speed: "Weeks",
      },
      {
        name: "Employment & wage growth",
        direction: "up",
        impactLabel: "HELPS",
        explanation: "Improving labor conditions support discretionary sales.",
        speed: "Months",
      },
      {
        name: "Inflation stickiness",
        direction: "down",
        impactLabel: "HURTS",
        explanation: "Sticky inflation squeezes budgets and can delay discretionary purchases.",
        speed: "Months",
      },
      {
        name: "Consumer confidence",
        direction: "up",
        impactLabel: "HELPS",
        explanation: "Confidence improves demand and supports higher spending frequency.",
        speed: "Weeks",
      },
      {
        name: "Earnings revisions",
        direction: "up",
        impactLabel: "HELPS",
        explanation: "When guidance improves, investors often re-rate the sector quickly.",
        speed: "Days",
      },
    ],
    trends: [
      {
        name: "Experience economy resilience",
        whyEmerging:
          "Even in slower cycles, customers keep spending on certain experiences and convenience.",
        bestPositioned: ["MCD", "SBUX", "BKNG"],
        timeline: "1-3 years",
        risk: "Medium",
      },
      {
        name: "EV & auto financing turning point",
        whyEmerging:
          "Rate expectations shift auto affordability and can influence demand rebounds.",
        bestPositioned: ["TSLA", "HD", "AMZN"],
        timeline: "6-18 months",
        risk: "High",
      },
      {
        name: "Retail efficiency and margin recovery",
        whyEmerging:
          "Improved inventory and logistics can restore margins as sales stabilize.",
        bestPositioned: ["HD", "TJX", "AMZN"],
        timeline: "1-3 years",
        risk: "Medium",
      },
    ],
    companies: [
      { ticker: "AMZN" },
      { ticker: "TSLA" },
      { ticker: "HD" },
      { ticker: "MCD" },
      { ticker: "NKE" },
      { ticker: "SBUX" },
      { ticker: "BKNG" },
      { ticker: "TJX" },
    ],
  },
  {
    id: "industrials",
    iconId: "industrials",
    name: "Industrials",
    ticker: "XLI",
    plainEnglish: "Companies that build things — planes, machinery, construction",
    color: "#6b7280",
    whyNowByRegime: {
      recovery: "Capex and infrastructure activity often rebound in recovery phases.",
      goldilocks: "Steady demand supports industrial orders and backlog quality.",
      overheating: "Higher rates can reduce construction affordability and project start dates.",
    },
    riskLevelByRegime: {
      overheating: "Medium",
      recession: "High",
    },
    factors: [
      {
        name: "Industrial production",
        direction: "up",
        impactLabel: "HELPS",
        explanation: "Higher industrial output increases demand for equipment and services.",
        speed: "Months",
      },
      {
        name: "Capex cycle",
        direction: "up",
        impactLabel: "HELPS",
        explanation: "Rising capital spending boosts machinery, aerospace, and logistics providers.",
        speed: "Months",
      },
      {
        name: "Interest rates",
        direction: "down",
        impactLabel: "HELPS",
        explanation: "Lower rates can reduce financing friction for projects and inventories.",
        speed: "Weeks",
      },
      {
        name: "Global trade",
        direction: "up",
        impactLabel: "HELPS",
        explanation: "More trade increases freight, transport, and industrial demand.",
        speed: "Months",
      },
      {
        name: "Supply chain normalization",
        direction: "down",
        impactLabel: "HURTS",
        explanation: "Ongoing bottlenecks can raise costs and delay deliveries when conditions worsen.",
        speed: "Months",
      },
      {
        name: "Earnings momentum",
        direction: "up",
        impactLabel: "HELPS",
        explanation: "Strong guidance and margin improvement can re-rate industrial names.",
        speed: "Days",
      },
    ],
    trends: [
      {
        name: "Infrastructure & modernization",
        whyEmerging: "Upgrades to logistics, power, and industrial capacity support multi-year industrial demand.",
        bestPositioned: ["HON", "CAT", "UNP"],
        timeline: "3-7 years",
        risk: "Low",
      },
      {
        name: "Defense and aerospace cycle",
        whyEmerging: "Defense spending can remain steadier even when consumer demand softens.",
        bestPositioned: ["RTX", "LMT", "BA"],
        timeline: "2-5 years",
        risk: "Medium",
      },
      {
        name: "Rail & automation",
        whyEmerging: "Automation and rail expansion improve efficiency and can lift margins.",
        bestPositioned: ["UNP", "DE", "MMM"],
        timeline: "1-3 years",
        risk: "Medium",
      },
    ],
    companies: [
      { ticker: "CAT" },
      { ticker: "HON" },
      { ticker: "UNP" },
      { ticker: "RTX" },
      { ticker: "DE" },
      { ticker: "MMM" },
      { ticker: "BA" },
      { ticker: "LMT" },
    ],
  },
  {
    id: "real-estate",
    iconId: "real-estate",
    name: "Real Estate",
    ticker: "XLRE",
    plainEnglish: "Companies that own and rent out buildings and properties",
    color: "#a78bfa",
    whyNowByRegime: {
      recovery: "Improving growth expectations can stabilize occupancy and rents.",
      goldilocks: "Healthy financing conditions help cap-rate and valuation support.",
      overheating: "Higher rates can compress real-estate valuations.",
      recession: "Weak demand can pressure occupancy and cash flow.",
    },
    riskLevelByRegime: {
      overheating: "High",
      recession: "Medium",
    },
    factors: [
      {
        name: "Interest rates & mortgages",
        direction: "down",
        impactLabel: "HELPS",
        explanation: "Lower rates reduce borrowing costs and support property valuations.",
        speed: "Months",
      },
      {
        name: "Occupancy & rent growth",
        direction: "up",
        impactLabel: "HELPS",
        explanation: "Improving demand lifts revenue and can slow down rent discounting.",
        speed: "Months",
      },
      {
        name: "Credit conditions",
        direction: "down",
        impactLabel: "HURTS",
        explanation: "Tighter lending standards increase refinancing risk and capex delays.",
        speed: "Weeks",
      },
      {
        name: "Inflation passthrough",
        direction: "up",
        impactLabel: "HELPS",
        explanation: "Some leases allow price adjustments, cushioning inflation effects.",
        speed: "Months",
      },
      {
        name: "Consumer employment",
        direction: "up",
        impactLabel: "HELPS",
        explanation: "Better employment supports residential demand and lease renewals.",
        speed: "Months",
      },
      {
        name: "E-commerce & logistics real estate",
        direction: "up",
        impactLabel: "HELPS",
        explanation: "More fulfillment center demand supports industrial REITs.",
        speed: "Years",
      },
    ],
    trends: [
      {
        name: "Logistics real-estate tailwinds",
        whyEmerging: "Supply-chain and e-commerce fulfillment still need more warehouse capacity.",
        bestPositioned: ["PLD", "EQIX", "AMT"],
        timeline: "2-5 years",
        risk: "Medium",
      },
      {
        name: "Data center demand",
        whyEmerging: "AI compute requires more data centers, increasing long-dated lease demand.",
        bestPositioned: ["EQIX", "AMT", "CCI"],
        timeline: "3-7 years",
        risk: "Medium",
      },
      {
        name: "Refinancing discipline",
        whyEmerging: "Conservative balance sheets reduce refinancing shocks during tighter credit.",
        bestPositioned: ["O", "PSA", "WELL"],
        timeline: "1-3 years",
        risk: "Low",
      },
    ],
    companies: [
      { ticker: "PLD" },
      { ticker: "AMT" },
      { ticker: "EQIX" },
      { ticker: "CCI" },
      { ticker: "PSA" },
      { ticker: "WELL" },
      { ticker: "SPG" },
      { ticker: "O" },
    ],
  },
  {
    id: "utilities",
    iconId: "utilities",
    name: "Utilities",
    ticker: "XLU",
    plainEnglish: "Electric, gas, and water companies that keep the lights on",
    color: "#fbbf24",
    whyNowByRegime: {
      overheating: "Defensive cash flows can remain attractive even when growth is strong.",
      stagflation: "Inflation can support regulated rate adjustments over time.",
      recession: "Utilities often trade like bond proxies during risk-off periods.",
    },
    riskLevelByRegime: {
      goldilocks: "Low",
      overheating: "Medium",
    },
    factors: [
      {
        name: "Interest rates",
        direction: "down",
        impactLabel: "HELPS",
        explanation: "Lower yields increase the relative attractiveness of utility cash flows.",
        speed: "Weeks",
      },
      {
        name: "Regulation & rate cases",
        direction: "up",
        impactLabel: "HELPS",
        explanation: "Favorable rate decisions can lift earnings stability.",
        speed: "Months",
      },
      {
        name: "Inflation",
        direction: "up",
        impactLabel: "HELPS",
        explanation: "Some costs can be passed through, supporting revenue over time.",
        speed: "Months",
      },
      {
        name: "Demand stability",
        direction: "up",
        impactLabel: "HELPS",
        explanation: "Utilities serve essential demand, helping reduce downside during slowdowns.",
        speed: "Years",
      },
      {
        name: "Renewables integration",
        direction: "up",
        impactLabel: "HELPS",
        explanation: "Grid investments increase long-run capex opportunities and service revenues.",
        speed: "Years",
      },
      {
        name: "Weather impacts",
        direction: "down",
        impactLabel: "HURTS",
        explanation: "Extreme weather can raise costs and create volatility in earnings.",
        speed: "Days",
      },
    ],
    trends: [
      {
        name: "Rate-base growth",
        whyEmerging: "Utility investments increase regulated capital bases and support multi-year earnings.",
        bestPositioned: ["NEE", "DUK", "SO"],
        timeline: "3-7 years",
        risk: "Low",
      },
      {
        name: "Grid modernization cycle",
        whyEmerging: "EVs, AI load, and renewables require major grid upgrades across the country.",
        bestPositioned: ["AEP", "ED", "EXC"],
        timeline: "5-10 years",
        risk: "Low",
      },
      {
        name: "Resilience planning",
        whyEmerging: "Hardening infrastructure for climate resilience can keep service reliability stronger.",
        bestPositioned: ["SRE", "D", "DUK"],
        timeline: "2-5 years",
        risk: "Medium",
      },
    ],
    companies: [
      { ticker: "NEE" },
      { ticker: "DUK" },
      { ticker: "SO" },
      { ticker: "D" },
      { ticker: "AEP" },
      { ticker: "ED" },
      { ticker: "EXC" },
      { ticker: "SRE" },
    ],
  },
  {
    id: "materials",
    iconId: "materials",
    name: "Materials",
    ticker: "XLB",
    plainEnglish: "Companies mining metals, making chemicals, and producing raw materials",
    color: "#84cc16",
    whyNowByRegime: {
      overheating: "Demand and pricing for inputs often improve when the economy is hot.",
      stagflation: "Inflation and commodity price pressure can support materials profitability.",
      recession: "Lower growth can weaken volumes and margins.",
      goldilocks: "Stable expansion supports industrial input demand.",
    },
    riskLevelByRegime: {
      overheating: "High",
      recession: "High",
    },
    factors: [
      {
        name: "Commodity prices",
        direction: "up",
        impactLabel: "HELPS",
        explanation: "Rising commodity prices increase revenues for producers and processors.",
        speed: "Weeks",
      },
      {
        name: "Industrial demand",
        direction: "up",
        impactLabel: "HELPS",
        explanation: "Construction and manufacturing activity lifts need for raw materials.",
        speed: "Months",
      },
      {
        name: "Dollar strength",
        direction: "down",
        impactLabel: "HURTS",
        explanation: "A stronger USD can reduce global commodity purchasing power and prices.",
        speed: "Months",
      },
      {
        name: "Energy costs",
        direction: "down",
        impactLabel: "HELPS",
        explanation: "Lower energy costs can reduce input expenses for chemicals and production.",
        speed: "Weeks",
      },
      {
        name: "Supply discipline",
        direction: "up",
        impactLabel: "HELPS",
        explanation: "Constrained supply can stabilize prices and improve realized margins.",
        speed: "Months",
      },
      {
        name: "Regulatory & capex",
        direction: "down",
        impactLabel: "HURTS",
        explanation: "More restrictions can raise costs and delay production expansion.",
        speed: "Years",
      },
    ],
    trends: [
      {
        name: "Industrial input re-stocking",
        whyEmerging:
          "When inventory cycles shift, materials often see demand and pricing accelerate quickly.",
        bestPositioned: ["FCX", "NEM", "LIN"],
        timeline: "6-18 months",
        risk: "Medium",
      },
      {
        name: "Clean-tech materials demand",
        whyEmerging:
          "Electrification and grid buildouts require more metals and chemicals for components.",
        bestPositioned: ["APD", "PPG", "DOW"],
        timeline: "3-7 years",
        risk: "Medium",
      },
      {
        name: "Capacity optimization",
        whyEmerging:
          "Producers that optimize capacity can capture better margins during pricing upswings.",
        bestPositioned: ["NUE", "SHW", "FCX"],
        timeline: "1-3 years",
        risk: "Low",
      },
    ],
    companies: [
      { ticker: "LIN" },
      { ticker: "APD" },
      { ticker: "SHW" },
      { ticker: "FCX" },
      { ticker: "NUE" },
      { ticker: "NEM" },
      { ticker: "DOW" },
      { ticker: "PPG" },
    ],
  },
  {
    id: "emerging-tech",
    iconId: "emerging-tech",
    name: "Emerging Tech",
    ticker: "ARKK",
    plainEnglish: "Cutting edge companies in AI, robotics, genomics, and space",
    color: "#ef4444",
    whyNowByRegime: {
      goldilocks: "Risk-on sentiment can lift innovative growth and disruptors’ valuations.",
      recovery: "Improving growth can support higher beta innovation exposures.",
      overheating: "Higher rates can hurt unprofitable growth, increasing volatility.",
      stagflation: "Input and financing stress can compress long-duration winners/losers.",
      recession: "Capital may rotate away from high-beta innovation during downturns.",
    },
    riskLevelByRegime: {
      goldilocks: "High",
      recession: "High",
    },
    factors: [
      {
        name: "Risk appetite",
        direction: "up",
        impactLabel: "HELPS",
        explanation: "When investors chase growth, high-beta innovation baskets outperform.",
        speed: "Days",
      },
      {
        name: "Interest rates",
        direction: "down",
        impactLabel: "HELPS",
        explanation: "Lower rates reduce discounting pressure and can boost ARK-style valuations.",
        speed: "Weeks",
      },
      {
        name: "AI adoption momentum",
        direction: "up",
        impactLabel: "HELPS",
        explanation: "Faster adoption improves revenue visibility and supports narrative-driven demand.",
        speed: "Months",
      },
      {
        name: "IPO / funding conditions",
        direction: "down",
        impactLabel: "HURTS",
        explanation: "Tighter funding can slow expansion for many innovation companies.",
        speed: "Months",
      },
      {
        name: "Regulatory uncertainty",
        direction: "down",
        impactLabel: "HURTS",
        explanation: "Unclear rules for tech platforms can delay monetization and partnerships.",
        speed: "Months",
      },
      {
        name: "Profitability inflection",
        direction: "up",
        impactLabel: "HELPS",
        explanation: "When losses narrow, the sector can re-rate more sustainably.",
        speed: "Years",
      },
    ],
    trends: [
      {
        name: "AI-native platforms",
        whyEmerging: "New product cycles are shifting from pilots to revenue-generating deployments.",
        bestPositioned: ["PLTR", "NET", "PATH"],
        timeline: "1-3 years",
        risk: "High",
      },
      {
        name: "Genomics acceleration",
        whyEmerging: "Lower compute costs and better tooling are expanding adoption in research and care.",
        bestPositioned: ["ROKU", "COIN", "ZM"],
        timeline: "2-5 years",
        risk: "Medium",
      },
      {
        name: "Automation and robotics",
        whyEmerging: "Operational automation demand is rising across industries looking to cut costs.",
        bestPositioned: ["TWLO", "PLTR", "U"],
        timeline: "3-5 years",
        risk: "Medium",
      },
    ],
    companies: [
      { ticker: "PLTR" },
      { ticker: "COIN" },
      { ticker: "ROKU" },
      { ticker: "U" },
      { ticker: "PATH" },
      { ticker: "TWLO" },
      { ticker: "ZM" },
      { ticker: "NET" },
    ],
  },
];

export const SECTOR_BY_ID: Record<SectorId, SectorConfig> = Object.fromEntries(
  SECTORS.map((s) => [s.id, s]),
) as Record<SectorId, SectorConfig>;

export const SECTOR_IDS: SectorId[] = SECTORS.map((s) => s.id);

