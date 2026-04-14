import { PresentationShell } from "@/components/site/presentation-shell";
import { 
  Percent, 
  Flame, 
  UserMinus, 
  Factory, 
  Home as HomeIcon, 
  CreditCard, 
  Banknote, 
  Globe, 
  Smile, 
  LineChart 
} from "lucide-react";

type Indicator = {
  name: string;
  icon: React.ReactNode;
  what: string;
  why: string;
  up: string;
  down: string;
  watchers: string;
  color: "green" | "red" | "yellow";
};

const colorClasses: Record<Indicator["color"], string> = {
  green: "border-[#22c55e]/45 bg-[#22c55e]/10",
  red: "border-[#ef4444]/45 bg-[#ef4444]/10",
  yellow: "border-[#FFD000]/45 bg-[#FFD000]/10",
};

const indicators: Indicator[] = [
  {
    name: "Interest Rates",
    icon: <Percent className="h-6 w-6 text-[#FFD000]" />,
    what: "The price of borrowing money.",
    why: "It changes how cheap or expensive loans are for homes, cars, and businesses.",
    up: "Borrowing gets harder, so spending can slow down.",
    down: "Borrowing gets easier, so spending and investing can speed up.",
    watchers: "Banks, businesses, and investors",
    color: "yellow",
  },
  {
    name: "Inflation",
    icon: <Flame className="h-6 w-6 text-[#ef4444]" />,
    what: "How fast prices are rising.",
    why: "If prices rise too fast, your money buys less each month.",
    up: "Families feel pressure, and central banks may raise rates.",
    down: "Prices cool down and people keep more buying power.",
    watchers: "Government, central banks, and households",
    color: "red",
  },
  {
    name: "Unemployment",
    icon: <UserMinus className="h-6 w-6 text-[#ef4444]" />,
    what: "How many people cannot find a job.",
    why: "Jobs are the engine of income and spending in the economy.",
    up: "People spend less, and the economy often weakens.",
    down: "More people earn income, which supports growth.",
    watchers: "Government, businesses, and workers",
    color: "red",
  },
  {
    name: "GDP Growth",
    icon: <Factory className="h-6 w-6 text-[#22c55e]" />,
    what: "How fast the whole economy is growing.",
    why: "It is the big scorecard for economic momentum.",
    up: "Business activity is strong and hiring can improve.",
    down: "Growth slows and recession risk can rise.",
    watchers: "Investors, policy makers, and business leaders",
    color: "green",
  },
  {
    name: "Housing Market",
    icon: <HomeIcon className="h-6 w-6 text-[#FFD000]" />,
    what: "How healthy the buying and selling of homes is.",
    why: "Housing affects construction jobs, lending, and family wealth.",
    up: "Confidence is stronger and related industries often benefit.",
    down: "Demand weakens and economic confidence can drop.",
    watchers: "Families, banks, and builders",
    color: "yellow",
  },
  {
    name: "Credit & Spreads",
    icon: <CreditCard className="h-6 w-6 text-[#ef4444]" />,
    what: "How risky banks think lending money is right now.",
    why: "Credit fear is often an early warning sign for stress.",
    up: "Lenders are nervous, and risky companies pay more to borrow.",
    down: "Lenders are calmer, and credit flows more easily.",
    watchers: "Banks, bond investors, and businesses",
    color: "red",
  },
  {
    name: "Money Supply",
    icon: <Banknote className="h-6 w-6 text-[#FFD000]" />,
    what: "How much money is flowing through the economy.",
    why: "Money flow helps explain spending, growth, and inflation pressure.",
    up: "Liquidity increases, which can support activity and assets.",
    down: "Liquidity tightens, which can cool growth.",
    watchers: "Central banks, economists, and investors",
    color: "yellow",
  },
  {
    name: "Trade & Dollar",
    icon: <Globe className="h-6 w-6 text-[#FFD000]" />,
    what: "How strong the US dollar is and how much we trade.",
    why: "It affects import prices, exports, and global competitiveness.",
    up: "A stronger dollar can lower import prices but hurt exports.",
    down: "A weaker dollar can help exports but raise import costs.",
    watchers: "Global businesses, policy makers, and traders",
    color: "yellow",
  },
  {
    name: "Consumer Sentiment",
    icon: <Smile className="h-6 w-6 text-[#22c55e]" />,
    what: "How confident everyday people feel about the economy.",
    why: "Confident people spend more, and spending drives growth.",
    up: "Households are more willing to buy and invest.",
    down: "People become cautious and spending slows.",
    watchers: "Retail businesses, investors, and economists",
    color: "green",
  },
  {
    name: "Equity & Risk",
    icon: <LineChart className="h-6 w-6 text-[#ef4444]" />,
    what: "How nervous or confident investors are in the stock market.",
    why: "Risk mood often moves before the real economy reacts.",
    up: "Rising risk signals can mean stress and higher volatility.",
    down: "Calmer risk signals can mean stable market conditions.",
    watchers: "Investors, funds, and risk teams",
    color: "red",
  },
];

export default function IndicatorsPage() {
  return (
    <PresentationShell>
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h1 className="section-reveal text-5xl font-bold sm:text-6xl">The Indicators</h1>
        <p className="section-reveal mt-5 max-w-3xl text-lg text-zinc-300">
          Each indicator is explained in plain language so you can see what it measures and why it matters.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {indicators.map((item) => (
            <article key={item.name} className={`section-reveal rounded-3xl border p-8 transition hover:scale-[1.02] ${colorClasses[item.color]}`}>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                  {item.icon}
                </div>
                <h2 className="text-3xl font-bold text-zinc-100">
                  {item.name}
                </h2>
              </div>
              <div className="mt-6 space-y-4">
                <p className="text-zinc-200">
                  <span className="font-semibold text-[#FFD000]">What is it?</span> {item.what}
                </p>
                <p className="text-zinc-200">
                  <span className="font-semibold text-[#FFD000]">Why does it matter?</span> {item.why}
                </p>
                <p className="text-zinc-200">
                  <span className="font-semibold text-[#FFD000]">When it goes UP it usually means...</span> {item.up}
                </p>
                <p className="text-zinc-200">
                  <span className="font-semibold text-[#FFD000]">When it goes DOWN it usually means...</span> {item.down}
                </p>
                <p className="text-zinc-200 pt-2 border-t border-white/10">
                  <span className="font-semibold text-[#FFD000]">Who watches this most?</span> {item.watchers}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </PresentationShell>
  );
}
