"use client";

import { motion } from "framer-motion";
import { Signal, Clock } from "lucide-react";

interface SignalItem {
  type: "BULLISH" | "BEARISH" | "NEUTRAL" | "WATCH";
  indicator: string;
  explanation: string;
  date: string;
  fresh?: boolean;
}

const SIGNALS: SignalItem[] = [
  { type: "WATCH", indicator: "Interest Rates", explanation: "Fed signals slower pace of rate cuts as tariff inflation risks rise", date: "2 hours ago", fresh: true },
  { type: "BEARISH", indicator: "Consumer Sentiment", explanation: "UMich Consumer Sentiment falls to multi-year low amid trade uncertainty", date: "4 hours ago", fresh: true },
  { type: "BULLISH", indicator: "Employment", explanation: "Unemployment holds steady at 4.2% showing labor market resilience", date: "1 day ago" },
  { type: "WATCH", indicator: "GDP", explanation: "Q1 2026 GDP growth slows as trade policy uncertainty weighs on business", date: "2 days ago" },
  { type: "BEARISH", indicator: "Trade", explanation: "US trade deficit widens as tariff front-running boosts imports", date: "3 days ago" },
  { type: "BULLISH", indicator: "Gold", explanation: "Gold reaches new all-time highs as safe haven demand surges", date: "4 days ago" },
  { type: "WATCH", indicator: "Housing", explanation: "Mortgage rates stabilize but affordability remains near historic lows", date: "5 days ago" },
  { type: "BULLISH", indicator: "Credit", explanation: "Credit spreads compress as corporate earnings beat expectations", date: "6 days ago" },
];

export function MacroSignalsFeed() {
  return (
    <section className="py-20 border-t border-white/[0.05]">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Signal className="w-8 h-8 text-blue-500" />
            Macro Signals
          </h2>
          <p className="text-zinc-500 mt-2">Real-time alerts and market movements</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
          <div className="live-dot" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-red-500">Live Feed</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SIGNALS.map((signal, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
            transition={{ 
              delay: i * 0.1, 
              duration: 0.35, 
              ease: 'easeOut' 
            }}
            className={`bg-[#0e0e10] border-l-4 border-y border-r border-white/[0.08] p-5 rounded-r-2xl relative overflow-hidden group transition-all hover:bg-zinc-900/50 will-change-transform ${
              signal.type === 'BULLISH' ? 'border-l-green-500' :
              signal.type === 'BEARISH' ? 'border-l-red-500' :
              signal.type === 'WATCH' ? 'border-l-white' :
              'border-l-blue-500'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                signal.type === 'BULLISH' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                signal.type === 'BEARISH' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                signal.type === 'WATCH' ? 'bg-white/10 text-white border border-white/20' :
                'bg-blue-500/10 text-blue-500 border border-blue-500/20'
              }`}>
                {signal.type}
              </span>
              <div className="flex items-center gap-1.5 text-zinc-600">
                <Clock className="w-3 h-3" />
                <span className="text-[10px] font-bold">{signal.date}</span>
              </div>
            </div>

            <h3 className="font-bold text-sm mb-2 text-zinc-300 group-hover:text-white transition-colors">{signal.indicator}</h3>
            <p className="text-xs text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors">
              {signal.explanation}
            </p>

            {signal.fresh && (
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-500 rounded-full" />
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
