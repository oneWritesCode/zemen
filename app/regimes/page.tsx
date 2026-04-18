import { PresentationShell } from "@/components/site/presentation-shell";
import {
  BarChart4,
  Coins,
  Banknote,
  Clock,
  Info,
  TrendingUp,
  Waves,
  Flame,
  AlertTriangle,
  CloudRain,
} from "lucide-react";

type Regime = {
  name: string;
  color: string;
  plainEnglish: string;
  happening: string[];
  examples: string[];
  stocks: string;
  gold: string;
  bonds: string;
  duration: string;
};

const regimes: Regime[] = [
  {
    name: "Goldilocks",
    color: "#22c55e",
    plainEnglish:
      "This is the calm zone. The economy is growing at a healthy pace and inflation is not causing stress.",
    happening: [
      "Jobs are stable and businesses keep hiring.",
      "Prices rise slowly, so household budgets are less pressured.",
      "Central bank policy usually stays predictable.",
    ],
    examples: ["1995-1999", "2012-2015"],
    stocks: "Usually strong, because growth is steady and risk feels manageable.",
    gold: "Often stable to slightly weak, because fear is lower.",
    bonds: "Usually moderate performance with lower panic demand.",
    duration: "Often lasts 1 to 3 years before conditions shift.",
  },
  {
    name: "Recovery",
    color: "#3b82f6",
    plainEnglish:
      "The economy is healing after a tough period. Activity starts coming back, but it is still fragile.",
    happening: [
      "Employment begins to recover from earlier losses.",
      "Consumer spending improves step by step.",
      "Policy support is usually still active.",
    ],
    examples: ["2009-2011", "2020-2021"],
    stocks: "Often strong early, because markets react to improving momentum.",
    gold: "Can do well if uncertainty remains elevated.",
    bonds: "Mixed performance as growth improves and rates can rise.",
    duration: "Commonly 1 to 2 years before moving to another regime.",
  },
  {
    name: "Overheating",
    color: "#f97316",
    plainEnglish:
      "The economy is running too hot. Growth is fast, but inflation pressure rises quickly.",
    happening: [
      "Demand outruns supply in many parts of the economy.",
      "Wages and prices rise faster than usual.",
      "Central banks often tighten policy to cool things down.",
    ],
    examples: ["1999-2000", "2021-2022"],
    stocks: "Can rise at first, then become volatile as rate pressure builds.",
    gold: "May hold up as inflation concerns increase.",
    bonds: "Often weak because rising rates pressure bond prices.",
    duration: "Usually shorter, around 6 to 18 months.",
  },
  {
    name: "Stagflation",
    color: "#ef4444",
    plainEnglish:
      "Growth slows while prices stay high. That means households and businesses get squeezed from both sides.",
    happening: [
      "Inflation stays elevated even when demand weakens.",
      "Real income and confidence tend to fall.",
      "Policy choices become difficult because every fix has trade-offs.",
    ],
    examples: ["1973-1975", "2022-2023"],
    stocks: "Usually pressured because profits and confidence both weaken.",
    gold: "Often stronger as investors look for inflation protection.",
    bonds: "Can struggle if inflation stays sticky.",
    duration: "Can persist 1 to 3 years depending on inflation control.",
  },
  {
    name: "Recession",
    color: "#6b7280",
    plainEnglish:
      "The economy is shrinking. Companies cut spending, and job losses increase.",
    happening: [
      "GDP contracts for a period of time.",
      "Unemployment rises as hiring slows.",
      "Credit conditions become tighter and more cautious.",
    ],
    examples: ["2008-2009", "2020 Q1-Q2"],
    stocks: "Usually weak until investors see a clear recovery path.",
    gold: "Mixed behavior, often helped by safe-haven demand.",
    bonds: "Often stronger when rates fall and safety demand rises.",
    duration: "Most recessions last around 6 to 18 months.",
  },
];

const REGIME_ICONS: Record<string, React.ElementType> = {
  Goldilocks: TrendingUp,
  Recovery: Waves,
  Overheating: Flame,
  Stagflation: AlertTriangle,
  Recession: CloudRain,
};

export default function RegimesPage() {
  return (
    <PresentationShell>
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        {/* Hero */}
        <div className="section-reveal mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400 mb-6">
            <Info className="h-3 w-3" />
            Economic Regimes
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
            The Five Regimes
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-zinc-400 leading-relaxed">
            Zemen groups the economy into five clear states so you can understand
            what is happening and what often follows next.
          </p>
        </div>

        <div className="space-y-6">
          {regimes.map((regime, i) => {
            const Icon = REGIME_ICONS[regime.name] ?? Info;
            return (
              <section
                key={regime.name}
                className="section-reveal rounded-2xl border bg-[#0e0e10] overflow-hidden transition-all hover:bg-[#111114]"
                style={{
                  borderColor: `${regime.color}30`,
                }}
              >
                {/* Colored top stripe */}
                <div
                  className="h-[3px] w-full"
                  style={{ background: `linear-gradient(90deg, ${regime.color}, ${regime.color}40, transparent)` }}
                />

                <div className="p-7 sm:p-10">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: `${regime.color}15`, border: `1px solid ${regime.color}25` }}
                    >
                      <Icon className="h-6 w-6" style={{ color: regime.color }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2
                          className="text-3xl font-black uppercase tracking-tight"
                          style={{ color: regime.color }}
                        >
                          {regime.name}
                        </h2>
                        <span className="text-xs text-zinc-600 font-medium">#{i + 1}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {regime.examples.map((ex) => (
                          <span
                            key={ex}
                            className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium text-zinc-500"
                          >
                            {ex}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Plain English */}
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-8">
                    <Info className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
                    <p className="text-zinc-300 text-sm leading-relaxed">{regime.plainEnglish}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* What's happening */}
                    <div>
                      <p className="font-semibold text-zinc-300 text-xs uppercase tracking-[0.18em] mb-4">
                        Key Indicators
                      </p>
                      <ul className="space-y-3">
                        {regime.happening.map((point) => (
                          <li key={point} className="flex items-start gap-3 text-sm text-zinc-400 leading-relaxed">
                            <div
                              className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0"
                              style={{ background: regime.color }}
                            />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Asset performance table */}
                    <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-black/20">
                      <div className="border-b border-white/[0.06] bg-white/[0.02] px-5 py-2.5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                          Asset Behavior
                        </p>
                      </div>
                      <div className="divide-y divide-white/[0.04]">
                        <div className="flex items-start gap-3 px-5 py-3.5">
                          <BarChart4 className="h-4 w-4 text-zinc-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-zinc-300 mb-0.5">Stocks</p>
                            <p className="text-xs text-zinc-500 leading-relaxed">{regime.stocks}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 px-5 py-3.5">
                          <Coins className="h-4 w-4 text-zinc-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-zinc-300 mb-0.5">Gold</p>
                            <p className="text-xs text-zinc-500 leading-relaxed">{regime.gold}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 px-5 py-3.5">
                          <Banknote className="h-4 w-4 text-zinc-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-zinc-300 mb-0.5">Bonds</p>
                            <p className="text-xs text-zinc-500 leading-relaxed">{regime.bonds}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="mt-7 pt-5 border-t border-white/[0.05] flex items-center gap-2.5 text-sm text-zinc-500">
                    <Clock className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
                    <p>
                      <span className="text-zinc-400 font-medium">Duration: </span>
                      {regime.duration}
                    </p>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </PresentationShell>
  );
}
