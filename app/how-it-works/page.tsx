import { PresentationShell } from "@/components/site/presentation-shell";
import { 
  Database, 
  Cpu, 
  Target, 
  History,
  CheckCircle2
} from "lucide-react";

const steps = [
  {
    title: "Step 1 — We collect the data",

    
    icon: <Database className="h-8 w-8 text-white" />,
    body: "Every day, Zemen automatically pulls fresh data from FRED — the Federal Reserve's official database. This includes interest rates, inflation, unemployment, GDP, housing, credit, and more.",
    visual: ["FRED", "BLS", "Federal Reserve", "Market Data", "ZEMEN"],
  },
  {
    title: "Step 2 — We find the pattern",
    icon: <Cpu className="h-8 w-8 text-white" />,
    body: "Zemen uses a machine learning technique called clustering. It looks at thousands of historical economic periods and groups similar ones together. Like sorting photos into albums — except the photos are economic conditions.",
    visual: ["Past data dots", "Cluster", "Cluster", "Cluster", "5 Groups"],
  },
  {
    title: "Step 3 — We identify your regime",
    icon: <Target className="h-8 w-8 text-white" />,
    body: "By comparing today's data to historical patterns, Zemen tells you which economic mode we are currently in — with a confidence percentage.",
    visual: ["Today's data", "Compare", "Best match", "Regime", "Confidence %"],
  },
  {
    title: "Step 4 — We tell you what history says",
    icon: <History className="h-8 w-8 text-white" />,
    body: "Once we know the regime, we look at every similar period in history and show you what happened to stocks, gold, and bonds in the 90 and 180 days after. Not a prediction — a historical playbook.",
    visual: ["Matching periods", "90-day move", "180-day move", "Stocks / Gold / Bonds", "Historical playbook"],
  },
];

export default function HowItWorksPage() {
  return (
    <PresentationShell>
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h1 className="section-reveal text-5xl font-black text-zinc-100 sm:text-7xl tracking-tight">How It Works</h1>
        <p className="section-reveal mt-6 max-w-3xl text-xl text-zinc-400 leading-relaxed">
          Zemen turns noisy economic data into <span className="text-white font-semibold">one simple answer</span> by following a four-step automated process.
        </p>

        <div className="mt-20 space-y-16">
          {steps.map((step) => (
            <section key={step.title} className="section-reveal group relative">
              <div className="absolute -left-12 top-0 hidden h-full w-px bg-gradient-to-b from-white/30 to-transparent lg:block" />
              <div className="flex flex-col lg:flex-row gap-12 items-start">
                <div className="shrink-0 p-5 rounded-3xl bg-white/10 border border-white/20 group-hover:bg-white/20 transition-all duration-500">
                  {step.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-zinc-100 group-hover:text-white transition-colors">{step.title}</h2>
                  <p className="mt-5 max-w-4xl text-lg leading-relaxed text-zinc-400">{step.body}</p>
                  
                  <div className="mt-10 grid gap-4 overflow-hidden sm:grid-cols-5">
                    {step.visual.map((block, index) => (
                      <div
                        key={`${step.title}-${block}`}
                        className="relative rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-6 text-center transition-all hover:bg-white/[0.06] hover:border-white/30"
                      >
                        <div className="mb-3 flex justify-center">
                          <CheckCircle2 className="h-4 w-4 text-white/40" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-zinc-300">{block}</span>
                        {index < step.visual.length - 1 && (
                          <div className="absolute -right-2 top-1/2 hidden h-px w-4 -translate-y-1/2 bg-white/10 sm:block" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </PresentationShell>
  );
}
