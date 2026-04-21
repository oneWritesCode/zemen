"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MotionDiv } from "@/components/ui/animations"
import { 
  ArrowLeft, Plus, Check, 
  X, Briefcase, SlidersHorizontal, 
  ChevronDown,
  Info, Target, Calendar, Wallet, Search
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/lib/hooks/use-toast"
import { SectorSparkline } from "@/components/sectors/sector-sparkline"

type Risk = "Conservative" | "Balanced" | "Aggressive"
type Horizon = "<1yr" | "1-3yr" | ">3yr"

interface StockResult {
  ticker: string
  name: string
  sector: string
  industry: string
  marketCap: string
  currentPrice: number
  ytdReturn: number
  m1Return: number
  fit: number
  reason: string
  sparkData: number[]
}

interface RegimeData {
  regime: string
  confidence: number
  description: string
}

const REGIME_DESCRIPTIONS: Record<string, string> = {
  "Goldilocks": "Low rates + moderate growth. Risk-on environment favours equities, tech, and growth assets.",
  "Recovery": "Growth rebounding from lows. Cyclicals and small-caps typically outperform as momentum builds.",
  "Overheating": "High growth and rising inflation. Commodities and defensive sectors often provide protection.",
  "Stagflation": "Low growth and high inflation. Challenging environment favoring cash and defensive assets.",
  "Recession": "Contracting activity and falling rates. Safe havens like bonds and gold are preferred."
};

const SECTORS = [
  'All Sectors',
  'Technology',
  'Healthcare',
  'Financials',
  'Consumer Discretionary',
  'Consumer Staples',
  'Energy',
  'Industrials',
  'ETF'
]

function SegmentedControl<T extends string>({ 
  label, options, value, onChange, icon: Icon 
}: { 
  label: string 
  options: T[] 
  value: T 
  onChange: (v: T) => void 
  icon?: React.ElementType
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-3.5 w-3.5 text-[#555]" />}
        <p className="text-[11px] font-bold uppercase tracking-widest text-[#555]">
          {label}
        </p>
      </div>
      <div className="flex rounded-xl border border-white/[0.05] bg-[#050505] p-1">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={[
              "flex-1 rounded-lg py-2.5 text-xs font-bold transition-all duration-200",
              value === opt
                ? "bg-[#FFD000] text-black shadow-[0_0_20px_rgba(255,208,0,0.15)]"
                : "text-[#555] hover:text-[#999] hover:bg-white/[0.02]"
            ].join(' ')}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

function StockCard({ 
  stock, 
  inPortfolio, 
  onToggle 
}: { 
  stock: StockResult 
  inPortfolio: boolean 
  onToggle: () => void 
}) {
  const positive = stock.ytdReturn >= 0
  const m1Positive = stock.m1Return >= 0

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex flex-col gap-4 rounded-2xl border border-white/[0.05] bg-[#0a0a0a] p-5 transition-all hover:border-[#FFD000]/30 hover:bg-[#0f0f0f]"
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.03] font-black text-[#FFD000]">
            {stock.ticker.slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black tracking-tight">{stock.ticker}</h3>
              <span className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[10px] font-bold text-[#555]">
                {stock.sector}
              </span>
            </div>
            <p className="text-xs text-[#555]">{stock.name}</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className={[
            "flex h-9 w-9 items-center justify-center rounded-xl transition-all border",
            inPortfolio 
              ? "bg-[#FFD000] border-[#FFD000] text-black" 
              : "bg-transparent border-white/[0.05] text-[#555] hover:border-[#FFD000]/50 hover:text-[#FFD000]"
          ].join(' ')}
        >
          {inPortfolio ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </button>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#333] mb-1">Current Price</p>
          <div className="text-xl font-black tabular-nums">
            ${stock.currentPrice.toFixed(2)}
          </div>
        </div>
        
        <div className="h-8 w-px bg-white/[0.05]" />

        <div className="flex flex-col items-end">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#333] mb-1 text-right">Performance</p>
          <div className="flex gap-4">
            <div className="text-right">
              <p className="text-[9px] text-[#555] uppercase">YTD</p>
              <span className={["text-xs font-bold", positive ? "text-[#22c55e]" : "text-[#ef4444]"].join(' ')}>
                {positive ? "+" : ""}{stock.ytdReturn}%
              </span>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-[#555] uppercase">1M</p>
              <span className={["text-xs font-bold", m1Positive ? "text-[#22c55e]" : "text-[#ef4444]"].join(' ')}>
                {m1Positive ? "+" : ""}{stock.m1Return}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-xl bg-white/[0.02] p-3">
        <div className="flex-1">
          <SectorSparkline 
            data={stock.sparkData} 
            color="#FFD000" 
            width={140} 
            height={40} 
          />
        </div>
        <div className="text-right">
          <p className="text-[9px] font-bold uppercase tracking-widest text-[#333]">Regime Fit</p>
          <p className="text-sm font-black text-[#FFD000]">{stock.fit}%</p>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-[#777]">
        {stock.reason}
      </p>
    </MotionDiv>
  )
}

export default function StockScoutPage() {
  const router = useRouter()
  const { refreshUser } = useAuth()
  const { showToast } = useToast()
  
  const [risk, setRisk] = useState<Risk>("Balanced")
  const [horizon, setHorizon] = useState<Horizon>("1-3yr")
  const [sector, setSector] = useState("All Sectors")
  const [budget, setBudget] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [picks, setPicks] = useState<StockResult[]>([])
  const [portfolio, setPortfolio] = useState<StockResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [regime, setRegime] = useState<RegimeData | null>(null)

  useEffect(() => {
    const fetchRegime = async () => {
      try {
        const res = await fetch('/api/regime/status')
        const data = await res.json()
        setRegime({
          regime: data.regime,
          confidence: data.confidence,
          description: REGIME_DESCRIPTIONS[data.regime] || "Stable market conditions."
        })
      } catch (err) {
        console.error("Failed to fetch regime", err)
      }
    }
    fetchRegime()
  }, [])

  const awardPoints = async (points: number, reason: string) => {
    try {
      await fetch('/api/learn/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicSlug: `stock-scout-${reason.toLowerCase().replace(/\s+/g, '-')}`,
          topicName: `Stock Scout: ${reason}`,
          xpEarned: points,
          completed: true
        })
      })
      await refreshUser()
      showToast(`+${points} Zemen Points: ${reason}`, 'success')
    } catch (err) {
      console.error("Failed to award points", err)
    }
  }

  const handleGenerate = async () => {
    if (!budget || parseFloat(budget) <= 0) {
      setError("Please enter an approximate investment amount.")
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams({
        risk,
        horizon: horizon === '<1yr' ? 'Short' : horizon === '1-3yr' ? 'Medium' : 'Long',
        sector: sector === 'All Sectors' ? 'all' : sector,
        budget: budget
      })

      const res = await fetch(`/api/stocks?${params}`)
      const data = await res.json()

      if (data.success) {
        setPicks(data.stocks)
        awardPoints(100, "Generated Recommendations")
      } else {
        setError(data.error || "Failed to fetch recommendations")
      }
    } catch (err) {
      setError("Connection error. Try again.")
    } finally {
      setLoading(false)
    }
  }

  const inPortfolio = (ticker: string) =>
    portfolio.some(p => p.ticker === ticker)

  const togglePortfolio = (stock: StockResult) => {
    if (inPortfolio(stock.ticker)) {
      setPortfolio(prev => prev.filter(p => p.ticker !== stock.ticker))
    } else {
      setPortfolio(prev => [...prev, stock])
      awardPoints(50, `Added ${stock.ticker} to Portfolio`)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* ── Nav ── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.03] bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#555] transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Back</span>
          </button>
          
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-black uppercase tracking-[0.2em] text-white">Stock Scout</h1>
          </div>

          <div className="w-20" />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pt-28 pb-20">
        <div className="flex flex-col gap-8">
          
          {/* ── Current Regime Section ── */}
          {regime && (
            <MotionDiv
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-white/[0.05] bg-white/[0.02] p-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-[#FFD000] animate-pulse" />
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#555]">Current Macro Regime</p>
                  </div>
                  <h2 className="text-4xl font-black tracking-tight text-[#FFD000]">
                    {regime.regime}
                  </h2>
                  <p className="max-w-2xl text-sm leading-relaxed text-[#777]">
                    {regime.description}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#333] mb-1">System Confidence</p>
                  <div className="text-3xl font-black text-[#FFD000] tabular-nums">
                    {regime.confidence}%
                  </div>
                </div>
              </div>
            </MotionDiv>
          )}

          <div className="grid gap-8 lg:grid-cols-[350px_1fr]">
            {/* ── Sidebar Filters ── */}
            <aside className="space-y-6">
              <div className="rounded-3xl border border-white/[0.05] bg-[#050505] p-6 space-y-8">
                <div className="space-y-1">
                  <h3 className="text-lg font-black tracking-tight">Personalize Scout</h3>
                  <p className="text-xs text-[#555]">Align recommendations with your profile.</p>
                </div>

                <div className="space-y-6">
                  <SegmentedControl
                    label="Risk Tolerance"
                    icon={Target}
                    options={["Conservative", "Balanced", "Aggressive"] as Risk[]}
                    value={risk}
                    onChange={setRisk}
                  />

                  <SegmentedControl
                    label="Investment Horizon"
                    icon={Calendar}
                    options={["<1yr", "1-3yr", ">3yr"] as Horizon[]}
                    value={horizon}
                    onChange={setHorizon}
                  />

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Search className="h-3.5 w-3.5 text-[#555]" />
                      <p className="text-[11px] font-bold uppercase tracking-widest text-[#555]">Preferred Sector</p>
                    </div>
                    <div className="relative">
                      <select
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-white/[0.05] bg-[#050505] py-3 px-4 text-xs font-bold text-white focus:outline-none focus:border-[#FFD000]/50 transition-colors"
                      >
                        {SECTORS.map(s => <option key={s} value={s} className="bg-[#0a0a0a]">{s}</option>)}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#444]" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-3.5 w-3.5 text-[#555]" />
                      <p className="text-[11px] font-bold uppercase tracking-widest text-[#555]">Approximate Investment (USD)</p>
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444] font-bold text-xs">$</span>
                      <input
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        placeholder="e.g. 5000"
                        className="w-full rounded-xl border border-white/[0.05] bg-[#050505] py-3 pl-8 pr-4 text-xs font-bold text-white placeholder:text-[#333] focus:outline-none focus:border-[#FFD000]/50 transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-4 text-xs font-black text-black transition-all hover:bg-[#FFD000] active:scale-[0.98] disabled:opacity-40"
                  >
                    {loading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                    ) : (
                      "GENERATE RECOMMENDATIONS"
                    )}
                  </button>
                  
                  {picks.length > 0 && (
                    <button
                      onClick={() => setPicks([])}
                      className="w-full text-center text-[10px] font-bold uppercase tracking-widest text-[#444] hover:text-[#777] transition-colors"
                    >
                      Regenerate
                    </button>
                  )}
                </div>
              </div>

              {portfolio.length > 0 && (
                <MotionDiv
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4 rounded-3xl border border-white/[0.05] bg-[#050505] p-6"
                >
                  <div className="flex items-center gap-2 border-b border-white/[0.03] pb-4">
                    <Briefcase className="h-4 w-4 text-[#FFD000]" />
                    <h3 className="text-xs font-black uppercase tracking-widest">Virtual Portfolio</h3>
                    <span className="ml-auto rounded-full bg-[#FFD000] px-2 py-0.5 text-[10px] font-black text-black">
                      {portfolio.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {portfolio.map(p => (
                      <div key={p.ticker} className="flex items-center justify-between rounded-xl bg-white/[0.02] p-3 group">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black">{p.ticker}</span>
                          <span className="text-[10px] text-[#555] tabular-nums">${p.currentPrice.toFixed(2)}</span>
                        </div>
                        <button 
                          onClick={() => togglePortfolio(p)}
                          className="text-[#333] hover:text-red-400 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </MotionDiv>
              )}
            </aside>

            {/* ── Results Area ── */}
            <section className="space-y-6">
              {error && (
                <MotionDiv
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6"
                >
                  <div className="flex items-center gap-3">
                    <Info className="h-4 w-4 text-red-500" />
                    <p className="text-sm font-medium text-red-500/80">
                      {error}
                    </p>
                  </div>
                </MotionDiv>
              )}

              {!loading && picks.length === 0 && !error && (
                <div className="flex h-[500px] flex-col items-center justify-center text-center rounded-3xl border border-dashed border-white/[0.05]">
                  <div className="mb-6 rounded-full bg-white/[0.02] p-6">
                    <SlidersHorizontal className="h-12 w-12 text-[#222]" />
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-widest text-[#333]">Ready to Scout</h3>
                  <p className="max-w-[280px] mt-2 text-xs font-medium text-[#444] leading-relaxed">
                    Set your preferences and enter an investment amount to see personalized macro-aligned picks.
                  </p>
                </div>
              )}

              {picks.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/[0.03] pb-4">
                    <div>
                      <h2 className="text-sm font-black uppercase tracking-[0.2em]">Your Picks</h2>
                      <p className="text-[10px] text-[#555] font-medium mt-1">Found {picks.length} assets matching your {risk} profile.</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-[#FFD000]/10 px-3 py-1 border border-[#FFD000]/20">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#FFD000] animate-pulse" />
                      <span className="text-[10px] font-black text-[#FFD000] uppercase tracking-widest">Live Prices</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    {picks.map((stock) => (
                      <StockCard
                        key={stock.ticker}
                        stock={stock}
                        inPortfolio={inPortfolio(stock.ticker)}
                        onToggle={() => togglePortfolio(stock)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
