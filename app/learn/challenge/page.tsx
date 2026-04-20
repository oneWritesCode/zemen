"use client";

import { useState, useMemo } from "react";
import { 
  BarChart3, 
  Wallet, 
  ArrowRight, 
  RefreshCcw, 
  History, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { BackButton } from "@/components/ui/back-button";

const HISTORICAL_REGIMES = [
  { id: '2008_crisis', name: '2008 Financial Crisis', description: 'Major recession, housing market crash, global panic.', label: 'Recession' },
  { id: '2020_crash', name: '2020 COVID Crash', description: 'Pandemic-driven shutdown followed by massive stimulus.', label: 'Recession' },
  { id: '2021_recovery', name: '2021 Recovery Boom', description: 'Rebound in growth, vaccine rollout, inflation starts rising.', label: 'Recovery' },
  { id: '2022_stagflation', name: '2022 Stagflation', description: 'Sky-high inflation meets weak growth and rising rates.', label: 'Stagflation' },
  { id: '2024_goldilocks', name: '2024 Goldilocks', description: 'Solid growth, cooling inflation, healthy labor market.', label: 'Goldilocks' }
];

const HISTORICAL_RETURNS = {
  '2008_crisis': { nifty: -52, sp500: -38, gold: +5, bonds: +8, cash: +4 },
  '2020_crash': { nifty: -38, sp500: -34, gold: +25, bonds: +15, cash: +3 },
  '2021_recovery': { nifty: +65, sp500: +27, gold: -4, bonds: -2, cash: +3 },
  '2022_stagflation': { nifty: +4, sp500: -19, gold: +0, bonds: -13, cash: +5 },
  '2024_goldilocks': { nifty: +15, sp500: +24, gold: +27, bonds: +2, cash: +5 }
};

const ASSETS = [
  { id: 'nifty', name: 'Indian Stocks (Nifty 50)', color: '#22c55e' },
  { id: 'sp500', name: 'US Stocks (S&P 500)', color: '#3b82f6' },
  { id: 'gold', name: 'Gold', color: '#fbbf24' },
  { id: 'bonds', name: 'Bonds', color: '#6b7280' },
  { id: 'cash', name: 'Cash', color: '#94a3b8' }
];

export default function ChallengePage() {
  const [step, setStep] = useState(1);
  const [selectedRegime, setSelectedRegime] = useState<string | null>(null);
  const [allocation, setAllocation] = useState<Record<string, number>>({
    nifty: 20,
    sp500: 20,
    gold: 20,
    bonds: 20,
    cash: 20
  });
  const [results, setResults] = useState<{
    finalValue: number;
    totalReturn: number;
    bestReturn: number;
    worstReturn: number;
    chartData: { month: number; value: number }[];
  } | null>(null);

  const totalAllocation = useMemo(() => 
    Object.values(allocation).reduce((a, b) => a + b, 0), 
    [allocation]
  );

  const handleSliderChange = (id: string, val: number) => {
    setAllocation(prev => ({ ...prev, [id]: val }));
  };

  const runSimulation = () => {
    if (!selectedRegime || totalAllocation !== 100) return;
    
    // Fake loading delay
    setTimeout(() => {
      const returns = HISTORICAL_RETURNS[selectedRegime as keyof typeof HISTORICAL_RETURNS];
      const initialCapital = 1000000;
      
      let finalValue = 0;
      Object.keys(allocation).forEach(id => {
        const weight = allocation[id] / 100;
        const assetReturn = returns[id as keyof typeof returns] / 100;
        finalValue += initialCapital * weight * (1 + assetReturn);
      });

      const totalReturn = ((finalValue - initialCapital) / initialCapital) * 100;
      
      // Calculate best possible
      let bestReturn = -Infinity;
      Object.keys(returns).forEach(id => {
        if (returns[id as keyof typeof returns] > bestReturn) bestReturn = returns[id as keyof typeof returns];
      });

      // Calculate worst possible
      let worstReturn = Infinity;
      Object.keys(returns).forEach(id => {
        if (returns[id as keyof typeof returns] < worstReturn) worstReturn = returns[id as keyof typeof returns];
      });

      // Generate fake chart data
      const chartData = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        value: initialCapital + (finalValue - initialCapital) * (i + 1) / 12 * (0.8 + Math.random() * 0.4)
      }));

      setResults({
        finalValue,
        totalReturn,
        bestReturn,
        worstReturn,
        chartData
      });
      setStep(4);
    }, 2000);
  };

  return (
    <>
      <div className="min-h-screen bg-[#080809] text-zinc-100 py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <Breadcrumb 
            items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Learn Hub', href: '/learn' },
              { label: 'Portfolio Challenge', href: null }
            ]} 
          />
          <BackButton href="/learn" label="Back to Learn Hub" />
          
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <BarChart3 className="w-7 h-7 text-blue-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Macro Portfolio Challenge</h1>
                <p className="text-zinc-500">Test your asset allocation strategy against history</p>
              </div>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className={`h-1.5 flex-1 rounded-full ${step >= s ? 'bg-blue-500' : 'bg-zinc-900'}`} />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold">Step 1: Pick a historical regime</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {HISTORICAL_REGIMES.map(regime => (
                    <button
                      key={regime.id}
                      onClick={() => setSelectedRegime(regime.id)}
                      className={`text-left p-6 rounded-2xl border transition-all ${
                        selectedRegime === regime.id 
                        ? 'bg-blue-500/10 border-blue-500 text-blue-50' 
                        : 'bg-[#0e0e10] border-white/[0.08] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <History className="w-4 h-4 text-zinc-500" />
                        <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">{regime.label}</span>
                      </div>
                      <h3 className="text-lg font-bold mb-2">{regime.name}</h3>
                      <p className="text-sm text-zinc-500 leading-relaxed">{regime.description}</p>
                    </button>
                  ))}
                </div>
                <button
                  disabled={!selectedRegime}
                  onClick={() => setStep(2)}
                  className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-200 disabled:opacity-50 transition-all"
                >
                  Next Step <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <h2 className="text-2xl font-bold">Step 2: Allocate your virtual portfolio</h2>
                  <div className="px-4 py-2 bg-[#0e0e10] border border-white/[0.08] rounded-xl flex items-center gap-3">
                    <Wallet className="w-5 h-5 text-blue-500" />
                    <span className="text-xl font-mono font-bold">₹10,00,000</span>
                  </div>
                </div>

                <div className="bg-[#0e0e10] border border-white/[0.08] rounded-3xl p-6 sm:p-8 space-y-8">
                  <div className="grid gap-8">
                    {ASSETS.map(asset => (
                      <div key={asset.id} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full" style={{ background: asset.color }} />
                            <span className="font-bold">{asset.name}</span>
                          </div>
                          <span className="text-xl font-mono font-bold text-blue-500">{allocation[asset.id]}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={allocation[asset.id]}
                          onChange={(e) => handleSliderChange(asset.id, parseInt(e.target.value))}
                          className="w-full h-2 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                      </div>
                    ))}
                  </div>

                  <div className={`p-4 rounded-xl border flex items-center justify-between ${
                    totalAllocation === 100 ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
                  }`}>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-bold">Total Allocation: {totalAllocation}%</span>
                    </div>
                    <span className="text-sm font-medium">{totalAllocation === 100 ? 'Ready to simulate!' : `Needs to be exactly 100% (currently ${totalAllocation > 100 ? '+' : ''}${totalAllocation - 100}%)`}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="px-8 py-4 bg-zinc-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all"
                  >
                    Back
                  </button>
                  <button
                    disabled={totalAllocation !== 100}
                    onClick={() => {
                      setStep(3);
                      runSimulation();
                    }}
                    className="flex-1 py-4 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-200 disabled:opacity-50 transition-all"
                  >
                    Run Simulation →
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-24 space-y-8"
              >
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full" />
                  <motion.div 
                    className="absolute inset-0 border-4 border-t-blue-500 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold">Simulating...</h2>
                  <p className="text-zinc-500">Calculating your returns across history...</p>
                </div>
              </motion.div>
            )}

            {step === 4 && results && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-[#0e0e10] border border-white/[0.08] rounded-3xl p-8 flex flex-col items-center justify-center text-center">
                    <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Your Final Portfolio Value</p>
                    <p className="text-4xl font-bold mb-2">₹{results.finalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                    <div className={`flex items-center gap-1 font-bold ${results.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {results.totalReturn >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {results.totalReturn >= 0 ? '+' : ''}{results.totalReturn.toFixed(2)}%
                    </div>
                  </div>
                  <div className="bg-[#0e0e10] border border-white/[0.08] rounded-3xl p-6 flex flex-col justify-center gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500 text-sm">Initial Capital</span>
                      <span className="font-bold">₹10,00,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500 text-sm">Best Asset Return</span>
                      <span className="text-green-500 font-bold">+{results.bestReturn}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500 text-sm">Worst Asset Return</span>
                      <span className="text-red-500 font-bold">{results.worstReturn}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0e0e10] border border-white/[0.08] rounded-3xl p-6 sm:p-8">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    Performance Timeline
                  </h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={results.chartData}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#3b82f6" 
                          fillOpacity={1} 
                          fill="url(#colorValue)" 
                          strokeWidth={3}
                        />
                        <XAxis hide />
                        <YAxis hide domain={['dataMin - 50000', 'dataMax + 50000']} />
                        <Tooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-[#141417] border border-white/[0.1] p-3 rounded-xl shadow-2xl">
                                  <p className="text-xs text-zinc-500 mb-1">Month {payload[0].payload.month}</p>
                                  <p className="text-lg font-bold">₹{Math.floor(payload[0].value as number).toLocaleString()}</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-3xl p-8">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <History className="w-6 h-6 text-blue-500" />
                    Macro Wisdom
                  </h3>
                  <p className="text-blue-100/70 leading-relaxed mb-6">
                    During {HISTORICAL_REGIMES.find(r => r.id === selectedRegime)?.name}, the winning strategy was heavy on 
                    {results.bestReturn > 10 ? ' risk assets' : ' defensive assets'} because the economy was in a 
                    <span className="font-bold text-white"> {HISTORICAL_REGIMES.find(r => r.id === selectedRegime)?.label}</span> regime.
                    {selectedRegime === '2008_crisis' && " Gold and bonds were the only safe havens as equities crashed globally."}
                    {selectedRegime === '2021_recovery' && " Equities boomed as liquidity flooded the markets after the initial shock."}
                  </p>
                  <button
                    onClick={() => setStep(1)}
                    className="px-8 py-4 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all"
                  >
                    <RefreshCcw className="w-5 h-5" />
                    Try New Strategy
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
