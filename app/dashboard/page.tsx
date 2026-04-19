import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Zap,
  TrendingUp,
} from "lucide-react";

import { getRegimeAnalysis } from "@/lib/regime/get-analysis";
import { REGIME_BY_ID } from "@/lib/regime/types";
import { EconomicScorecard } from "@/components/landing/economic-scorecard";
import { MacroSignalsFeed } from "@/components/landing/macro-signals-feed";
import { AnimatedNumber, MotionDiv } from "@/components/ui/animations";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const analysis = await getRegimeAnalysis();
  const current = analysis.current;
  const meta = REGIME_BY_ID[current.regime];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 sm:px-6">
      {/* 1. Regime Status Hero */}
      <section className="mb-12">
        <div className="rounded-3xl border border-white/[0.06] bg-[#0e0e10] p-8 sm:p-12 text-center relative overflow-hidden">
          {/* Subtle background pattern/glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-from),transparent_70%)] from-white/[0.03] to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Current Economic Regime
            </div>

            <MotionDiv
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ 
                duration: 0.5, 
                type: 'spring', 
                stiffness: 200, 
                damping: 20 
              }}
            >
              <h1
                className="text-5xl sm:text-7xl font-black tracking-tighter mb-4"
                style={{ color: meta.color }}
              >
                {meta.label}
              </h1>
            </MotionDiv>

            <div className="flex flex-col items-center gap-2">
              <p className="text-xl text-zinc-200 font-medium max-w-2xl">
                {meta.description.split('.')[0]}.
              </p>
              <p className="text-sm text-zinc-500">
                Confidence: <span className="text-zinc-300 font-bold">
                  <AnimatedNumber value={current.confidencePct} suffix="%" />
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Economic Scorecard */}
      <section className="mb-12">
        <EconomicScorecard />
      </section>

      {/* 3. Macro Signals Feed */}
      <section className="mb-12">
        <MacroSignalsFeed />
      </section>

      {/* 4. Quick Links Row */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickLinkCard
            href="/indicators"
            title="Indicators"
            description="Explore 10+ live macro data points"
            icon={BarChart3}
            color="text-blue-500"
          />
          <QuickLinkCard
            href="/sectors"
            title="Sectors"
            description="Where smart money is moving now"
            icon={TrendingUp}
            color="text-green-500"
          />
          <QuickLinkCard
            href="/learn/quiz"
            title="Macro Quiz"
            description="Test your economic knowledge"
            icon={Brain}
            color="text-white"
          />
          <QuickLinkCard
            href="/briefing"
            title="Weekly Briefing"
            description="The big story in plain English"
            icon={Zap}
            color="text-purple-500"
          />
        </div>
      </section>
    </div>
  );
}

function QuickLinkCard({ 
  href, 
  title, 
  description, 
  icon: Icon, 
  color 
}: { 
  href: string; 
  title: string; 
  description: string; 
  icon: React.ElementType;
  color: string;
}) {
  return (
    <Link href={href}>
      <MotionDiv 
        whileHover={{ scale: 1.02 }} 
        whileTap={{ scale: 0.98 }} 
        transition={{ duration: 0.15 }}
        className="group h-full bg-[#0e0e10] border border-white/[0.08] p-6 rounded-2xl transition-all hover:bg-zinc-900/50 hover:border-white/20 will-change-transform"
      >
        <div className={`w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
          {title}
          <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-zinc-500" />
        </h3>
        <p className="text-sm text-zinc-500 leading-relaxed">
          {description}
        </p>
      </MotionDiv>
    </Link>
  );
}
