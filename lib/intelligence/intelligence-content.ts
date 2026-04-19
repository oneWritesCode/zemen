export type ImpactDirection = "UP" | "DOWN" | "UP/DOWN";
export type EffectSpeed = "Immediate" | "Weeks" | "Months" | "Years";
export type PlayerType = "Central Bank" | "Government" | "Corporation" | "Index" | "Market";

export type RangeZone = {
  label: string;
  color: string;
  min: number;
  max: number;
};

export type FactorCard = {
  name: string;
  direction: ImpactDirection;
  explanation: string;
  speed: EffectSpeed;
};

export type KeyPlayer = {
  name: string;
  type: PlayerType;
  role: string;
  power: 1 | 2 | 3 | 4 | 5;
  example: string;
};

export type TimelineEvent = {
  year: string;
  event: string;
  move: string;
  explanation: string;
};

export type IndicatorIntelligence = {
  title: string;
  what: string;
  unit: string;
  rangeTitle: string;
  rangeZones: RangeZone[];
  currentSummaryTemplate: string;
  highMeans: string[];
  lowMeans: string[];
  risingMeans: string[];
  fallingMeans: string[];
  factors: FactorCard[];
  players: KeyPlayer[];
  timeline: TimelineEvent[];
  nowContext: string[];
  primarySeriesKey: string;
};

export const INTELLIGENCE_CONTENT: Record<string, IndicatorIntelligence> = {
  "interest-rates": {
    title: "Interest Rates",
    what: "This graph shows how expensive it is to borrow money in the US economy.",
    unit:
      "The numbers on the left are percentages (%). A reading of 5 means a 5% yearly borrowing cost.",
    rangeTitle: "Lower rates support borrowing, very high rates slow demand.",
    rangeZones: [
      { label: "Very low", color: "#ef4444", min: 0, max: 1 },
      { label: "Low", color: "#ffffff", min: 1, max: 2.5 },
      { label: "Balanced", color: "#22c55e", min: 2.5, max: 4 },
      { label: "Tight", color: "#ffffff", min: 4, max: 5.5 },
      { label: "Restrictive", color: "#ef4444", min: 5.5, max: 8 },
    ],
    currentSummaryTemplate:
      "Right now rates are around {value}, which means borrowing is still expensive compared with most of the last decade.",
    highMeans: [
      "Loans for homes, cars, and businesses get more expensive.",
      "Spending and hiring usually slow down after a few months.",
      "Savings accounts and short-term bonds usually pay more.",
    ],
    lowMeans: [
      "Borrowing gets cheaper for families and businesses.",
      "Housing and business investment often get a boost.",
      "Too-low rates for too long can increase inflation risk.",
    ],
    risingMeans: [
      "The central bank is trying to cool demand and inflation.",
      "Markets may reprice risky assets lower.",
    ],
    fallingMeans: [
      "Policy is becoming more supportive for growth.",
      "Debt-heavy sectors usually get relief first.",
    ],
    factors: [
      {
        name: "Federal Reserve policy",
        direction: "UP/DOWN",
        explanation: "When the Fed changes its policy rate, borrowing costs move with it.",
        speed: "Immediate",
      },
      {
        name: "Inflation pressure",
        direction: "UP",
        explanation: "Hot inflation often pushes policymakers to keep rates higher.",
        speed: "Months",
      },
      {
        name: "Job market weakness",
        direction: "DOWN",
        explanation: "If unemployment rises, rate cuts become more likely.",
        speed: "Months",
      },
      {
        name: "Treasury bond supply",
        direction: "UP",
        explanation: "Large government borrowing can push longer-term yields up.",
        speed: "Weeks",
      },
    ],
    players: [
      {
        name: "Federal Reserve (FOMC)",
        type: "Central Bank",
        role: "Sets the policy rate and signals future moves.",
        power: 5,
        example:
          "In 2022, the Fed raised rates repeatedly, taking the policy range from near zero to above 4%.",
      },
      {
        name: "Jerome Powell",
        type: "Central Bank",
        role: "As Fed Chair, his guidance shifts market expectations for upcoming meetings.",
        power: 4,
        example: "In 2023, hawkish press conferences pushed Treasury yields sharply higher.",
      },
      {
        name: "US Treasury",
        type: "Government",
        role: "Issues bonds that influence medium and long-term market rates.",
        power: 4,
        example: "Heavy Treasury issuance in 2023 contributed to tighter long-end conditions.",
      },
    ],
    timeline: [
      {
        year: "2001",
        event: "Dot-com easing",
        move: "↓ from 6.5% to 1.75%",
        explanation: "The Fed cut quickly as growth slowed after the tech bust.",
      },
      {
        year: "2008",
        event: "Global financial crisis",
        move: "↓ to 0.00-0.25%",
        explanation: "Emergency cuts were used to stabilize credit and demand.",
      },
      {
        year: "2015",
        event: "Post-crisis lift-off",
        move: "↑ first hike to 0.25-0.50%",
        explanation: "The Fed began normalizing policy after years at zero.",
      },
      {
        year: "2022",
        event: "Inflation fight",
        move: "↑ fastest hiking cycle in decades",
        explanation: "High inflation forced aggressive policy tightening.",
      },
      {
        year: "2024",
        event: "First easing step",
        move: "↓ modest cuts began",
        explanation: "With inflation lower than 2022 peaks, policy became less restrictive.",
      },
    ],
    nowContext: [
      "After the fastest hiking cycle in decades, US policy rates stayed high through much of 2024 and then began easing in smaller steps. That shift reduced some pressure on rate-sensitive sectors like housing, but financing costs remained elevated versus the pre-2022 era.",
      "Through 2025 and into early 2026, markets have focused on whether inflation can keep cooling without a major rise in unemployment. Analysts are watching each Fed meeting, labor report, and inflation release for clues on how quickly policy can normalize.",
    ],
    primarySeriesKey: "fed",
  },
  inflation: {
    title: "Inflation",
    what: "This graph shows how quickly prices are rising for everyday goods and services.",
    unit:
      "Most inflation lines here are percentages (%). A reading of 3 means prices are about 3% higher than a year ago.",
    rangeTitle: "Very high inflation hurts buying power, very low inflation can signal weak demand.",
    rangeZones: [
      { label: "Too low", color: "#ef4444", min: -1, max: 1 },
      { label: "Cool", color: "#ffffff", min: 1, max: 2 },
      { label: "Healthy", color: "#22c55e", min: 2, max: 3 },
      { label: "Warm", color: "#ffffff", min: 3, max: 4.5 },
      { label: "Hot", color: "#ef4444", min: 4.5, max: 10 },
    ],
    currentSummaryTemplate:
      "Right now inflation is about {value}, which means price growth is slower than the 2022 spike but still important for budgets and policy.",
    highMeans: [
      "Families lose buying power because wages may not keep up.",
      "Central banks usually keep policy tighter for longer.",
      "Business costs rise, which can squeeze profit margins.",
    ],
    lowMeans: [
      "Prices are more stable and planning gets easier.",
      "Rate cuts become more likely if growth also slows.",
      "Very low inflation can reflect weak consumer demand.",
    ],
    risingMeans: [
      "Price pressures are broadening across sectors.",
      "Markets may fear fewer or slower rate cuts.",
    ],
    fallingMeans: [
      "Supply and demand are moving back into balance.",
      "Real wage growth can improve if pay keeps rising.",
    ],
    factors: [
      {
        name: "Energy prices",
        direction: "UP/DOWN",
        explanation: "Oil and fuel moves flow through transport and household bills.",
        speed: "Weeks",
      },
      {
        name: "Wage growth",
        direction: "UP",
        explanation: "Faster pay growth can lift service-sector prices.",
        speed: "Months",
      },
      {
        name: "Supply chain shocks",
        direction: "UP",
        explanation: "Shortages make goods harder to get and more expensive.",
        speed: "Weeks",
      },
      {
        name: "Fed policy stance",
        direction: "DOWN",
        explanation: "Higher rates cool demand and reduce inflation pressure over time.",
        speed: "Months",
      },
    ],
    players: [
      {
        name: "Bureau of Labor Statistics (BLS)",
        type: "Government",
        role: "Publishes CPI data that markets and policymakers watch each month.",
        power: 4,
        example: "The June 2022 CPI release showed 9.1% YoY, marking the cycle peak.",
      },
      {
        name: "Federal Reserve",
        type: "Central Bank",
        role: "Sets policy rates to slow or support demand and inflation.",
        power: 5,
        example: "Rapid 2022-2023 hikes were aimed at bringing inflation down.",
      },
      {
        name: "OPEC+",
        type: "Market",
        role: "Oil production decisions affect global energy prices.",
        power: 3,
        example: "Production cuts in 2023 supported oil prices and near-term inflation risks.",
      },
    ],
    timeline: [
      {
        year: "2008",
        event: "Commodity spike",
        move: "↑ CPI near 5.6%",
        explanation: "Energy and commodity prices surged before the crisis downturn.",
      },
      {
        year: "2009",
        event: "Crisis disinflation",
        move: "↓ CPI briefly below 0%",
        explanation: "Demand collapsed, pulling inflation sharply lower.",
      },
      {
        year: "2021",
        event: "Reopening jump",
        move: "↑ CPI moved above 7%",
        explanation: "Demand returned quickly while supply remained constrained.",
      },
      {
        year: "2022",
        event: "Cycle peak",
        move: "↑ CPI 9.1% YoY",
        explanation: "Energy shocks and broad price pressures pushed inflation to a multi-decade high.",
      },
      {
        year: "2024",
        event: "Cooling phase",
        move: "↓ down from 2022 highs",
        explanation: "Goods inflation eased and policy tightening slowed demand.",
      },
    ],
    nowContext: [
      "US inflation is far below its 2022 peak, but the final move back to target has been uneven. Services inflation, especially shelter and labor-heavy categories, has been slower to cool than goods inflation.",
      "In 2025-2026, economists are watching whether inflation settles near target without another growth shock. Markets react quickly to each CPI and PCE release because small surprises can change the expected path of interest rates.",
    ],
    primarySeriesKey: "cpiYoy",
  },
  unemployment: {
    title: "Unemployment",
    what: "This graph shows how many people who want a job still cannot find one.",
    unit:
      "The numbers are percentages (% of the labor force). A reading of 4 means 4 out of every 100 workers are unemployed.",
    rangeTitle: "Lower is usually better, but extremely low levels can raise wage pressure.",
    rangeZones: [
      { label: "Very tight", color: "#ef4444", min: 2, max: 3.2 },
      { label: "Tight", color: "#ffffff", min: 3.2, max: 3.8 },
      { label: "Healthy", color: "#22c55e", min: 3.8, max: 4.8 },
      { label: "Soft", color: "#ffffff", min: 4.8, max: 6 },
      { label: "Weak", color: "#ef4444", min: 6, max: 12 },
    ],
    currentSummaryTemplate:
      "Right now unemployment is near {value}, which suggests the labor market is softer than the post-pandemic low but still historically resilient.",
    highMeans: [
      "More households cut spending because income is uncertain.",
      "Businesses reduce hiring and investment plans.",
      "Recession risk usually increases.",
    ],
    lowMeans: [
      "Workers have more bargaining power and job options.",
      "Consumer spending usually stays stronger.",
      "Wage pressure can rise if labor supply is tight.",
    ],
    risingMeans: [
      "Demand for workers is cooling.",
      "Growth momentum is often slowing.",
    ],
    fallingMeans: [
      "Hiring demand is improving.",
      "Household confidence usually rises.",
    ],
    factors: [
      {
        name: "Business demand",
        direction: "DOWN",
        explanation: "When companies sell more, they hire more and unemployment falls.",
        speed: "Months",
      },
      {
        name: "Interest rates",
        direction: "UP",
        explanation: "Higher borrowing costs can reduce hiring and raise layoffs over time.",
        speed: "Months",
      },
      {
        name: "Government fiscal support",
        direction: "DOWN",
        explanation: "Public spending programs can keep demand and jobs supported.",
        speed: "Months",
      },
      {
        name: "Productivity and automation",
        direction: "UP/DOWN",
        explanation: "Efficiency gains can reduce some jobs but create others in new sectors.",
        speed: "Years",
      },
    ],
    players: [
      {
        name: "Bureau of Labor Statistics",
        type: "Government",
        role: "Publishes monthly unemployment and payroll reports.",
        power: 4,
        example: "The April 2020 report showed unemployment spiking to 14.7%.",
      },
      {
        name: "Federal Reserve",
        type: "Central Bank",
        role: "Influences hiring conditions through interest-rate policy.",
        power: 5,
        example: "Rate cuts in 2020 helped stabilize demand and labor conditions.",
      },
      {
        name: "Large employers",
        type: "Corporation",
        role: "Hiring or layoffs by major firms shape labor momentum.",
        power: 3,
        example: "Broad tech layoffs in 2022-2023 signaled cooling in parts of the labor market.",
      },
    ],
    timeline: [
      {
        year: "2000",
        event: "Late-cycle low",
        move: "↓ near 3.8%",
        explanation: "The labor market was very tight at the end of the 1990s expansion.",
      },
      {
        year: "2009",
        event: "Great Recession peak",
        move: "↑ to 10.0%",
        explanation: "A deep credit and housing shock caused heavy job losses.",
      },
      {
        year: "2020",
        event: "Pandemic shutdown",
        move: "↑ to 14.7%",
        explanation: "Lockdowns caused a sudden collapse in service-sector employment.",
      },
      {
        year: "2022",
        event: "Recovery tightness",
        move: "↓ near 3.5%",
        explanation: "Strong reopening demand pulled unemployment back to low levels.",
      },
      {
        year: "2024",
        event: "Cooling but stable",
        move: "↑ modestly above cycle lows",
        explanation: "Hiring slowed without a recession-scale surge in unemployment.",
      },
    ],
    nowContext: [
      "The labor market has gradually cooled from post-pandemic extremes, but unemployment has remained low by long-run standards. Hiring is slower than in 2021-2022, and job openings have normalized from very elevated levels.",
      "For 2025-2026, economists are focused on whether cooling continues in an orderly way or turns into a broader layoffs cycle. This indicator matters because labor income is the main driver of consumer spending.",
    ],
    primarySeriesKey: "u3",
  },
  "gdp-growth": {
    title: "GDP Growth",
    what: "This graph shows how fast the total US economy is growing or shrinking.",
    unit:
      "Growth readings are percentages (%). A reading of 2 means the economy is about 2% larger than one year earlier.",
    rangeTitle: "Moderate positive growth is usually healthiest for stability.",
    rangeZones: [
      { label: "Contraction", color: "#ef4444", min: -6, max: 0 },
      { label: "Weak", color: "#ffffff", min: 0, max: 1 },
      { label: "Healthy", color: "#22c55e", min: 1, max: 3 },
      { label: "Hot", color: "#ffffff", min: 3, max: 5 },
      { label: "Unsustainable", color: "#ef4444", min: 5, max: 9 },
    ],
    currentSummaryTemplate:
      "Right now GDP growth is around {value}, which suggests the economy is still expanding but facing a slower, more mature phase.",
    highMeans: [
      "Business sales and hiring are usually stronger.",
      "Tax revenues improve and default risks often fall.",
      "If growth is too hot, inflation pressure can rise.",
    ],
    lowMeans: [
      "Consumers and businesses are spending less.",
      "Job growth often slows or turns negative.",
      "Recession risk rises when weakness lasts for multiple quarters.",
    ],
    risingMeans: [
      "Momentum is improving across demand and production.",
      "Risk assets often respond positively at first.",
    ],
    fallingMeans: [
      "Growth is losing speed, often before labor data weakens.",
      "Policy support becomes more likely.",
    ],
    factors: [
      {
        name: "Consumer spending",
        direction: "UP",
        explanation: "Household purchases are the largest part of GDP.",
        speed: "Weeks",
      },
      {
        name: "Interest rate hikes",
        direction: "DOWN",
        explanation: "Higher rates reduce borrowing, investment, and big-ticket demand.",
        speed: "Months",
      },
      {
        name: "Government spending",
        direction: "UP",
        explanation: "Public projects and services directly add to GDP activity.",
        speed: "Months",
      },
      {
        name: "Global demand",
        direction: "UP/DOWN",
        explanation: "Stronger foreign demand supports exports and domestic production.",
        speed: "Months",
      },
    ],
    players: [
      {
        name: "Bureau of Economic Analysis (BEA)",
        type: "Government",
        role: "Measures and publishes official GDP estimates.",
        power: 4,
        example: "BEA reported the 2020 contraction and 2021 rebound that reset market expectations.",
      },
      {
        name: "US Congress and White House",
        type: "Government",
        role: "Fiscal packages can rapidly support or restrain demand.",
        power: 4,
        example: "Large pandemic-era stimulus bills lifted activity during the recovery period.",
      },
      {
        name: "Federal Reserve",
        type: "Central Bank",
        role: "Rate policy influences credit, spending, and investment demand.",
        power: 5,
        example: "Aggressive tightening in 2022 cooled growth-sensitive sectors.",
      },
    ],
    timeline: [
      {
        year: "2008",
        event: "Financial crisis",
        move: "↓ to about -2.5% YoY",
        explanation: "Credit stress and housing collapse hit consumption and investment.",
      },
      {
        year: "2020",
        event: "Pandemic shock",
        move: "↓ around -3.4% (annual)",
        explanation: "Shutdowns reduced activity across services, travel, and production.",
      },
      {
        year: "2021",
        event: "Reopening surge",
        move: "↑ about +5.7% (annual)",
        explanation: "Stimulus, reopening, and pent-up demand drove a fast rebound.",
      },
      {
        year: "2022",
        event: "Rate shock period",
        move: "↓ growth slowed",
        explanation: "Higher rates and inflation pressure cooled demand.",
      },
      {
        year: "2024",
        event: "Soft-landing debate",
        move: "↔ positive but slower",
        explanation: "Growth remained resilient even as policy stayed restrictive.",
      },
    ],
    nowContext: [
      "US growth has stayed positive despite high rates, which surprised many forecasters who expected a sharper slowdown. Household consumption and government-related spending have helped offset weakness in some interest-sensitive areas.",
      "Into 2025-2026, attention is on whether growth can remain steady while inflation keeps easing. Analysts are watching productivity trends, labor income, and business investment for signs of the next phase.",
    ],
    primarySeriesKey: "rgdpYoy",
  },
  housing: {
    title: "Housing Market",
    what: "This graph shows how strong home prices and mortgage borrowing conditions are.",
    unit:
      "Home-price lines use an index number, while mortgage lines use percentages (%). Higher index means higher prices than the base period.",
    rangeTitle: "Balanced housing demand avoids both collapse and overheating.",
    rangeZones: [
      { label: "Stress", color: "#ef4444", min: 1, max: 3.5 },
      { label: "Soft", color: "#ffffff", min: 3.5, max: 5 },
      { label: "Balanced", color: "#22c55e", min: 5, max: 6.5 },
      { label: "Tight", color: "#ffffff", min: 6.5, max: 7.5 },
      { label: "Strained", color: "#ef4444", min: 7.5, max: 10 },
    ],
    currentSummaryTemplate:
      "Right now mortgage rates are around {value}, which keeps affordability under pressure even where prices have cooled.",
    highMeans: [
      "Monthly housing payments jump, reducing buyer demand.",
      "Sales and refinancing activity usually slow.",
      "Builders may delay projects if demand weakens.",
    ],
    lowMeans: [
      "Borrowing gets cheaper and demand often improves.",
      "Housing turnover and construction can pick up.",
      "Very low rates can fuel faster price increases.",
    ],
    risingMeans: [
      "Affordability pressure is increasing.",
      "Price growth often cools with a lag.",
    ],
    fallingMeans: [
      "Financing conditions are easing for buyers.",
      "Housing activity can recover before prices fully respond.",
    ],
    factors: [
      {
        name: "Mortgage rates",
        direction: "DOWN",
        explanation: "Higher rates reduce what buyers can afford each month.",
        speed: "Immediate",
      },
      {
        name: "Housing supply",
        direction: "UP/DOWN",
        explanation: "More homes for sale reduce price pressure; low supply supports prices.",
        speed: "Months",
      },
      {
        name: "Labor income",
        direction: "UP",
        explanation: "Stronger incomes support demand for home purchases.",
        speed: "Months",
      },
      {
        name: "Zoning and building policy",
        direction: "UP/DOWN",
        explanation: "Rules can expand or constrain new housing supply.",
        speed: "Years",
      },
    ],
    players: [
      {
        name: "Federal Reserve",
        type: "Central Bank",
        role: "Policy rates influence mortgage financing costs.",
        power: 5,
        example: "2022 tightening lifted mortgage rates to multi-year highs.",
      },
      {
        name: "Freddie Mac",
        type: "Government",
        role: "Tracks and supports mortgage market benchmarks.",
        power: 4,
        example: "Its weekly survey documented the rapid rise in 30-year rates after 2022.",
      },
      {
        name: "Major US homebuilders",
        type: "Corporation",
        role: "Construction pace affects future housing supply.",
        power: 3,
        example: "Builders offered mortgage buydowns in 2023-2024 to support demand.",
      },
    ],
    timeline: [
      {
        year: "2006",
        event: "Housing bubble peak",
        move: "↑ prices peaked",
        explanation: "Loose credit and speculation pushed valuations to unsustainable levels.",
      },
      {
        year: "2008",
        event: "Housing crash",
        move: "↓ Case-Shiller fell sharply",
        explanation: "Foreclosures and credit contraction hit prices nationwide.",
      },
      {
        year: "2020",
        event: "Pandemic rate drop",
        move: "↓ mortgage rates, ↑ prices",
        explanation: "Cheap financing and limited supply boosted home demand.",
      },
      {
        year: "2022",
        event: "Rate shock",
        move: "↑ mortgage rates above 7%",
        explanation: "Tighter policy made housing much less affordable.",
      },
      {
        year: "2024",
        event: "Inventory normalization",
        move: "↔ activity mixed",
        explanation: "Rates stayed high while supply conditions slowly improved.",
      },
    ],
    nowContext: [
      "Housing remains one of the most rate-sensitive parts of the economy. Even with some stabilization in prices, affordability has stayed difficult in many markets because mortgage rates remain much higher than pre-2022 norms.",
      "In 2025-2026, analysts are watching whether lower policy rates can translate into sustained mortgage relief. New supply, wage growth, and regional migration trends are key to whether activity rebounds or stays subdued.",
    ],
    primarySeriesKey: "mort30",
  },
  "credit-spreads": {
    title: "Credit & Spreads",
    what: "This graph shows how much extra interest risky companies must pay versus safer borrowers.",
    unit:
      "The spread is shown in percentage points. Higher numbers mean lenders are more worried about default risk.",
    rangeTitle: "Lower spreads signal calm credit markets; high spreads signal stress.",
    rangeZones: [
      { label: "Crisis", color: "#ef4444", min: 8, max: 25 },
      { label: "Risky", color: "#ffffff", min: 5, max: 8 },
      { label: "Normal", color: "#22c55e", min: 3, max: 5 },
      { label: "Tight", color: "#ffffff", min: 2, max: 3 },
      { label: "Overconfident", color: "#ef4444", min: 0, max: 2 },
    ],
    currentSummaryTemplate:
      "Right now high-yield spreads are near {value}, showing moderate risk pricing rather than panic conditions.",
    highMeans: [
      "Lenders are worried and demand more compensation for risk.",
      "Risky companies face expensive financing.",
      "Economic slowdown concerns are usually rising.",
    ],
    lowMeans: [
      "Markets are confident and willing to take more risk.",
      "Borrowing gets easier for lower-rated firms.",
      "Very low spreads can signal too much risk-taking.",
    ],
    risingMeans: [
      "Risk appetite is falling.",
      "Default concerns are increasing.",
    ],
    fallingMeans: [
      "Credit conditions are easing.",
      "Markets expect steadier growth.",
    ],
    factors: [
      {
        name: "Default expectations",
        direction: "UP",
        explanation: "If investors expect more bankruptcies, spreads widen quickly.",
        speed: "Immediate",
      },
      {
        name: "Fed liquidity policy",
        direction: "DOWN",
        explanation: "Supportive policy can calm markets and compress spreads.",
        speed: "Weeks",
      },
      {
        name: "Earnings outlook",
        direction: "DOWN",
        explanation: "Stronger company profits reduce credit risk perception.",
        speed: "Months",
      },
      {
        name: "Global shocks",
        direction: "UP",
        explanation: "Geopolitical or financial shocks increase risk aversion.",
        speed: "Immediate",
      },
    ],
    players: [
      {
        name: "ICE BofA bond indices",
        type: "Index",
        role: "Benchmark spread indices set the market reference for risk pricing.",
        power: 4,
        example: "HY OAS surged above 20% during the 2008 crisis.",
      },
      {
        name: "Federal Reserve",
        type: "Central Bank",
        role: "Liquidity backstops can reduce systemic credit stress.",
        power: 5,
        example: "2020 emergency facilities helped compress panic-level spreads.",
      },
      {
        name: "Large bond funds",
        type: "Market",
        role: "Fund flows into and out of credit products shift spread levels.",
        power: 3,
        example: "Risk-off outflows in early 2020 widened high-yield spreads rapidly.",
      },
    ],
    timeline: [
      {
        year: "2008",
        event: "Lehman shock",
        move: "↑ HY OAS above 20%",
        explanation: "Credit markets priced in severe default risk.",
      },
      {
        year: "2011",
        event: "Euro stress",
        move: "↑ spreads widened",
        explanation: "Global sovereign concerns reduced risk appetite.",
      },
      {
        year: "2020",
        event: "Pandemic panic",
        move: "↑ HY OAS near 11%",
        explanation: "Sudden shutdown risk drove a sharp widening.",
      },
      {
        year: "2021",
        event: "Recovery compression",
        move: "↓ spreads tightened",
        explanation: "Growth rebound and policy support reduced credit fear.",
      },
      {
        year: "2022",
        event: "Rate shock repricing",
        move: "↑ spreads moved wider",
        explanation: "Tighter policy and slower growth raised financing risk.",
      },
    ],
    nowContext: [
      "Credit spreads have moved away from crisis levels but remain sensitive to growth and refinancing risk. Companies that borrowed cheaply in prior years now face higher rollover costs as older debt matures.",
      "In 2025-2026, investors are watching default rates, earnings durability, and policy direction. Spread widening is often one of the earliest signs that market confidence is weakening.",
    ],
    primarySeriesKey: "hy",
  },
  gold: {
    title: "Gold",
    what: "This graph shows the market price of gold, which many people use as a safety asset.",
    unit:
      "The numbers are US dollars per ounce. If gold is 2000, one troy ounce costs about $2,000.",
    rangeTitle: "Gold often rises when fear or inflation concerns rise.",
    rangeZones: [
      { label: "Depressed", color: "#ef4444", min: 700, max: 1200 },
      { label: "Soft", color: "#ffffff", min: 1200, max: 1600 },
      { label: "Balanced", color: "#22c55e", min: 1600, max: 2200 },
      { label: "Elevated", color: "#ffffff", min: 2200, max: 2600 },
      { label: "Stressed", color: "#ef4444", min: 2600, max: 3500 },
    ],
    currentSummaryTemplate:
      "Right now gold is around {value}, reflecting demand for diversification and protection against uncertainty.",
    highMeans: [
      "Investors may be seeking safety or inflation protection.",
      "Real yields may be low or expected to fall.",
      "Geopolitical risk may be elevated.",
    ],
    lowMeans: [
      "Risk appetite may be stronger in stocks or credit.",
      "Real yields may be attractive versus non-yielding gold.",
      "Inflation fears are often lower.",
    ],
    risingMeans: [
      "Demand for defensive assets is increasing.",
      "Market concern about policy or inflation is building.",
    ],
    fallingMeans: [
      "Risk-on sentiment is improving.",
      "Higher real rates are pressuring gold demand.",
    ],
    factors: [
      {
        name: "Real interest rates",
        direction: "DOWN",
        explanation: "Higher inflation-adjusted yields make gold less attractive.",
        speed: "Weeks",
      },
      {
        name: "US dollar strength",
        direction: "DOWN",
        explanation: "A stronger dollar can weigh on dollar-priced gold.",
        speed: "Immediate",
      },
      {
        name: "Central bank buying",
        direction: "UP",
        explanation: "Official reserve purchases can support long-term demand.",
        speed: "Months",
      },
      {
        name: "Geopolitical stress",
        direction: "UP",
        explanation: "Risk events often push investors toward safe assets.",
        speed: "Immediate",
      },
    ],
    players: [
      {
        name: "World Gold Council / central banks",
        type: "Market",
        role: "Tracks and influences official-sector demand trends.",
        power: 4,
        example: "Strong central-bank purchases in 2022-2024 supported the gold market.",
      },
      {
        name: "Federal Reserve",
        type: "Central Bank",
        role: "Rate path affects real yields and gold valuation.",
        power: 5,
        example: "Rate-hike expectations in 2022 increased pressure on precious metals.",
      },
      {
        name: "Large ETF providers",
        type: "Corporation",
        role: "Fund inflows and outflows shift investment demand quickly.",
        power: 3,
        example: "ETF outflows during tightening phases contributed to price volatility.",
      },
    ],
    timeline: [
      {
        year: "2008",
        event: "Crisis safe-haven",
        move: "↑ strong multi-year rally",
        explanation: "Financial stress increased demand for defensive assets.",
      },
      {
        year: "2011",
        event: "Post-crisis peak",
        move: "↑ near $1,900/oz",
        explanation: "Debt concerns and loose policy supported gold demand.",
      },
      {
        year: "2015",
        event: "Dollar/real-rate pressure",
        move: "↓ near $1,050/oz",
        explanation: "Stronger dollar and policy normalization weighed on prices.",
      },
      {
        year: "2020",
        event: "Pandemic uncertainty",
        move: "↑ above $2,000/oz",
        explanation: "Global risk and policy easing drove another strong surge.",
      },
      {
        year: "2024",
        event: "New highs phase",
        move: "↑ fresh record zone",
        explanation: "Central-bank demand and geopolitical risk supported prices.",
      },
    ],
    nowContext: [
      "Gold has stayed in focus as investors balance inflation uncertainty, geopolitical risk, and changing rate expectations. Its role as a portfolio hedge has remained important during periods of policy and market transition.",
      "For 2025-2026, analysts are watching real yields, central-bank reserve behavior, and dollar direction. Gold often reacts quickly when confidence in the growth outlook weakens.",
    ],
    primarySeriesKey: "gold",
  },
  "stock-market": {
    title: "Equity & Risk",
    what: "This graph shows stock performance and investor fear in the market.",
    unit:
      "The S&P 500 is an index level, and VIX is a fear gauge in points. Higher VIX means more expected volatility.",
    rangeTitle: "Steady markets usually have moderate VIX and trend-supportive equity prices.",
    rangeZones: [
      { label: "Panic", color: "#ef4444", min: 35, max: 90 },
      { label: "Risky", color: "#ffffff", min: 25, max: 35 },
      { label: "Normal", color: "#22c55e", min: 15, max: 25 },
      { label: "Calm", color: "#ffffff", min: 10, max: 15 },
      { label: "Complacent", color: "#ef4444", min: 0, max: 10 },
    ],
    currentSummaryTemplate:
      "Right now market risk gauges are around {value}, signaling a market that is active but not in crisis mode.",
    highMeans: [
      "Investors are paying more for downside protection.",
      "Markets expect larger daily price swings.",
      "Risk assets can become more fragile.",
    ],
    lowMeans: [
      "Investors are more comfortable holding risk.",
      "Price swings are usually smaller.",
      "Very low fear can precede sharp reversals if shocks hit.",
    ],
    risingMeans: [
      "Risk appetite is fading.",
      "Demand for hedges is increasing.",
    ],
    fallingMeans: [
      "Confidence is improving.",
      "Financial conditions often become easier.",
    ],
    factors: [
      {
        name: "Corporate earnings",
        direction: "UP/DOWN",
        explanation: "Better earnings support equity prices and calmer volatility.",
        speed: "Weeks",
      },
      {
        name: "Interest rate expectations",
        direction: "DOWN",
        explanation: "Higher expected rates usually pressure valuations.",
        speed: "Immediate",
      },
      {
        name: "Geopolitical shocks",
        direction: "UP",
        explanation: "Uncertainty can quickly raise fear and reduce risk-taking.",
        speed: "Immediate",
      },
      {
        name: "Liquidity conditions",
        direction: "UP/DOWN",
        explanation: "Easier liquidity supports risk assets; tighter liquidity does the opposite.",
        speed: "Months",
      },
    ],
    players: [
      {
        name: "S&P Dow Jones Indices",
        type: "Index",
        role: "Maintains the benchmark index used by global investors.",
        power: 4,
        example: "The S&P 500 drawdown in 2022 reflected broad repricing of growth and rates.",
      },
      {
        name: "CBOE (VIX)",
        type: "Index",
        role: "Publishes the implied-volatility benchmark for US equities.",
        power: 4,
        example: "VIX spiked above 80 during March 2020 market panic.",
      },
      {
        name: "Federal Reserve",
        type: "Central Bank",
        role: "Policy guidance changes discount rates and risk appetite.",
        power: 5,
        example: "Tightening guidance in 2022 triggered valuation compression across equities.",
      },
    ],
    timeline: [
      {
        year: "2008",
        event: "Financial crisis",
        move: "↑ VIX above 80, ↓ S&P ~38% annual",
        explanation: "System-wide credit stress caused a deep equity selloff.",
      },
      {
        year: "2020",
        event: "Pandemic crash",
        move: "↑ VIX above 80, ↓ S&P about 34% peak-to-trough",
        explanation: "Global shutdown risk caused a rapid risk-off move.",
      },
      {
        year: "2021",
        event: "Reopening rally",
        move: "↓ VIX, ↑ equities",
        explanation: "Stimulus and reopening supported a strong risk-on phase.",
      },
      {
        year: "2022",
        event: "Rate repricing bear market",
        move: "↑ volatility, ↓ S&P about 19% annual",
        explanation: "Higher discount rates and inflation worries hurt valuations.",
      },
      {
        year: "2023",
        event: "AI-led rebound",
        move: "↓ VIX, ↑ S&P strong gain",
        explanation: "Mega-cap earnings and technology optimism drove performance.",
      },
    ],
    nowContext: [
      "Equity markets have moved between optimism and caution as investors reprice growth, inflation, and policy signals. Volatility spikes still appear around major macro events, but broad stress has stayed below crisis extremes.",
      "Into 2025-2026, the main watch points are earnings quality, valuation sensitivity to rates, and concentration risk in large-cap sectors. VIX and credit spreads are key early warning indicators when sentiment shifts.",
    ],
    primarySeriesKey: "vix",
  },
  "trade-dollar": {
    title: "Trade & Dollar",
    what: "This graph shows how strong the US dollar is and how much the US buys versus sells in goods.",
    unit:
      "Dollar strength uses an index, and trade balance is in billions of US dollars. Negative balance means imports are larger than exports.",
    rangeTitle: "Balanced trade and a stable dollar usually reduce macro stress.",
    rangeZones: [
      { label: "Weak dollar", color: "#ef4444", min: 85, max: 100 },
      { label: "Soft", color: "#ffffff", min: 100, max: 110 },
      { label: "Balanced", color: "#22c55e", min: 110, max: 120 },
      { label: "Strong", color: "#ffffff", min: 120, max: 130 },
      { label: "Very strong", color: "#ef4444", min: 130, max: 150 },
    ],
    currentSummaryTemplate:
      "Right now the dollar index is about {value}, showing US currency demand that still influences trade and global financing.",
    highMeans: [
      "US imports can become cheaper in dollar terms.",
      "US exports can become less competitive abroad.",
      "Global borrowers in dollars can face tighter financial pressure.",
    ],
    lowMeans: [
      "US exports may become more competitive.",
      "Import prices can rise and add inflation pressure.",
      "Foreign earnings can translate into more dollars for multinationals.",
    ],
    risingMeans: [
      "Global demand for dollar assets is strengthening.",
      "Risk-off flows may be increasing.",
    ],
    fallingMeans: [
      "Global risk appetite may be improving.",
      "Trade competitiveness for US exporters can improve.",
    ],
    factors: [
      {
        name: "US interest-rate gap",
        direction: "UP",
        explanation: "Higher US yields versus peers attract capital to the dollar.",
        speed: "Immediate",
      },
      {
        name: "Global growth cycle",
        direction: "UP/DOWN",
        explanation: "Global slowdowns often support safe-haven dollar demand.",
        speed: "Months",
      },
      {
        name: "Energy and import prices",
        direction: "UP/DOWN",
        explanation: "Commodity swings change trade values and external balances.",
        speed: "Weeks",
      },
      {
        name: "Trade policy changes",
        direction: "UP/DOWN",
        explanation: "Tariffs and trade deals can shift import and export flows.",
        speed: "Months",
      },
    ],
    players: [
      {
        name: "US Treasury Department",
        type: "Government",
        role: "Leads currency-policy messaging and debt issuance conditions.",
        power: 4,
        example: "Treasury guidance in strong-dollar periods has influenced market expectations.",
      },
      {
        name: "Federal Reserve",
        type: "Central Bank",
        role: "Rate policy strongly affects dollar direction versus other currencies.",
        power: 5,
        example: "Aggressive hikes in 2022 helped drive a broad dollar surge.",
      },
      {
        name: "US Census / BEA trade releases",
        type: "Government",
        role: "Publishes goods-trade data used by markets and policymakers.",
        power: 3,
        example: "Monthly trade-deficit releases shaped recession and growth debates in 2022-2024.",
      },
    ],
    timeline: [
      {
        year: "2008",
        event: "Crisis dollar bid",
        move: "↑ dollar index rose",
        explanation: "Global risk-off flows moved into USD assets.",
      },
      {
        year: "2015",
        event: "Policy divergence",
        move: "↑ sharp dollar strengthening",
        explanation: "US policy path diverged from more accommodative peers.",
      },
      {
        year: "2020",
        event: "Pandemic swing",
        move: "↑ then ↓",
        explanation: "Initial risk panic lifted USD before later global reopening flows.",
      },
      {
        year: "2022",
        event: "Peak dollar phase",
        move: "↑ multi-decade highs",
        explanation: "Fast US tightening and global uncertainty supported the dollar.",
      },
      {
        year: "2024",
        event: "Partial normalization",
        move: "↓ from extremes",
        explanation: "Rate expectations and global conditions became less one-sided.",
      },
    ],
    nowContext: [
      "The dollar remains a central global pricing anchor, so moves in this indicator affect trade, inflation, and financial conditions at the same time. A strong dollar can cool import prices but pressure export competitiveness.",
      "For 2025-2026, analysts are tracking policy divergence between major central banks, trade-policy shifts, and global growth dispersion. This indicator helps explain why similar domestic data can produce different market reactions over time.",
    ],
    primarySeriesKey: "dxybroad",
  },
  "consumer-sentiment": {
    title: "Consumer Sentiment",
    what: "This graph shows how confident people feel about their finances and the economy.",
    unit:
      "The score is an index. Higher numbers mean households feel more optimistic about jobs, incomes, and spending.",
    rangeTitle: "Middle-to-high confidence usually supports steady spending.",
    rangeZones: [
      { label: "Very weak", color: "#ef4444", min: 45, max: 60 },
      { label: "Weak", color: "#ffffff", min: 60, max: 75 },
      { label: "Healthy", color: "#22c55e", min: 75, max: 90 },
      { label: "Strong", color: "#ffffff", min: 90, max: 105 },
      { label: "Overheated", color: "#ef4444", min: 105, max: 120 },
    ],
    currentSummaryTemplate:
      "Right now sentiment is near {value}, showing households are more stable than crisis periods but still sensitive to inflation and job news.",
    highMeans: [
      "Households are more willing to spend on big purchases.",
      "Retail and travel demand often improve.",
      "Recession fears usually fade in the short term.",
    ],
    lowMeans: [
      "Consumers delay major spending decisions.",
      "Confidence shocks can spread quickly into weaker demand.",
      "Savings behavior usually becomes more defensive.",
    ],
    risingMeans: [
      "People feel better about jobs and income stability.",
      "Consumption trends often strengthen with a lag.",
    ],
    fallingMeans: [
      "Households are becoming cautious.",
      "Spending growth can cool in coming months.",
    ],
    factors: [
      {
        name: "Inflation at checkout",
        direction: "DOWN",
        explanation: "Higher everyday prices reduce confidence quickly.",
        speed: "Immediate",
      },
      {
        name: "Job security",
        direction: "UP",
        explanation: "Strong employment makes households more willing to spend.",
        speed: "Weeks",
      },
      {
        name: "Gasoline prices",
        direction: "UP/DOWN",
        explanation: "Fuel price moves are visible and affect mood fast.",
        speed: "Immediate",
      },
      {
        name: "Stock and home prices",
        direction: "UP",
        explanation: "Rising asset values can improve perceived household wealth.",
        speed: "Months",
      },
    ],
    players: [
      {
        name: "University of Michigan Surveys",
        type: "Index",
        role: "Publishes the headline sentiment index used by economists.",
        power: 4,
        example: "The 2022 sentiment trough signaled severe household inflation stress.",
      },
      {
        name: "Federal Reserve",
        type: "Central Bank",
        role: "Policy path influences inflation and labor outcomes felt by households.",
        power: 4,
        example: "Rate hikes to control inflation were a major sentiment driver in 2022-2024.",
      },
      {
        name: "Large employers",
        type: "Corporation",
        role: "Hiring and wage decisions influence household confidence.",
        power: 3,
        example: "Broad layoff headlines in select sectors weighed on sentiment readings.",
      },
    ],
    timeline: [
      {
        year: "2008",
        event: "Financial crisis drop",
        move: "↓ sentiment plunged",
        explanation: "Job losses and wealth declines hurt household confidence.",
      },
      {
        year: "2011",
        event: "Debt-ceiling stress",
        move: "↓ near multi-decade lows",
        explanation: "Policy uncertainty and weak recovery hurt consumer outlook.",
      },
      {
        year: "2020",
        event: "Pandemic shock",
        move: "↓ sharp decline",
        explanation: "Health and employment uncertainty reduced confidence quickly.",
      },
      {
        year: "2022",
        event: "Inflation squeeze",
        move: "↓ near record lows",
        explanation: "High inflation cut real incomes and worsened expectations.",
      },
      {
        year: "2024",
        event: "Partial recovery",
        move: "↑ rebound from lows",
        explanation: "Cooling inflation and stable jobs improved household mood.",
      },
    ],
    nowContext: [
      "Consumer sentiment has recovered from its inflation-driven lows but remains below the strongest pre-pandemic readings. Households are still reacting to cost-of-living pressure even when headline inflation cools.",
      "In 2025-2026, economists are watching whether wage gains and lower inflation can sustain confidence. This indicator matters because confidence often leads actual spending trends by several months.",
    ],
    primarySeriesKey: "umich",
  },
};

import type { TopicDefinition } from "@/lib/fred/topics-config";

export type RangeBand = {
  label: string;
  min: number;
  max: number;
};

export type TopicFactorCard = {
  name: string;
  impact: "UP" | "DOWN" | "UP/DOWN";
  explanation: string;
  speed: "immediate" | "weeks" | "months" | "years";
};

export type PlayerCard = {
  name: string;
  type: "Central Bank" | "Government" | "Corporation" | "Index" | "Institution";
  role: string;
  power: 1 | 2 | 3 | 4 | 5;
  example: string;
};

export type TopicTimelineEvent = {
  year: string;
  event: string;
  move: string;
  explanation: string;
};

export type TopicIntelligence = {
  what: string;
  unit: string;
  rangeTitle: string;
  rangeBands: [RangeBand, RangeBand, RangeBand, RangeBand, RangeBand];
  currentSentence: (value: number | null) => string;
  high: string[];
  low: string[];
  rising: string[];
  falling: string[];
  factors: TopicFactorCard[];
  players: PlayerCard[];
  timeline: TopicTimelineEvent[];
  news: string[];
};

export const TOPIC_INTELLIGENCE: Record<string, TopicIntelligence> = {
  "interest-rates": {
    what:
      "This graph shows how expensive it is to borrow money in the US economy.",
    unit:
      "The numbers on the left are percentages (%). A higher percent means loans cost more.",
    rangeTitle: "Policy rate comfort zones",
    rangeBands: [
      { label: "Too low", min: 0, max: 1 },
      { label: "Low", min: 1, max: 2.5 },
      { label: "Balanced", min: 2.5, max: 4 },
      { label: "Tight", min: 4, max: 5.5 },
      { label: "Very tight", min: 5.5, max: 7 },
    ],
    currentSentence: (v) =>
      v == null
        ? "Latest reading is not available yet."
        : `Right now this is ${v.toFixed(2)}%, which shows how strict or loose borrowing conditions are today.`,
    high: [
      "Loans for homes, cars, and businesses get more expensive.",
      "Spending usually slows because monthly payments rise.",
      "Inflation pressure often cools after some time.",
    ],
    low: [
      "Loans become cheaper for families and businesses.",
      "Spending and hiring usually get a boost.",
      "If kept too low for too long, inflation can heat up.",
    ],
    rising: [
      "The central bank is trying to cool demand.",
      "Markets expect slower growth ahead.",
    ],
    falling: [
      "Policy makers are trying to support growth.",
      "Markets may expect inflation to ease.",
    ],
    factors: [
      {
        name: "Federal Reserve decisions",
        impact: "UP/DOWN",
        explanation:
          "When the Fed raises or cuts its policy rate, borrowing costs across the economy move with it.",
        speed: "immediate",
      },
      {
        name: "Inflation pressure",
        impact: "UP",
        explanation:
          "If prices keep rising too fast, the Fed usually keeps rates higher for longer.",
        speed: "months",
      },
      {
        name: "Jobs and wage growth",
        impact: "UP",
        explanation:
          "A very strong job market can keep demand hot and make rate cuts slower.",
        speed: "months",
      },
      {
        name: "Recession risk",
        impact: "DOWN",
        explanation:
          "When growth weakens sharply, the Fed often lowers rates to support the economy.",
        speed: "months",
      },
    ],
    players: [
      {
        name: "Federal Reserve (FOMC)",
        type: "Central Bank",
        role: "Sets the federal funds target range.",
        power: 5,
        example:
          "In 2022, the Fed raised rates rapidly from near zero to fight the inflation surge.",
      },
      {
        name: "Jerome Powell",
        type: "Institution",
        role: "Fed Chair whose guidance shifts market expectations.",
        power: 4,
        example:
          "Powell's 2024 press conferences signaled a slower pace of future cuts, moving bond yields.",
      },
      {
        name: "US Treasury Department",
        type: "Government",
        role: "Issues large amounts of debt that affect longer-term yields.",
        power: 3,
        example:
          "Heavy Treasury issuance in 2023 helped push long-term yields higher.",
      },
    ],
    timeline: [
      {
        year: "2001",
        event: "Dot-com slowdown",
        move: "↓ Fed funds toward 1%",
        explanation: "The Fed cut hard to support growth after the tech bust.",
      },
      {
        year: "2008",
        event: "Global financial crisis",
        move: "↓ near 0%",
        explanation: "Emergency cuts were used to stabilize banks and credit markets.",
      },
      {
        year: "2015",
        event: "Liftoff begins",
        move: "↑ from zero",
        explanation: "The Fed started a gradual hiking cycle after long recovery.",
      },
      {
        year: "2020",
        event: "COVID shock",
        move: "↓ back to near 0%",
        explanation: "Rates were slashed as activity collapsed during lockdowns.",
      },
      {
        year: "2022",
        event: "Inflation fight",
        move: "↑ to 5%+",
        explanation: "Fastest hiking pace in decades to cool price growth.",
      },
    ],
    news: [
      "After the rapid hikes in 2022 and 2023, US interest rates stayed high through much of 2024. The reason was simple: inflation cooled, but not enough for policy makers to feel fully comfortable.",
      "Through 2025, markets watched every Federal Reserve meeting for hints about when cuts would continue. Strong job data at times delayed the expected easing path. For 2026, the big question is whether the Fed can keep inflation near target without triggering a deeper slowdown.",
    ],
  },
  inflation: {
    what: "This graph shows how fast the prices of everyday goods and services are changing.",
    unit:
      "Most lines are in percentages (%). A 3% reading means prices are about 3% higher than a year ago.",
    rangeTitle: "Inflation guide",
    rangeBands: [
      { label: "Deflation risk", min: -2, max: 0 },
      { label: "Low", min: 0, max: 1.5 },
      { label: "Target-like", min: 1.5, max: 2.5 },
      { label: "Warm", min: 2.5, max: 4 },
      { label: "Hot", min: 4, max: 8 },
    ],
    currentSentence: (v) =>
      v == null
        ? "Latest reading is not available yet."
        : `The latest reading is ${v.toFixed(2)}%, which shows how quickly prices are rising right now.`,
    high: [
      "Household budgets get squeezed as essentials cost more.",
      "Central banks usually keep rates higher.",
      "Companies with weak pricing power can see profits pressured.",
    ],
    low: [
      "People keep more real buying power in each paycheck.",
      "Rate cuts become more possible over time.",
      "If too low, it can signal weak demand.",
    ],
    rising: [
      "Demand may be running ahead of supply.",
      "Policy makers may become more cautious about rate cuts.",
    ],
    falling: [
      "Price pressure is easing across the economy.",
      "Real incomes can improve as wage gains stretch further.",
    ],
    factors: [
      {
        name: "Energy prices",
        impact: "UP/DOWN",
        explanation: "Oil and gas swings quickly pass through to transport and utility costs.",
        speed: "weeks",
      },
      {
        name: "Wage growth",
        impact: "UP",
        explanation: "Faster wage gains can raise service prices when labor is scarce.",
        speed: "months",
      },
      {
        name: "Supply chain disruptions",
        impact: "UP",
        explanation: "Shipping or production bottlenecks make goods harder and costlier to source.",
        speed: "weeks",
      },
      {
        name: "Interest rate policy",
        impact: "DOWN",
        explanation: "Higher rates cool demand and usually reduce inflation over time.",
        speed: "months",
      },
    ],
    players: [
      {
        name: "Federal Reserve",
        type: "Central Bank",
        role: "Uses interest rates to cool or support demand.",
        power: 5,
        example:
          "Rate hikes from 2022 onward helped push inflation down from its peak.",
      },
      {
        name: "Bureau of Labor Statistics (BLS)",
        type: "Government",
        role: "Publishes CPI, the main inflation measure watched by markets.",
        power: 4,
        example: "Monthly CPI releases regularly moved stocks and bond yields in 2024-2025.",
      },
      {
        name: "OPEC+",
        type: "Institution",
        role: "Influences global oil supply and fuel prices.",
        power: 3,
        example: "Production cuts in past cycles supported higher energy prices.",
      },
    ],
    timeline: [
      {
        year: "2008",
        event: "Commodity spike and crash",
        move: "↑ then ↓ CPI",
        explanation: "Oil surged before the crisis, then collapsed as demand fell.",
      },
      {
        year: "2011",
        event: "Post-crisis rebound",
        move: "↑ near 3%",
        explanation: "Recovery and higher commodity prices lifted inflation.",
      },
      {
        year: "2020",
        event: "Pandemic demand shock",
        move: "↓ briefly",
        explanation: "Lockdowns crushed demand before reopening pressures hit.",
      },
      {
        year: "2021",
        event: "Supply bottlenecks",
        move: "↑ sharply",
        explanation: "Goods shortages and reopening demand drove broad price increases.",
      },
      {
        year: "2022",
        event: "40-year inflation peak",
        move: "↑ above 8%",
        explanation: "Energy, housing, and services all contributed to persistent pressure.",
      },
    ],
    news: [
      "Inflation cooled meaningfully from the 2022 highs, but progress became uneven through 2024 and 2025. Housing costs and core services stayed sticky longer than many expected, even as goods inflation normalized.",
      "In 2025 and early 2026, analysts focused on whether disinflation could continue without a sharp rise in unemployment. The next phase depends on wage growth, rent trends, and whether policy stays tight enough to anchor expectations.",
    ],
  },
  unemployment: {
    what: "This graph shows how many people are looking for work but cannot find a job.",
    unit: "The scale is a percentage of the labor force. Lower usually means a stronger job market.",
    rangeTitle: "Labor market zones",
    rangeBands: [
      { label: "Very tight", min: 2, max: 3 },
      { label: "Tight", min: 3, max: 4 },
      { label: "Healthy", min: 4, max: 5 },
      { label: "Softening", min: 5, max: 6.5 },
      { label: "Stress", min: 6.5, max: 10 },
    ],
    currentSentence: (v) =>
      v == null
        ? "Latest reading is not available yet."
        : `The current reading is ${v.toFixed(2)}%, which shows how easy or hard it is to find work right now.`,
    high: [
      "More families face income pressure.",
      "Spending often slows because fewer people have steady pay.",
      "Recession risk is usually higher.",
    ],
    low: [
      "Employers are hiring and workers have stronger bargaining power.",
      "Consumer spending is often more resilient.",
      "Wage pressure can build if labor gets too scarce.",
    ],
    rising: [
      "Hiring momentum is slowing.",
      "Businesses may be cutting costs or pausing expansion.",
    ],
    falling: [
      "Labor demand is improving.",
      "Economic confidence usually strengthens.",
    ],
    factors: [
      {
        name: "Business demand",
        impact: "DOWN",
        explanation: "When companies sell more, they hire more workers.",
        speed: "months",
      },
      {
        name: "Interest rate hikes",
        impact: "UP",
        explanation: "Higher borrowing costs can cool expansion and reduce hiring plans.",
        speed: "months",
      },
      {
        name: "Automation and technology",
        impact: "UP/DOWN",
        explanation: "Some jobs are replaced while new roles are created in other sectors.",
        speed: "years",
      },
      {
        name: "Government fiscal support",
        impact: "DOWN",
        explanation: "Public spending programs can preserve jobs during downturns.",
        speed: "months",
      },
    ],
    players: [
      {
        name: "US Businesses",
        type: "Corporation",
        role: "Make most hiring and firing decisions.",
        power: 5,
        example: "Large layoff rounds in tech and finance changed labor mood in 2023-2024.",
      },
      {
        name: "Federal Reserve",
        type: "Central Bank",
        role: "Influences hiring via interest-rate policy.",
        power: 4,
        example: "Tighter policy cooled job openings after the post-COVID boom.",
      },
      {
        name: "BLS",
        type: "Government",
        role: "Measures and reports official unemployment rates.",
        power: 3,
        example: "Monthly payroll and unemployment reports repeatedly reset market expectations.",
      },
    ],
    timeline: [
      {
        year: "2001",
        event: "Dot-com recession",
        move: "↑ unemployment",
        explanation: "Tech retrenchment pushed joblessness higher.",
      },
      {
        year: "2009",
        event: "Great Recession",
        move: "↑ near 10%",
        explanation: "Financial collapse caused broad layoffs across industries.",
      },
      {
        year: "2019",
        event: "Pre-COVID lows",
        move: "↓ near 3.5%",
        explanation: "Long expansion produced one of the tightest labor markets in decades.",
      },
      {
        year: "2020",
        event: "Pandemic shutdown",
        move: "↑ to 14.7%",
        explanation: "Sudden closures created an unprecedented spike in job losses.",
      },
      {
        year: "2021-2023",
        event: "Reopening recovery",
        move: "↓ quickly",
        explanation: "Rapid rehiring brought unemployment back down.",
      },
    ],
    news: [
      "Through 2024 and 2025, unemployment stayed relatively low even while growth moderated. That balance supported the idea of a possible soft landing, where inflation falls without a severe labor-market break.",
      "For 2026, economists are watching whether slower business investment starts to lift joblessness. The key signal is not just the level, but how quickly unemployment rises from cycle lows.",
    ],
  },
  "gdp-growth": {
    what: "This graph tracks whether the total US economy is growing or shrinking.",
    unit:
      "Growth lines are percentages, while level lines are inflation-adjusted dollar output in billions.",
    rangeTitle: "GDP growth zones",
    rangeBands: [
      { label: "Contraction", min: -4, max: 0 },
      { label: "Weak", min: 0, max: 1 },
      { label: "Healthy", min: 1, max: 3 },
      { label: "Hot", min: 3, max: 5 },
      { label: "Unsustainably hot", min: 5, max: 8 },
    ],
    currentSentence: (v) =>
      v == null
        ? "Latest reading is not available yet."
        : `The latest growth reading is ${v.toFixed(2)}%, which gives a quick snapshot of economic momentum.`,
    high: [
      "Businesses usually see stronger demand.",
      "Hiring and income growth can improve.",
      "If too high for too long, inflation pressure can build.",
    ],
    low: [
      "Growth is fragile and confidence can weaken.",
      "Hiring plans often slow.",
      "Recession risk rises if weakness persists.",
    ],
    rising: [
      "Demand is strengthening across consumers and businesses.",
      "Risk assets often respond positively at first.",
    ],
    falling: [
      "Momentum is cooling, often before broader weakness appears.",
      "Defensive assets may become more attractive.",
    ],
    factors: [
      {
        name: "Consumer spending",
        impact: "UP",
        explanation: "Household purchases are the largest part of GDP.",
        speed: "weeks",
      },
      {
        name: "Business investment",
        impact: "UP",
        explanation: "When firms spend on equipment and software, output usually rises.",
        speed: "months",
      },
      {
        name: "Interest rates",
        impact: "DOWN",
        explanation: "Higher rates make borrowing and expansion more expensive.",
        speed: "months",
      },
      {
        name: "Global demand",
        impact: "UP/DOWN",
        explanation: "Stronger export demand supports growth; weak global demand drags it down.",
        speed: "months",
      },
    ],
    players: [
      {
        name: "US Consumers",
        type: "Institution",
        role: "Drive most spending in the economy.",
        power: 5,
        example: "Stimulus-supported spending in 2021 helped produce strong GDP growth.",
      },
      {
        name: "Congress and White House",
        type: "Government",
        role: "Set fiscal policy that can accelerate or cool activity.",
        power: 4,
        example: "Large fiscal packages during COVID boosted demand and output recovery.",
      },
      {
        name: "Federal Reserve",
        type: "Central Bank",
        role: "Shapes financial conditions through rates and balance-sheet policy.",
        power: 4,
        example: "Rapid hikes in 2022-2023 slowed interest-sensitive sectors.",
      },
    ],
    timeline: [
      {
        year: "2008-2009",
        event: "Financial crisis",
        move: "↓ around -2.5%",
        explanation: "Credit stress and housing collapse pulled output lower.",
      },
      {
        year: "2020",
        event: "COVID shutdown",
        move: "↓ around -3.4%",
        explanation: "Lockdowns abruptly halted broad economic activity.",
      },
      {
        year: "2021",
        event: "Reopening rebound",
        move: "↑ around +5.7%",
        explanation: "Stimulus and reopening demand drove a fast recovery year.",
      },
      {
        year: "2022",
        event: "Inflation and tightening",
        move: "↓ from rebound pace",
        explanation: "Higher rates and inflation cooled growth momentum.",
      },
      {
        year: "2024",
        event: "Moderate expansion",
        move: "↔ mid-range growth",
        explanation: "Growth held up but with signs of slowing in cyclicals.",
      },
    ],
    news: [
      "In 2024 and 2025, US GDP growth remained positive but uneven. Consumer spending stayed a key support, while higher financing costs weighed on housing and some business investment categories.",
      "Looking into 2026, analysts are focused on whether growth settles into a stable moderate pace or slows further as tighter policy fully filters through. Productivity gains from new technology are a major upside variable.",
    ],
  },
  housing: {
    what: "This graph shows housing demand and financing conditions for buying homes.",
    unit:
      "Home-price lines are index values, and mortgage lines are percentages that show loan costs.",
    rangeTitle: "Mortgage rate zones",
    rangeBands: [
      { label: "Ultra low", min: 2, max: 3.5 },
      { label: "Low", min: 3.5, max: 5 },
      { label: "Balanced", min: 5, max: 6.5 },
      { label: "Tight", min: 6.5, max: 8 },
      { label: "Very tight", min: 8, max: 10 },
    ],
    currentSentence: (v) =>
      v == null
        ? "Latest reading is not available yet."
        : `The latest reading is ${v.toFixed(2)}, which helps show whether housing conditions are easing or tightening.`,
    high: [
      "If mortgage rates are high, affordability gets worse.",
      "Home sales usually cool when financing is expensive.",
      "Builders may slow new projects if demand softens.",
    ],
    low: [
      "Cheaper financing can bring in more buyers.",
      "Sales and refinancing activity usually improve.",
      "Home prices can rise faster if supply is tight.",
    ],
    rising: [
      "Affordability pressure is increasing.",
      "Housing activity often slows after a lag.",
    ],
    falling: [
      "Affordability can improve for new buyers.",
      "Market turnover often picks up over time.",
    ],
    factors: [
      {
        name: "Mortgage rates",
        impact: "DOWN",
        explanation: "Higher rates raise monthly payments and reduce buying power.",
        speed: "weeks",
      },
      {
        name: "Housing supply",
        impact: "UP/DOWN",
        explanation: "Low inventory supports prices; higher inventory cools price pressure.",
        speed: "months",
      },
      {
        name: "Income and jobs",
        impact: "UP",
        explanation: "Stronger incomes and job security support home demand.",
        speed: "months",
      },
      {
        name: "Construction costs",
        impact: "DOWN",
        explanation: "Higher material and labor costs can limit new housing supply.",
        speed: "months",
      },
    ],
    players: [
      {
        name: "Federal Reserve",
        type: "Central Bank",
        role: "Shapes borrowing conditions that influence mortgage rates.",
        power: 4,
        example: "Policy tightening in 2022 pushed mortgage rates to multi-year highs.",
      },
      {
        name: "Fannie Mae and Freddie Mac",
        type: "Institution",
        role: "Support mortgage market liquidity and standards.",
        power: 4,
        example: "Changes in underwriting and guarantee fees affect loan availability.",
      },
      {
        name: "Major mortgage lenders",
        type: "Corporation",
        role: "Set consumer loan pricing and approval terms.",
        power: 3,
        example: "Banks tightened lending standards as rates rose and uncertainty increased.",
      },
    ],
    timeline: [
      {
        year: "2006-2009",
        event: "Housing crash",
        move: "↓ prices in many regions",
        explanation: "Credit excess and defaults drove a deep correction.",
      },
      {
        year: "2012-2019",
        event: "Long recovery",
        move: "↑ gradual rise",
        explanation: "Low rates and improving jobs supported price recovery.",
      },
      {
        year: "2020-2021",
        event: "Pandemic boom",
        move: "↑ sharp gains",
        explanation: "Low rates and supply shortages pushed prices up quickly.",
      },
      {
        year: "2022",
        event: "Rate shock",
        move: "↑ mortgage rates",
        explanation: "Affordability dropped as financing costs surged.",
      },
      {
        year: "2024-2025",
        event: "High-rate adjustment",
        move: "↔ mixed activity",
        explanation: "Sales stayed subdued while limited supply supported prices.",
      },
    ],
    news: [
      "Housing in 2024 and 2025 was defined by a tug-of-war: high mortgage rates reduced affordability, but low inventory prevented a broad price collapse. Many owners stayed put because they were locked into older low-rate mortgages.",
      "In 2026, the focus is on whether financing costs ease enough to unlock more transactions. Analysts are also watching new construction and household formation to see if supply can catch up with demand.",
    ],
  },
  "credit-spreads": {
    what: "This graph shows how worried lenders are about companies paying back debt.",
    unit:
      "The values are percentage-point spreads. Bigger spreads mean investors demand more safety cushion.",
    rangeTitle: "Credit stress zones",
    rangeBands: [
      { label: "Calm", min: 2, max: 3.5 },
      { label: "Normal", min: 3.5, max: 5 },
      { label: "Watch", min: 5, max: 7 },
      { label: "Stressed", min: 7, max: 9 },
      { label: "Crisis", min: 9, max: 14 },
    ],
    currentSentence: (v) =>
      v == null
        ? "Latest reading is not available yet."
        : `Current spread is ${v.toFixed(2)} points, which reflects how much extra risk premium lenders want.`,
    high: [
      "Credit markets are nervous about defaults.",
      "Borrowing gets harder for weaker companies.",
      "Recession risk usually feels higher.",
    ],
    low: [
      "Risk appetite is stronger.",
      "Companies can borrow more easily.",
      "Financial conditions are generally supportive.",
    ],
    rising: [
      "Investors are becoming more defensive.",
      "Stress may be building before real-economy data weakens.",
    ],
    falling: [
      "Confidence is improving in credit markets.",
      "Default fears are easing.",
    ],
    factors: [
      {
        name: "Default expectations",
        impact: "UP",
        explanation: "If investors expect more defaults, they demand wider spreads.",
        speed: "weeks",
      },
      {
        name: "Federal Reserve policy",
        impact: "UP/DOWN",
        explanation: "Tighter policy can raise stress; easing can calm spreads.",
        speed: "months",
      },
      {
        name: "Economic growth",
        impact: "DOWN",
        explanation: "Stronger growth improves company cash flow and credit quality.",
        speed: "months",
      },
      {
        name: "Liquidity shocks",
        impact: "UP",
        explanation: "Sudden market fear can widen spreads quickly.",
        speed: "immediate",
      },
    ],
    players: [
      {
        name: "Federal Reserve",
        type: "Central Bank",
        role: "Influences overall credit conditions and market backstops.",
        power: 5,
        example: "In 2020, emergency credit facilities helped compress panic-level spreads.",
      },
      {
        name: "Major bond funds and insurers",
        type: "Institution",
        role: "Allocate large capital into IG and HY debt markets.",
        power: 4,
        example: "Large risk-off reallocations widened spreads during stress episodes.",
      },
      {
        name: "Rating agencies (S&P, Moody's, Fitch)",
        type: "Institution",
        role: "Downgrades or upgrades influence borrowing costs.",
        power: 3,
        example: "Downgrade waves in stressed sectors often push spreads wider.",
      },
    ],
    timeline: [
      {
        year: "2008",
        event: "Lehman crisis",
        move: "↑ spreads spiked",
        explanation: "System-wide fear drove extreme credit risk pricing.",
      },
      {
        year: "2011",
        event: "Euro debt stress",
        move: "↑ wider spreads",
        explanation: "Global sovereign concerns raised risk premiums.",
      },
      {
        year: "2016",
        event: "Energy credit scare",
        move: "↑ HY stress",
        explanation: "Oil collapse hurt energy issuers and widened high-yield spreads.",
      },
      {
        year: "2020",
        event: "COVID panic",
        move: "↑ then ↓ fast",
        explanation: "Spreads exploded then normalized after policy support.",
      },
      {
        year: "2022",
        event: "Inflation-rate shock",
        move: "↑ moderate widening",
        explanation: "Higher rates and growth fears lifted risk premiums.",
      },
    ],
    news: [
      "Credit spreads in 2024 and 2025 were tighter than many expected given high rates, largely because corporate balance sheets stayed resilient and default rates remained manageable.",
      "For 2026, investors are watching refinancing risk. Many companies will need to roll debt at higher costs, and that could widen spreads if earnings weaken.",
    ],
  },
  gold: {
    what: "This graph shows the dollar price of gold, a classic safety asset.",
    unit: "Prices are in US dollars per ounce. Higher values mean gold is becoming more expensive.",
    rangeTitle: "Gold price momentum zones",
    rangeBands: [
      { label: "Deep value", min: 900, max: 1300 },
      { label: "Value", min: 1300, max: 1700 },
      { label: "Balanced", min: 1700, max: 2100 },
      { label: "Strong", min: 2100, max: 2500 },
      { label: "Very strong", min: 2500, max: 3200 },
    ],
    currentSentence: (v) =>
      v == null
        ? "Latest reading is not available yet."
        : `Gold is currently around $${v.toFixed(0)} per ounce, reflecting demand for inflation and risk protection.`,
    high: [
      "Investors may be seeking safety from uncertainty.",
      "Inflation or currency concerns can be elevated.",
      "Real yields may be less attractive versus hard assets.",
    ],
    low: [
      "Risk appetite is often stronger.",
      "Real yields may be more attractive than non-yielding gold.",
      "Inflation fear is usually less intense.",
    ],
    rising: [
      "Demand for protection is increasing.",
      "Markets may expect policy easing or more uncertainty.",
    ],
    falling: [
      "Confidence in risk assets may be improving.",
      "Higher real yields can reduce gold appeal.",
    ],
    factors: [
      {
        name: "Real interest rates",
        impact: "DOWN",
        explanation: "When real yields rise, gold often becomes less attractive.",
        speed: "weeks",
      },
      {
        name: "US dollar strength",
        impact: "DOWN",
        explanation: "A stronger dollar can pressure dollar-priced commodities like gold.",
        speed: "weeks",
      },
      {
        name: "Geopolitical risk",
        impact: "UP",
        explanation: "Conflict and uncertainty increase demand for safe stores of value.",
        speed: "immediate",
      },
      {
        name: "Central bank buying",
        impact: "UP",
        explanation: "Large reserve purchases can support long-term gold demand.",
        speed: "months",
      },
    ],
    players: [
      {
        name: "Global central banks",
        type: "Central Bank",
        role: "Buy and hold gold reserves, affecting structural demand.",
        power: 4,
        example: "Reserve diversification by several central banks supported gold demand in recent years.",
      },
      {
        name: "Federal Reserve",
        type: "Central Bank",
        role: "Rate policy affects real yields, a key driver for gold.",
        power: 4,
        example: "Shifts in Fed cut expectations repeatedly moved gold in 2024-2025.",
      },
      {
        name: "Gold ETF managers",
        type: "Institution",
        role: "Channel large investor flows into and out of gold.",
        power: 3,
        example: "Large ETF inflows often accelerated upside moves during risk-off periods.",
      },
    ],
    timeline: [
      {
        year: "2008",
        event: "Crisis safe haven",
        move: "↑ strong rally",
        explanation: "Financial stress increased demand for defensive assets.",
      },
      {
        year: "2011",
        event: "Sovereign debt fears",
        move: "↑ record highs then",
        explanation: "Macro uncertainty and policy stress pushed gold higher.",
      },
      {
        year: "2013",
        event: "Taper shock",
        move: "↓ sharp drop",
        explanation: "Rising yields and stronger dollar pressured gold prices.",
      },
      {
        year: "2020",
        event: "Pandemic surge",
        move: "↑ major spike",
        explanation: "Uncertainty and low real rates boosted safe-haven demand.",
      },
      {
        year: "2024-2025",
        event: "Renewed breakout",
        move: "↑ to fresh highs",
        explanation: "Geopolitical risk and reserve demand supported prices.",
      },
    ],
    news: [
      "Gold remained in focus through 2024 and 2025 as investors balanced sticky inflation risks, geopolitical uncertainty, and changing rate expectations. Even with a strong dollar at times, demand stayed resilient.",
      "For 2026, markets are watching real yields and central-bank reserve behavior. If policy easing continues while global uncertainty stays elevated, gold could remain structurally supported.",
    ],
  },
  "stock-market": {
    what: "This graph tracks stock prices and investor fear in the market.",
    unit:
      "S&P 500 is an index level, and VIX is a fear gauge in points. Higher VIX means more market stress.",
    rangeTitle: "VIX risk zones",
    rangeBands: [
      { label: "Very calm", min: 10, max: 14 },
      { label: "Calm", min: 14, max: 20 },
      { label: "Normal", min: 20, max: 25 },
      { label: "Stressed", min: 25, max: 35 },
      { label: "Panic", min: 35, max: 60 },
    ],
    currentSentence: (v) =>
      v == null
        ? "Latest reading is not available yet."
        : `Current value is ${v.toFixed(2)}, showing where investor confidence and risk appetite sit now.`,
    high: [
      "If VIX is high, investors are nervous and volatility is elevated.",
      "If stock index is high, markets may be pricing strong earnings.",
      "Big highs can also mean crowded positioning and pullback risk.",
    ],
    low: [
      "Low VIX usually means calmer market conditions.",
      "Low stock levels can reflect weak earnings outlook.",
      "Very low fear can sometimes precede volatility spikes.",
    ],
    rising: [
      "Risk aversion is increasing.",
      "Markets may be repricing growth, rates, or policy risk.",
    ],
    falling: [
      "Investor confidence is improving.",
      "Volatility pressure is easing.",
    ],
    factors: [
      {
        name: "Corporate earnings",
        impact: "UP",
        explanation: "Stronger profits usually support higher stock valuations.",
        speed: "weeks",
      },
      {
        name: "Interest rates",
        impact: "DOWN",
        explanation: "Higher rates reduce the present value of future earnings.",
        speed: "weeks",
      },
      {
        name: "Economic growth signals",
        impact: "UP/DOWN",
        explanation: "Strong growth helps cyclicals; weak data raises recession fears.",
        speed: "weeks",
      },
      {
        name: "Geopolitical shocks",
        impact: "DOWN",
        explanation: "Unexpected shocks often trigger quick risk-off moves.",
        speed: "immediate",
      },
    ],
    players: [
      {
        name: "Federal Reserve",
        type: "Central Bank",
        role: "Policy signals influence valuation and risk appetite.",
        power: 5,
        example: "Rate path guidance repeatedly shifted equity leadership in 2024-2025.",
      },
      {
        name: "Mega-cap technology firms",
        type: "Corporation",
        role: "Large index weights can drive broad market direction.",
        power: 4,
        example: "AI-related earnings momentum from large tech firms lifted index performance.",
      },
      {
        name: "CBOE VIX Index",
        type: "Index",
        role: "Tracks expected near-term market volatility.",
        power: 3,
        example: "VIX spikes during stress events often coincide with rapid equity drawdowns.",
      },
    ],
    timeline: [
      {
        year: "2008",
        event: "Financial crisis",
        move: "↓ stocks, ↑ VIX > 80",
        explanation: "Systemic banking stress triggered extreme market fear.",
      },
      {
        year: "2011",
        event: "US downgrade / Euro stress",
        move: "↑ VIX spike",
        explanation: "Policy uncertainty and sovereign risk drove volatility higher.",
      },
      {
        year: "2020",
        event: "COVID crash",
        move: "↓ stocks fast, ↑ VIX near 80",
        explanation: "Global shutdown caused one of the sharpest drawdowns on record.",
      },
      {
        year: "2022",
        event: "Rate-shock bear market",
        move: "↓ major equity indexes",
        explanation: "High inflation and aggressive tightening compressed valuations.",
      },
      {
        year: "2023-2025",
        event: "AI-led rebound",
        move: "↑ broad gains with pauses",
        explanation: "Earnings resilience and AI optimism supported risk assets.",
      },
    ],
    news: [
      "Equities in 2024 and 2025 were shaped by a mix of slowing inflation, uneven growth, and strong performance in large technology names. Leadership concentration stayed high, making index moves sensitive to a few major companies.",
      "For 2026, investors are watching whether earnings growth broadens across sectors and whether valuation levels can hold if policy easing is slower than expected. Volatility around macro data is likely to remain important.",
    ],
  },
  "trade-dollar": {
    what: "This graph shows the strength of the US dollar and the country's trade gap.",
    unit:
      "Dollar lines are index values, while trade balance is in billions of US dollars per month.",
    rangeTitle: "Dollar strength zones",
    rangeBands: [
      { label: "Weak dollar", min: 90, max: 100 },
      { label: "Soft", min: 100, max: 110 },
      { label: "Balanced", min: 110, max: 120 },
      { label: "Strong", min: 120, max: 130 },
      { label: "Very strong", min: 130, max: 145 },
    ],
    currentSentence: (v) =>
      v == null
        ? "Latest reading is not available yet."
        : `Latest reading is ${v.toFixed(2)}, which helps explain import costs and global US competitiveness.`,
    high: [
      "A stronger dollar can make imports cheaper.",
      "US exports can become less competitive abroad.",
      "Global financial conditions can tighten for dollar borrowers.",
    ],
    low: [
      "US exports can become more competitive.",
      "Imported goods can become more expensive.",
      "Some global risk assets can get support from easier dollar conditions.",
    ],
    rising: [
      "US assets may be attracting global capital.",
      "Relative US growth or rates may be stronger than peers.",
    ],
    falling: [
      "Global risk appetite may be improving.",
      "Relative US rate advantage may be narrowing.",
    ],
    factors: [
      {
        name: "Interest-rate differentials",
        impact: "UP/DOWN",
        explanation: "Higher US rates versus peers usually support the dollar.",
        speed: "weeks",
      },
      {
        name: "Global growth trends",
        impact: "UP/DOWN",
        explanation: "Weak global growth can boost safe-haven dollar demand.",
        speed: "months",
      },
      {
        name: "US trade policy",
        impact: "UP/DOWN",
        explanation: "Tariffs and trade rules alter import-export dynamics.",
        speed: "months",
      },
      {
        name: "Energy and commodity prices",
        impact: "UP/DOWN",
        explanation: "Price swings change import bills and trade balances.",
        speed: "weeks",
      },
    ],
    players: [
      {
        name: "US Treasury",
        type: "Government",
        role: "Leads currency diplomacy and debt issuance policy.",
        power: 4,
        example: "Treasury funding shifts influence global dollar liquidity conditions.",
      },
      {
        name: "Federal Reserve",
        type: "Central Bank",
        role: "Rate policy changes the dollar's yield appeal.",
        power: 5,
        example: "Aggressive hikes in 2022 strengthened the dollar broadly.",
      },
      {
        name: "Major US importers/exporters",
        type: "Corporation",
        role: "Trade flows and hedging behavior influence currency demand.",
        power: 3,
        example: "Large corporate hedging flows can amplify dollar moves around shocks.",
      },
    ],
    timeline: [
      {
        year: "2008",
        event: "Crisis dollar surge",
        move: "↑ strong move",
        explanation: "Safe-haven demand lifted the dollar during global stress.",
      },
      {
        year: "2014-2016",
        event: "Fed divergence cycle",
        move: "↑ broad dollar rally",
        explanation: "US policy tightened while other regions stayed looser.",
      },
      {
        year: "2020",
        event: "Pandemic swing",
        move: "↑ then ↓",
        explanation: "Initial panic strengthened dollar before stimulus changed flows.",
      },
      {
        year: "2022",
        event: "Inflation and hikes",
        move: "↑ multi-year highs",
        explanation: "Higher US rates supported dollar strength.",
      },
      {
        year: "2024-2025",
        event: "Range trading",
        move: "↔ uneven",
        explanation: "Mixed growth and policy expectations kept moves choppy.",
      },
    ],
    news: [
      "In 2024 and 2025, the dollar remained sensitive to relative rate expectations between the US and other major economies. Trade balances also reflected shifting energy prices and global demand patterns.",
      "For 2026, analysts are watching whether policy divergence narrows and whether global growth broadens. Those two forces could determine whether the dollar trend stays strong or softens.",
    ],
  },
  "consumer-sentiment": {
    what: "This graph shows how confident people feel about jobs, prices, and their finances.",
    unit:
      "This is an index score. Higher means people feel better about the economy and their money situation.",
    rangeTitle: "Sentiment confidence zones",
    rangeBands: [
      { label: "Very weak", min: 45, max: 60 },
      { label: "Weak", min: 60, max: 75 },
      { label: "Neutral", min: 75, max: 90 },
      { label: "Strong", min: 90, max: 105 },
      { label: "Very strong", min: 105, max: 120 },
    ],
    currentSentence: (v) =>
      v == null
        ? "Latest reading is not available yet."
        : `Current sentiment is ${v.toFixed(2)}, which helps explain future household spending behavior.`,
    high: [
      "People are more willing to spend on big purchases.",
      "Retail and travel demand can improve.",
      "Recession fears are usually lower.",
    ],
    low: [
      "Families become more cautious with spending.",
      "Savings preference can rise over discretionary purchases.",
      "Business demand outlook can weaken.",
    ],
    rising: [
      "Households may expect better income or job prospects.",
      "Consumption growth can get support.",
    ],
    falling: [
      "Inflation or job worries may be increasing.",
      "Consumer spending could slow in coming months.",
    ],
    factors: [
      {
        name: "Inflation and living costs",
        impact: "DOWN",
        explanation: "Rising prices reduce purchasing power and confidence.",
        speed: "weeks",
      },
      {
        name: "Job market strength",
        impact: "UP",
        explanation: "Stable employment supports household confidence.",
        speed: "months",
      },
      {
        name: "Stock and home prices",
        impact: "UP/DOWN",
        explanation: "Rising household wealth often improves confidence.",
        speed: "months",
      },
      {
        name: "News and policy uncertainty",
        impact: "DOWN",
        explanation: "High uncertainty can lower confidence even before hard data shifts.",
        speed: "immediate",
      },
    ],
    players: [
      {
        name: "University of Michigan Surveys",
        type: "Institution",
        role: "Publishes widely watched sentiment data.",
        power: 4,
        example: "Large monthly sentiment swings shifted recession narratives in 2022-2025.",
      },
      {
        name: "US Households",
        type: "Institution",
        role: "Their expectations drive the sentiment index directly.",
        power: 5,
        example: "Improving inflation readings helped lift consumer mood from 2023 lows.",
      },
      {
        name: "Federal Reserve",
        type: "Central Bank",
        role: "Policy path affects inflation and labor expectations.",
        power: 3,
        example: "Rate guidance altered household expectations about future borrowing costs.",
      },
    ],
    timeline: [
      {
        year: "2008-2009",
        event: "Financial crisis shock",
        move: "↓ deep drop",
        explanation: "Job losses and wealth destruction hit confidence hard.",
      },
      {
        year: "2011",
        event: "Debt and downgrade worries",
        move: "↓ sharp dip",
        explanation: "Policy and market stress weighed on consumer outlook.",
      },
      {
        year: "2020",
        event: "Pandemic collapse",
        move: "↓ sudden drop",
        explanation: "Health and job uncertainty reduced household confidence quickly.",
      },
      {
        year: "2022",
        event: "Inflation squeeze",
        move: "↓ multi-decade weak area",
        explanation: "High prices hurt real incomes and spending confidence.",
      },
      {
        year: "2024-2025",
        event: "Partial recovery",
        move: "↑ gradual",
        explanation: "Cooling inflation improved mood, though not back to pre-shock highs.",
      },
    ],
    news: [
      "Consumer sentiment improved from the lows seen during the inflation spike, but readings through 2024 and 2025 still reflected caution about affordability and housing costs. Confidence moved sharply around inflation prints and labor-market headlines.",
      "In 2026, economists are watching whether confidence translates into stronger discretionary spending or remains fragile. The biggest drivers are real wage growth, job stability, and inflation expectations.",
    ],
  },
};

export function getTopicIntelligence(topic: TopicDefinition): TopicIntelligence {
  return TOPIC_INTELLIGENCE[topic.slug] ?? TOPIC_INTELLIGENCE["interest-rates"];
}
