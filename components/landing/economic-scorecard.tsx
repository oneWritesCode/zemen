"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/animations";

interface IndicatorScore {
  name: string;
  value: number;
  score: number;
  status: "Healthy" | "Caution" | "Economic Stress";
  unit: string;
}

const INDICATORS: IndicatorScore[] = [
  { name: "Interest Rates", value: 5.33, score: 40, status: "Economic Stress", unit: "%" },
  { name: "Inflation (CPI)", value: 3.1, score: 50, status: "Caution", unit: "%" },
  { name: "Unemployment", value: 4.2, score: 95, status: "Healthy", unit: "%" },
  { name: "GDP Growth", value: 2.8, score: 90, status: "Healthy", unit: "%" },
  { name: "Credit Spreads", value: 3.2, score: 85, status: "Healthy", unit: "%" },
  { name: "Consumer Sentiment", value: 67.4, score: 45, status: "Caution", unit: "pts" },
];

export function EconomicScorecard() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  const overallScore = 72; // Weighted average

  return (
    <section ref={ref} className="py-20 border-t border-white/[0.05]">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left side: Gauge */}
        <div className="lg:w-1/3 flex flex-col items-center justify-center text-center">
          <h2 className="text-3xl font-bold mb-2">Zemen Economic Scorecard</h2>
          <p className="text-zinc-500 mb-10 text-sm">Real-time health of the US economy</p>
          
          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="110"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-zinc-900"
              />
              <motion.circle
                cx="128"
                cy="128"
                r="110"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray="691"
                initial={{ strokeDashoffset: 691 }}
                animate={isInView ? { strokeDashoffset: 691 - (691 * overallScore) / 100 } : {}}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={`${overallScore > 70 ? 'text-green-500' : overallScore > 40 ? 'text-white' : 'text-red-500'}`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-6xl font-bold">
                <AnimatedNumber value={overallScore} decimals={0} />
              </div>
              <span className="text-zinc-500 uppercase tracking-widest text-[10px] font-bold mt-1">Overall Health</span>
            </div>
          </div>
          
          <div className="mt-8 px-6 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 font-bold text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Healthy Economy
          </div>
        </div>

        {/* Right side: Indicators */}
        <div className="lg:w-2/3 grid gap-6">
          {INDICATORS.map((item, i) => (
            <motion.div 
              key={item.name}
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="bg-[#0e0e10] border border-white/[0.08] rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${item.score > 70 ? 'bg-green-500' : item.score > 40 ? 'bg-white' : 'bg-red-500'}`} />
                  <span className="font-bold text-sm">{item.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-zinc-500 font-mono">
                    <AnimatedNumber value={item.value} decimals={1} />{item.unit}
                  </span>
                  <span className={`text-xs font-bold uppercase tracking-wider ${item.score > 70 ? 'text-green-500' : item.score > 40 ? 'text-white' : 'text-red-500'}`}>
                    {item.status}
                  </span>
                </div>
              </div>
              <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full ${item.score > 70 ? 'bg-green-500' : item.score > 40 ? 'bg-white' : 'bg-red-500'}`}
                  style={{ transformOrigin: 'left' }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: item.score / 100 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.8, 
                    delay: i * 0.1, 
                    ease: 'easeOut' 
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
