"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Monitor, 
  HeartPulse, 
  Landmark, 
  Zap, 
  ShoppingCart, 
  ShoppingBag, 
  Factory, 
  Home, 
  Lightbulb, 
  Mountain, 
  Rocket,
  ArrowRight,
  Activity
} from "lucide-react";
import { SectorSparkline } from "./sector-sparkline";
import { type SectorConfig, type SectorId } from "@/lib/sectors/sector-config";
import { type RegimeId } from "@/lib/regime/types";
import { AnimatedNumber, Skeleton } from "@/components/ui/animations";

const SECTOR_ICONS: Record<SectorId, React.ElementType> = {
  technology: Monitor,
  healthcare: HeartPulse,
  financials: Landmark,
  energy: Zap,
  "consumer-staples": ShoppingCart,
  "consumer-discretionary": ShoppingBag,
  industrials: Factory,
  "real-estate": Home,
  utilities: Lightbulb,
  materials: Mountain,
  "emerging-tech": Rocket,
};

interface SectorCardProps {
  sector: SectorConfig;
  regime: string;
  index?: number;
}

async function getSparklineData(ticker: string): Promise<number[]> {
  try {
    const response = await fetch(`/api/sparkline?ticker=${ticker}`);
    const data = await response.json();
    return data.prices || [];
  } catch {
    return [];
  }
}

export function SectorCard({ sector, regime, index = 0 }: SectorCardProps) {
  const [sparkData, setSparkData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [ytd, setYtd] = useState<number | null>(null);

  useEffect(() => {
    getSparklineData(sector.ticker).then((prices) => {
      setSparkData(prices);
      if (prices.length >= 2) {
        const ret = ((prices[prices.length - 1] - prices[0]) / prices[0]) * 100;
        setYtd(ret);
      }
      setLoading(false);
    });
  }, [sector.ticker]);

  const fit = "NEUTRAL"; // This should ideally come from getSectorFit(regime, sector.id)
  const risk = sector.riskLevelByRegime[regime as RegimeId] ?? "Medium";
  const Icon = SECTOR_ICONS[sector.id] ?? Activity;

  const getFitBadge = (fit: string) => {
    if (fit === "HOT") {
      return (
        <div className="flex items-center gap-1 rounded-[20px] border border-[#166534] bg-[#052e16] px-2.5 py-1 text-[10px] font-bold tracking-[1px] text-[#22c55e]">
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-[#22c55e]"
          />
          HOT
        </div>
      );
    }
    if (fit === "COLD") return <div className="rounded-[20px] border border-[#333333] bg-[#111111] px-2.5 py-1 text-[10px] font-bold tracking-[1px] text-[#666666]">COLD</div>;
    return <div className="rounded-[20px] border border-[#333333] bg-[#1a1a1a] px-2.5 py-1 text-[10px] font-bold tracking-[1px] text-[#888888]">NEUTRAL</div>;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true, margin: '-50px' }} 
      transition={{ 
        duration: 0.4, 
        delay: index * 0.08, 
        ease: 'easeOut' 
      }} 
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-transparent bg-[#0a0a0a] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all duration-300 will-change-transform hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]" 
      style={{ borderColor: "transparent" } as React.CSSProperties}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = sector.color}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = "transparent"}
    >
      {/* Top border highlight on hover */}
      <div 
        className="absolute left-0 right-0 top-0 h-[3px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: sector.color }}
      />
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="flex h-12 w-12 items-center justify-center rounded-xl text-[22px] text-white"
            style={{ background: `${sector.color}15` }}
          >
            <Icon className="w-6 h-6" style={{ color: sector.color }} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{sector.name}</h3>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{sector.ticker}</p>
          </div>
        </div>
        {getFitBadge(fit)}
      </div>

      <p className="text-xs text-zinc-400 mb-4 leading-relaxed line-clamp-2">
        {sector.plainEnglish}
      </p>

      {/* Sparkline */}
      {/* Sparkline */}
      <div className="my-3 flex h-24 items-center justify-center rounded-lg bg-[#0d0d0d] p-2">
        {loading ? (
          <Skeleton height="80px" width="260px" />
        ) : (
          <SectorSparkline
            data={sparkData}
            color={sector.color}
            width={260}
            height={80}
          />
        )}
      </div>

      {/* YTD & Risk */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.05em] text-[#666]">YTD Performance</div>
          <div className={`flex items-center gap-1 font-mono text-2xl font-bold ${
            ytd === null ? 'text-[#444]' 
              : ytd >= 0 ? 'text-[#22c55e]' 
              : 'text-[#ef4444]'
          }`}>
            {ytd === null ? <Skeleton height="24px" width="60px" /> : (
              <>
                {ytd >= 0 ? '+' : ''}
                <AnimatedNumber value={ytd} suffix="%" />
              </>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.05em] text-[#666]">Risk Level</div>
          <div className={`text-xs font-bold px-2 py-1 rounded-md border ${
            risk === 'Low' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
            risk === 'Medium' ? 'bg-white/10 border-white/20 text-white' :
            'bg-red-500/10 border-red-500/20 text-red-500'
          }`}>
            {risk}
          </div>
        </div>
      </div>

      <Link href={`/sectors/${sector.id}`}>
        <motion.div
          className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[#2a2a2a] bg-transparent p-2.5 text-[13px] text-[#888] transition-all duration-200 hover:border-white hover:bg-white hover:font-semibold hover:text-black"
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }} 
          transition={{ duration: 0.15 }}
        >
          Explore Analysis <ArrowRight className="w-4 h-4" />
        </motion.div>
      </Link>
    </motion.div>
  );
}
