import { DASHBOARD_TOPICS } from "@/lib/fred/topics-config";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TopicIcon } from "@/components/icons/topic-icon";
import { MotionDiv } from "@/components/ui/animations";

export const dynamic = "force-dynamic";

export default async function IndicatorsOverviewPage() {
  // We don't have a single API for all indicators with 7-day change yet, 
  // so for now we'll show the indicators and their description.
  // In a real implementation, we'd fetch current values for all.

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 sm:px-6">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Economic Indicators
        </h1>
        <p className="mt-3 max-w-2xl text-zinc-400 text-base leading-relaxed">
          The building blocks of macro intelligence. Monitor 10 key dimensions of the US economy.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DASHBOARD_TOPICS.map((topic, index) => (
          <MotionDiv
            key={topic.slug}
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true, margin: '-50px' }} 
            transition={{ 
              duration: 0.4, 
              delay: index * 0.08, 
              ease: 'easeOut' 
            }}
            className="will-change-transform"
          >
            <Link
              href={`/indicators/${topic.slug}`}
              className="group flex flex-col h-full rounded-2xl border border-white/[0.07] bg-[#0e0e10] p-6 transition-all hover:border-white/[0.12] hover:bg-[#111114]"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TopicIcon id={topic.icon} className="w-6 h-6 text-zinc-300" />
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active</span>
                </div>
              </div>

              <h2 className="text-xl font-bold text-white mb-2">{topic.label}</h2>
              <p className="text-sm text-zinc-500 leading-relaxed mb-6 line-clamp-2">
                {topic.description}
              </p>

              <div className="mt-auto pt-4 border-t border-white/[0.04] flex items-center justify-between text-xs font-bold uppercase tracking-widest text-zinc-500">
                <span>View Analysis</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </MotionDiv>
        ))}
      </div>
    </div>
  );
}
