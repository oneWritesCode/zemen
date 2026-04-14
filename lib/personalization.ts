export type Persona = "investor" | "business-owner" | "student" | "curious";

export const PERSONA_STORAGE_KEY = "zemen-persona";

export const PERSONA_OPTIONS: { id: Persona; title: string; description: string }[] = [
  { id: "investor", title: "Investor", description: "I want to know what to do with my money" },
  { id: "business-owner", title: "Business Owner", description: "I make decisions about hiring and spending" },
  { id: "student", title: "Student", description: "I am learning about economics" },
  { id: "curious", title: "Curious", description: "I just want to understand what is happening" },
];

const COPY: Record<string, Record<Persona, string>> = {
  "interest-rates": {
    investor:
      "For investors: Rising rates often pressure high-growth stocks but can improve yields on cash and short-term bonds.",
    "business-owner":
      "For business owners: Rising rates can make business loans and refinancing more expensive over the next few months.",
    student:
      "For students: Interest rates are the economy's speed control - higher rates cool spending, lower rates support growth.",
    curious:
      "For curious minds: Higher rates mean borrowing costs more, so people and companies usually spend more carefully.",
  },
  inflation: {
    investor: "For investors: Sticky inflation can delay rate cuts and change which sectors lead the market.",
    "business-owner":
      "For business owners: Higher inflation can raise wage and input costs, so pricing and margins need close attention.",
    student: "For students: Inflation shows how fast prices rise and how much your money's buying power changes.",
    curious: "For curious minds: When inflation is high, everyday essentials get expensive faster than usual.",
  },
  unemployment: {
    investor: "For investors: Rising unemployment can signal slower earnings growth and higher recession risk.",
    "business-owner":
      "For business owners: A softer job market can ease hiring pressure, but often comes with weaker customer demand.",
    student: "For students: Unemployment tells us how many people want jobs but still cannot find one.",
    curious: "For curious minds: If unemployment rises quickly, the economy is usually losing momentum.",
  },
  "gdp-growth": {
    investor: "For investors: Slowing GDP growth can pressure cyclical stocks and increase demand for defensive assets.",
    "business-owner": "For business owners: GDP growth reflects overall demand, which helps plan hiring and expansion timing.",
    student: "For students: GDP growth is the economy's report card for total output over time.",
    curious: "For curious minds: Strong GDP usually means businesses are producing and selling more.",
  },
  housing: {
    investor: "For investors: Housing is rate-sensitive; mortgage moves can ripple into banks, builders, and consumer stocks.",
    "business-owner": "For business owners: Housing trends can signal local demand strength and household confidence.",
    student: "For students: Housing links rates, jobs, wealth, and construction in one sector.",
    curious: "For curious minds: When mortgages are expensive, fewer people can afford to buy homes.",
  },
  "credit-spreads": {
    investor: "For investors: Wider spreads usually mean markets are pricing more default risk and less confidence.",
    "business-owner": "For business owners: Wider spreads can make borrowing harder, especially for smaller or riskier firms.",
    student: "For students: Credit spreads show how worried lenders are about companies paying back debt.",
    curious: "For curious minds: If spreads jump, markets are saying risk is rising in the economy.",
  },
  gold: {
    investor: "For investors: Gold often benefits when real rates fall or when macro uncertainty increases.",
    "business-owner": "For business owners: Gold is a market fear gauge and can hint at inflation or policy uncertainty.",
    student: "For students: Gold is often used as a safety asset when people worry about inflation or instability.",
    curious: "For curious minds: Gold prices often rise when people want protection from uncertainty.",
  },
  "stock-market": {
    investor: "For investors: Equity and volatility data help you see whether risk appetite is rising or fading.",
    "business-owner": "For business owners: Market stress can tighten financing conditions for growth plans.",
    student: "For students: Stocks and volatility show how confident investors are about the future.",
    curious: "For curious minds: If volatility rises, investors are getting more nervous about what comes next.",
  },
  "trade-dollar": {
    investor: "For investors: Dollar strength can shift global earnings, commodity prices, and emerging-market risk.",
    "business-owner": "For business owners: A stronger dollar can reduce import costs but can hurt export competitiveness.",
    student: "For students: Trade and the dollar show how the US connects to the global economy.",
    curious: "For curious minds: The dollar affects prices, trade flows, and what US goods cost abroad.",
  },
  "consumer-sentiment": {
    investor: "For investors: Sentiment often leads spending trends and can signal turns in demand-sensitive sectors.",
    "business-owner": "For business owners: Consumer confidence is an early clue for demand in coming months.",
    student: "For students: Sentiment measures how confident people feel about money, jobs, and the economy.",
    curious: "For curious minds: When confidence falls, people often delay big purchases.",
  },
};

export function getPersonaTopicCopy(topicSlug: string, persona: Persona): string {
  return COPY[topicSlug]?.[persona] ?? "This indicator helps explain where the economy is heading and what to watch next.";
}

