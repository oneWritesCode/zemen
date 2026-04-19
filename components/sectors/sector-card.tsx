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
        <div className="badge-hot">
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', marginRight: 5 }}
          />
          HOT
        </div>
      );
    }
    if (fit === "COLD") return <div className="badge-cold">COLD</div>;
    return <div className="badge-neutral">NEUTRAL</div>;
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
      className="sector-card group will-change-transform" 
      style={{ "--sector-color": sector.color, "--sector-color-dim": `${sector.color}15`, "--sector-color-border": `${sector.color}30` } as React.CSSProperties}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="sector-icon text-white">
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
      <div style={{ 
        background: '#0d0d0d', 
        borderRadius: '8px', 
        padding: '8px', 
        margin: '12px 0',
        height: '96px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
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
          <div style={{ fontSize: '10px', color: '#666', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>YTD Performance</div>
          <div style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            fontFamily: 'monospace',
            color: ytd === null ? '#444' 
              : ytd >= 0 ? '#22c55e' 
              : '#ef4444' 
          }}>
            {ytd === null ? <Skeleton height="24px" width="60px" /> : (
              <>
                {ytd >= 0 ? '+' : ''}
                <AnimatedNumber value={ytd} suffix="%" />
              </>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <div style={{ fontSize: '10px', color: '#666', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Risk Level</div>
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
          className="explore-btn"
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
