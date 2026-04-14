import { PresentationShell } from "@/components/site/presentation-shell";
import { 
  BarChart4, 
  Coins, 
  Banknote,
  Info,
  Clock
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

export default function RegimesPage() {
  return (
    <PresentationShell>
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h1 className="section-reveal text-5xl font-bold sm:text-6xl text-zinc-100">The Regimes</h1>
        <p className="section-reveal mt-5 max-w-3xl text-lg text-zinc-300">
          Zemen groups the economy into five clear states so you can understand what is happening and what
          often comes next.
        </p>

        <div className="mt-14 space-y-10">
          {regimes.map((regime) => (
            <section
              key={regime.name}
              className="section-reveal rounded-3xl border p-8 sm:p-12 transition-all hover:bg-white/[0.02]"
              style={{
                borderColor: `${regime.color}80`,
                backgroundColor: `${regime.color}10`,
              }}
            >
              <h2 className="text-4xl font-black uppercase tracking-tight" style={{ color: regime.color }}>
                {regime.name}
              </h2>
              <div className="mt-8 flex items-start gap-3 p-5 rounded-2xl bg-black/40 border border-white/5">
                <Info className="h-6 w-6 text-[#FFD000] shrink-0 mt-0.5" />
                <p className="text-zinc-100 text-lg leading-relaxed">
                  <span className="font-bold text-[#FFD000]">In plain English:</span> {regime.plainEnglish}
                </p>
              </div>

              <div className="mt-10 grid md:grid-cols-2 gap-10">
                <div>
                  <p className="font-bold text-[#FFD000] uppercase text-xs tracking-[0.2em] mb-4">Core Indicators</p>
                  <ul className="space-y-4">
                    {regime.happening.map((point) => (
                      <li key={point} className="flex items-start gap-3 text-zinc-300">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#FFD000] shrink-0 mt-2" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-8 text-zinc-400 text-sm">
                    <span className="font-bold text-[#FFD000]">Historical examples:</span>{" "}
                    {regime.examples.join(", ")}
                  </p>
                </div>

                <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-zinc-400 uppercase text-[10px] tracking-widest font-bold">
                      <tr>
                        <th className="px-6 py-4">Asset</th>
                        <th className="px-6 py-4">Typical behavior</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr>
                        <td className="px-6 py-5 flex items-center gap-3 font-semibold text-zinc-100">
                          <BarChart4 className="h-4 w-4 text-[#FFD000]" /> Stocks
                        </td>
                        <td className="px-6 py-5 text-zinc-300 leading-relaxed">{regime.stocks}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-5 flex items-center gap-3 font-semibold text-zinc-100">
                          <Coins className="h-4 w-4 text-[#FFD000]" /> Gold
                        </td>
                        <td className="px-6 py-5 text-zinc-300 leading-relaxed">{regime.gold}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-5 flex items-center gap-3 font-semibold text-zinc-100">
                          <Banknote className="h-4 w-4 text-[#FFD000]" /> Bonds
                        </td>
                        <td className="px-6 py-5 text-zinc-300 leading-relaxed">{regime.bonds}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-white/5 flex items-center gap-3 text-zinc-400">
                <Clock className="h-4 w-4 text-[#FFD000]" />
                <p>
                  <span className="font-bold text-[#FFD000]">Typical Duration:</span> {regime.duration}
                </p>
              </div>
            </section>
          ))}
        </div>
      </div>
    </PresentationShell>
  );
}
