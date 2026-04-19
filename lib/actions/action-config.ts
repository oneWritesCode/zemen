type Region = "India" | "US" | "Global";
type Urgency = "low" | "medium" | "high";

export type ActionPlatform = {
  name: string;
  description: string;
  bestFor: string;
  feature: string;
  url: string;
  color: string;
  icon: string;
  /** Key into TICKER_TO_DOMAIN for logo resolution */
  ticker?: string;
  region: Region;
  category: string;
};

export type ActionGuide = {
  condition: string;
  title: string;
  body: string;
  urgency: Urgency;
};

export type ActionPanelConfig = {
  indicator: string;
  title: string;
  guides: ActionGuide[];
  platforms: ActionPlatform[];
  showCalculator?: boolean;
  showBeginnerGuide?: boolean;
  showSkills?: boolean;
  showGoldWays?: boolean;
};

type Context = {
  currentRegime: string;
  trend?: "rising" | "falling" | "stable";
  value?: number | null;
};

const STOCK_PLATFORMS: ActionPlatform[] = [
  { name: "Zerodha", ticker: "ZERODHA", description: "India's largest stock broker", bestFor: "Indian investors, active traders", feature: "Zero brokerage on equity delivery", url: "https://zerodha.com", color: "#387ED1", icon: "Z", region: "India", category: "Stocks" },
  { name: "Groww", ticker: "GROWW", description: "Simple investing for beginners", bestFor: "First time investors in India", feature: "Buy stocks and mutual funds in minutes", url: "https://groww.in", color: "#00D09C", icon: "G", region: "India", category: "Stocks" },
  { name: "Upstox", ticker: "UPSTOX", description: "Fast and low cost trading", bestFor: "Active traders in India", feature: "Advanced charts and instant execution", url: "https://upstox.com", color: "#6C3CE1", icon: "U", region: "India", category: "Stocks" },
  { name: "Angel One", ticker: "ANGELONE", description: "Full service broker with research", bestFor: "Investors who want guidance", feature: "AI powered stock recommendations", url: "https://angelone.in", color: "#F7842A", icon: "A", region: "India", category: "Stocks" },
  { name: "INDmoney", ticker: "INDMONEY", description: "Invest in US stocks from India", bestFor: "Indians wanting global exposure", feature: "Buy Apple, Tesla, Google from India", url: "https://indmoney.com", color: "#1A56DB", icon: "I", region: "India", category: "Stocks" },
  { name: "Robinhood", ticker: "ROBINHOOD", description: "Commission free US stock trading", bestFor: "US based investors", feature: "No commission on all trades", url: "https://robinhood.com", color: "#00C805", icon: "R", region: "US", category: "Stocks" },
  { name: "eToro", ticker: "ETORO", description: "Social trading and investing", bestFor: "Beginners who want to follow experts", feature: "Copy successful traders automatically", url: "https://etoro.com", color: "#00C176", icon: "E", region: "Global", category: "Stocks" },
];

const JOB_PLATFORMS: ActionPlatform[] = [
  { name: "LinkedIn Jobs", ticker: "LINKEDIN", description: "World's largest professional job network", bestFor: "Professional and corporate roles", feature: "Apply with one click using your profile", url: "https://linkedin.com/jobs", color: "#0A66C2", icon: "in", region: "Global", category: "Jobs" },
  { name: "Naukri.com", ticker: "NAUKRI", description: "India's #1 job portal", bestFor: "All job levels in India", feature: "10 million+ active job listings", url: "https://naukri.com", color: "#E53935", icon: "N", region: "India", category: "Jobs" },
  { name: "Indeed", ticker: "INDEED", description: "Search millions of jobs worldwide", bestFor: "All industries, global reach", feature: "Salary comparison and company reviews", url: "https://indeed.com", color: "#2557A7", icon: "I", region: "Global", category: "Jobs" },
  { name: "Internshala", ticker: "INTERNSHALA", description: "Internships and fresher jobs", bestFor: "Students and fresh graduates", feature: "Training programs with job guarantee", url: "https://internshala.com", color: "#16A34A", icon: "I", region: "India", category: "Jobs" },
  { name: "Wellfound", ticker: "WELLFOUND", description: "Jobs at startups and tech companies", bestFor: "Tech professionals and startup seekers", feature: "See salary and equity upfront", url: "https://wellfound.com", color: "#111827", icon: "A", region: "Global", category: "Jobs" },
  { name: "Upwork", ticker: "UPWORK", description: "Find freelance work online", bestFor: "Anyone with a digital skill", feature: "Work from anywhere, set your own rates", url: "https://upwork.com", color: "#14A800", icon: "U", region: "Global", category: "Jobs" },
];

const GOLD_PLATFORMS: ActionPlatform[] = [
  { name: "Zerodha Gold", ticker: "ZERODHA_GOLD", description: "Buy 24K pure gold, stored in secure vault", bestFor: "Beginners in digital gold", feature: "Start small, sell anytime", url: "https://zerodha.com/gold", color: "#387ED1", icon: "Z", region: "India", category: "Gold" },
  { name: "PhonePe Gold", ticker: "PHONEPE", description: "Buy gold directly from PhonePe app", bestFor: "Mobile-first users", feature: "Simple digital checkout flow", url: "https://phonepe.com/gold", color: "#5F259F", icon: "P", region: "India", category: "Gold" },
  { name: "Paytm Gold", ticker: "PAYTM", description: "Start from ₹1, sell anytime instantly", bestFor: "Small periodic purchases", feature: "Micro-saving friendly", url: "https://paytm.com/gold", color: "#00BAF2", icon: "P", region: "India", category: "Gold" },
  { name: "RBI Retail Direct", ticker: "RBIDIRECT", description: "Buy Sovereign Gold Bonds directly", bestFor: "Long-term SGB investors", feature: "2.5% annual interest + gold exposure", url: "https://rbiretaildirect.org.in", color: "#1D4ED8", icon: "R", region: "India", category: "Gold" },
  { name: "MMTC-PAMP", ticker: "MMTCPAMP", description: "Certified 24K physical gold", bestFor: "Physical gold buyers", feature: "Trusted purity and packaging", url: "https://mmtcpamp.com", color: "#F59E0B", icon: "M", region: "India", category: "Gold" },
];

const INFLATION_PLATFORMS: ActionPlatform[] = [
  { name: "BankBazaar FD", ticker: "BANKBAZAAR", description: "Compare highest FD rates across banks", bestFor: "Safer yield seekers", feature: "Fast bank-to-bank rate comparison", url: "https://bankbazaar.com/fixed-deposit.html", color: "#2563EB", icon: "B", region: "India", category: "Inflation" },
  { name: "Groww", ticker: "GROWW", description: "Explore liquid funds and inflation-aware options", bestFor: "Retail investors", feature: "Simple app experience", url: "https://groww.in", color: "#00D09C", icon: "G", region: "India", category: "Inflation" },
  { name: "TreasuryDirect", ticker: "TREASURYDIRECT", description: "US inflation-protected bond access", bestFor: "US savers", feature: "Buy I-Bonds directly", url: "https://treasurydirect.gov", color: "#1E40AF", icon: "T", region: "US", category: "Inflation" },
  { name: "CRED", ticker: "CRED", description: "Card payments with rewards and score tools", bestFor: "Credit-active users", feature: "Rewards + spend tracking", url: "https://cred.club", color: "#111827", icon: "C", region: "India", category: "Inflation" },
  { name: "CashKaro", ticker: "CASHKARO", description: "Cashback deals for everyday purchases", bestFor: "Price-conscious buyers", feature: "Cashback reduces inflation impact", url: "https://cashkaro.com", color: "#F97316", icon: "K", region: "India", category: "Inflation" },
];

const RATES_PLATFORMS: ActionPlatform[] = [
  { name: "BankBazaar", ticker: "BANKBAZAAR", description: "Compare FD rates, loans, and credit cards", bestFor: "Rate shoppers", feature: "Multi-bank comparison in one place", url: "https://bankbazaar.com", color: "#2563EB", icon: "B", region: "India", category: "Rates" },
  { name: "PaisaBazaar", ticker: "PAISABAZAAR", description: "Personal and home loan comparisons", bestFor: "Borrowers refinancing debt", feature: "Loan + score discovery tools", url: "https://paisabazaar.com", color: "#7C3AED", icon: "P", region: "India", category: "Rates" },
  { name: "CRED", ticker: "CRED", description: "Credit card management + score visibility", bestFor: "Card users", feature: "Track debt and score progress", url: "https://cred.club", color: "#111827", icon: "C", region: "India", category: "Rates" },
];

const HOUSING_PLATFORMS: ActionPlatform[] = [
  { name: "MagicBricks", ticker: "MAGICBRICKS", description: "India's trusted property portal", bestFor: "Primary buyers in India", feature: "Large listing inventory", url: "https://magicbricks.com", color: "#E11D48", icon: "M", region: "India", category: "Housing" },
  { name: "99acres", ticker: "ACRES99", description: "Buy, rent, or sell property across India", bestFor: "All buyer/renter types", feature: "Strong filtering and locality data", url: "https://99acres.com", color: "#1D4ED8", icon: "9", region: "India", category: "Housing" },
  { name: "Housing.com", ticker: "HOUSING", description: "Smart search for homes in India", bestFor: "Urban home seekers", feature: "Map-first discovery experience", url: "https://housing.com", color: "#0EA5E9", icon: "H", region: "India", category: "Housing" },
  { name: "NoBroker", ticker: "NOBROKER", description: "Zero brokerage property search", bestFor: "Cost-sensitive users", feature: "Avoid brokerage charges", url: "https://nobroker.in", color: "#16A34A", icon: "N", region: "India", category: "Housing" },
  { name: "Zillow", ticker: "ZILLOW", description: "US home search and price estimates", bestFor: "US housing market users", feature: "Detailed local price comps", url: "https://zillow.com", color: "#1D4ED8", icon: "Z", region: "US", category: "Housing" },
];

export function getActionPanelConfig(
  topicSlug: string,
  ctx: Context,
): ActionPanelConfig | null {
  const regime = ctx.currentRegime.toLowerCase();

  if (topicSlug === "stock-market") {
    const body =
      regime.includes("goldilocks")
        ? "Markets tend to perform well in this environment. Historically this is when steady, diversified investing pays off. Consider staying invested or gradually adding to index funds."
        : regime.includes("stagflation")
          ? "Stocks generally struggle here. Defensive sectors like healthcare and utilities tend to hold value better than growth stocks. This may not be the best time to take large new positions."
          : regime.includes("recession")
            ? "Market volatility is high. Dollar cost averaging — investing fixed amounts regularly — historically outperforms trying to time the bottom."
            : regime.includes("recovery")
              ? "Early recovery periods have historically been the best time to invest. Cyclical stocks and small caps tend to lead gains."
              : "Markets may be near a peak. This is historically a good time to rebalance — take some profits from big winners and diversify.";
    return {
      indicator: "Stocks",
      title: "What should you do with stocks right now?",
      guides: [{ condition: ctx.currentRegime, title: "Action guide", body, urgency: "medium" }],
      platforms: STOCK_PLATFORMS,
      showBeginnerGuide: true,
    };
  }

  if (topicSlug === "unemployment") {
    const trendBody =
      ctx.trend === "rising"
        ? "Job markets are getting more competitive. Now is a good time to update your resume, expand your skills, and build your network before you need to — not after."
        : ctx.trend === "falling"
          ? "This is an employer's market — companies are competing for workers. Good time to negotiate salary or explore new opportunities."
          : "Job market is relatively stable. Career changers can build options while conditions are steady.";
    return {
      indicator: "Unemployment",
      title: "What can you do if unemployment is rising?",
      guides: [{ condition: ctx.trend ?? "stable", title: "Action guide", body: trendBody, urgency: ctx.trend === "rising" ? "high" : "low" }],
      platforms: JOB_PLATFORMS,
      showSkills: true,
    };
  }

  if (topicSlug === "gold") {
    const body =
      regime.includes("stagflation") || regime.includes("recession")
        ? "Gold has historically been one of the best assets to hold during stagflation and recession. It tends to hold value when stocks fall and currencies weaken. Many experts suggest keeping 5-10% of a portfolio in gold as a hedge."
        : regime.includes("overheating")
          ? "High inflation is historically gold's best friend. When purchasing power falls, gold often rises. This may be a favorable environment for a measured gold position."
          : "Gold can still serve as a small insurance position, but large allocations may underperform during strong growth periods.";
    return {
      indicator: "Gold",
      title: "Should you buy gold right now?",
      guides: [{ condition: ctx.currentRegime, title: "Action guide", body, urgency: "medium" }],
      platforms: GOLD_PLATFORMS,
      showCalculator: true,
      showGoldWays: true,
    };
  }

  if (topicSlug === "inflation") {
    return {
      indicator: "Inflation",
      title: "How to protect yourself from inflation",
      guides: [
        {
          condition: "inflation",
          title: "Action guide",
          body: "If inflation stays above your savings yield, your cash loses purchasing power. Focus on better cash rates, inflation-resistant assets, and disciplined spending tactics.",
          urgency: "high",
        },
      ],
      platforms: INFLATION_PLATFORMS,
    };
  }

  if (topicSlug === "interest-rates") {
    const high = (ctx.value ?? 0) >= 5;
    const falling = ctx.trend === "falling";
    const body = high
      ? "Rates are elevated. Lock in higher fixed deposit yields if they fit your horizon, and compare refinancing options for expensive debt."
      : falling
        ? "Rates are falling. Good time to compare cheaper loan options and lock favorable terms before further moves."
        : "Rates are in transition. Compare both borrowing and savings products before making changes.";
    return {
      indicator: "Interest Rates",
      title: "What rising or falling rates mean for your money",
      guides: [{ condition: "rates", title: "Action guide", body, urgency: high ? "medium" : "low" }],
      platforms: RATES_PLATFORMS,
    };
  }

  if (topicSlug === "housing") {
    const highRate = (ctx.value ?? 0) >= 7;
    const falling = ctx.trend === "falling";
    const body = highRate && !falling
      ? "Buyer's market may be approaching. High rates reduce competition. Watch for 2-3 months of price stability before committing."
      : !highRate && !falling
        ? "Seller's market risk is higher when rates are low and demand is strong. Move quickly if financing terms are favorable."
        : "Housing conditions are shifting. Compare EMI scenarios and avoid stretching affordability.";
    return {
      indicator: "Housing",
      title: "How to think about housing right now",
      guides: [{ condition: "housing", title: "Action guide", body, urgency: "medium" }],
      platforms: HOUSING_PLATFORMS,
      showCalculator: true,
    };
  }

  return null;
}

