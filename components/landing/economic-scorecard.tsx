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
  const indicatorCount = INDICATORS.length;

  return (
    <section ref={ref} className="py-20 border-t border-white/[0.05]">
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12 items-start">
        {/* Left side: Gauge */}
        <div className="sticky top-6 flex flex-col items-center justify-center text-center">
          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 256 256">
              <circle
                cx="128"
                cy="128"
                r="110"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-white/[0.03]"
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
                className={`${overallScore > 70 ? 'text-[#4C72F6]' : overallScore > 40 ? 'text-white' : 'text-red-500'}`}
                style={{ filter: "drop-shadow(0px 0px 8px rgba(76, 114, 246, 0.4))" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-6xl font-bold flex items-center justify-center" style={{ marginLeft: '-4px' }}>
                <AnimatedNumber value={overallScore} decimals={0} />
              </div>
              <span className="text-[#888] uppercase tracking-[0.15em] text-[10px] font-bold mt-1" style={{ marginRight: '-0.15em' }}>Overall Health</span>
            </div>
          </div>
          
          <div className="mt-4 text-[13px] text-[#666] leading-relaxed">
            Based on {indicatorCount} live economic indicators
          </div>

          <div className="mt-8 px-6 py-2 rounded-full bg-[#4C72F6]/10 border border-[#4C72F6]/20 text-[#4C72F6] font-bold text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Healthy Economy
          </div>
        </div>

        {/* Right side: Indicator bars */}
        <div className="flex flex-col gap-3 backdrop-blur">
          {INDICATORS.map((item, i) => {
            const statusColor = item.score > 70 ? '#4C72F6' : item.score > 40 ? '#FFFFFF' : '#ef4444';
            const statusClass = item.score > 70 ? 'text-[#4C72F6]' : item.score > 40 ? 'text-white' : 'text-red-500';
            
            return (
              <motion.div 
                key={item.name}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                className="bg-[#] border-none shadow-[0_4px_20px_rgba(0,0,0,0.15)] rounded-2xl px-6 py-5"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: statusColor }} />
                    <span className="text-sm font-medium text-white">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] text-[#888] font-mono">
                      <AnimatedNumber value={item.value} decimals={1} />{item.unit}
                    </span>
                    <span className={`text-[11px] font-semibold uppercase tracking-[0.5px] ${statusClass}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
                
                <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full rounded-full"
                    style={{ background: statusColor, transformOrigin: 'left' }}
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: item.score / 100 } : {}}
                    transition={{ 
                      duration: 1, 
                      delay: i * 0.1, 
                      ease: 'easeOut' 
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
