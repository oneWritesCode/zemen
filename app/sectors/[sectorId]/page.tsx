import Link from "next/link";
import { notFound } from "next/navigation";
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
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Clock,
  ChevronLeft,
} from "lucide-react";

import { getRegimeAnalysis } from "@/lib/regime/get-analysis";
import { REGIME_BY_ID } from "@/lib/regime/types";
import { SECTOR_BY_ID, type SectorId } from "@/lib/sectors/sector-config";
import { getSectorFit } from "@/lib/sectors/regime-sector";
import { getSectorDetailData } from "@/lib/sectors/yahoo-etf";
import { SectorPerformanceChart } from "@/components/sectors/sector-performance-chart";
import { CompanyLogo } from "@/components/CompanyLogo";

import { Breadcrumb } from "@/components/ui/breadcrumb";

export const dynamic = "force-dynamic";

const SECTOR_ICONS: Record<string, React.ElementType> = {
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

function formatSignedPct(p: number | null) {
  if (p == null || !Number.isFinite(p)) return "—";
  const sign = p >= 0 ? "+" : "";
  return `${sign}${p.toFixed(2)}%`;
}

function volatilityText(p: number | null) {
  if (p == null || !Number.isFinite(p)) return "—";
  return `${p.toFixed(2)}%`;
}

function isPositive(p: number | null): boolean {
  return p != null && Number.isFinite(p) && p >= 0;
}

export default async function SectorDetailPage({
  params,
}: {
  params: Promise<{ sectorId: string }>;
}) {
  const { sectorId } = await params;
  if (!SECTOR_BY_ID[sectorId as SectorId]) notFound();

  const sector = SECTOR_BY_ID[sectorId as SectorId]!;

  const analysis = await getRegimeAnalysis();
  const regime = analysis.current.regime;
  const regimeMeta = REGIME_BY_ID[regime];

  const fit = getSectorFit(regime, sector.id);
  const detail = await getSectorDetailData(sector.id);

  const Icon = SECTOR_ICONS[sector.id] ?? Activity;
  const whyNow = sector.whyNowByRegime[regime] ?? "Sector conditions are evolving with the macro cycle.";

  const fitConfig = {
    HOT: { bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.25)", text: "#4ade80", label: "Hot" },
    NEUTRAL: { bg: "rgba(255,255,255,0.06)", border: "rgba(255,255,255,0.15)", text: "#fff", label: "Neutral" },
    COLD: { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.25)", text: "#f87171", label: "Cold" },
  }[fit];

  return (
    <div className="min-h-screen bg-black text-zinc-100 pb-28">
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <Breadcrumb 
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Sectors', href: '/sectors' },
            { label: sector.name, href: null }
          ]} 
        />

        {/* Back button */}
        <Link
          href="/sectors"
          className="inline-flex items-center gap-1.5 text-[13px] text-[#666] hover:text-white transition-colors mt-2 mb-8"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          All Sectors
        </Link>

        {/* ─── Hero Section ─── */}
        <section className="relative rounded-3xl overflow-hidden mb-10">
          {/* Background glow using sector color */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(ellipse 80% 60% at 20% 20%, ${sector.color}20, transparent 60%)`,
            }}
          />
          <div className="relative z-10 p-8 sm:p-12">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                {/* Icon + Name */}
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{
                      background: `${sector.color}15`,
                    }}
                  >
                    <Icon className="w-7 h-7" style={{ color: sector.color }} />
                  </div>
                  <div>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight">{sector.name}</h1>
                    <p className="text-[13px] text-[#666] mt-0.5">{sector.ticker} · {sector.plainEnglish}</p>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-3 mt-5">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider"
                    style={{
                      background: fitConfig.bg,
                      border: `1px solid ${fitConfig.border}`,
                      color: fitConfig.text,
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: fitConfig.text }} />
                    {fit} Regime Fit
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.04] px-3 py-1.5 text-xs text-[#888]">
                    Current: <span style={{ color: regimeMeta.color }} className="font-semibold">{regimeMeta.label}</span>
                  </span>
                </div>

                {/* Why now */}
                <p className="mt-6 text-[15px] text-[#aaa] leading-relaxed max-w-2xl">
                  In a <span style={{ color: regimeMeta.color }} className="font-semibold">{regimeMeta.label}</span> environment,{" "}
                  <span className="font-semibold text-white">{sector.name}</span> typically{" "}
                  {fit === "HOT" ? "outperforms" : fit === "COLD" ? "struggles" : "performs in a mixed way"}{" "}
                  because {whyNow}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── KPI Metric Cards ─── */}
        <section className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-10">
          {[
            {
              label: "YTD Return",
              value: formatSignedPct(detail.metrics.ytdReturnPct),
              positive: isPositive(detail.metrics.ytdReturnPct),
              sub: `vs S&P: ${formatSignedPct(detail.metrics.ytdSpReturnPct)}`,
            },
            {
              label: "1Y Return",
              value: formatSignedPct(detail.metrics.return1yPct),
              positive: isPositive(detail.metrics.return1yPct),
            },
            {
              label: "3Y Return",
              value: formatSignedPct(detail.metrics.return3yPct),
              positive: isPositive(detail.metrics.return3yPct),
            },
            {
              label: "Volatility",
              value: volatilityText(detail.metrics.volatilityAnnualizedPct),
              positive: null,
              sub: "Annualized",
            },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="group relative rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:translate-y-[-2px]"
              style={{ background: "#0a0a0a" }}
            >
              {/* Subtle top accent bar */}
              <div
                className="absolute top-0 left-4 right-4 h-[2px] rounded-full opacity-40"
                style={{ background: sector.color }}
              />
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#555] mb-3">
                {kpi.label}
              </div>
              <div className="flex items-end gap-2">
                <span
                  className="font-mono text-3xl sm:text-4xl font-bold tracking-tight"
                  style={{
                    color:
                      kpi.positive === null
                        ? "#fff"
                        : kpi.positive
                          ? "#4ade80"
                          : "#f87171",
                  }}
                >
                  {kpi.value}
                </span>
                {kpi.positive !== null && kpi.value !== "—" && (
                  kpi.positive ? (
                    <ArrowUpRight className="w-5 h-5 text-emerald-400 mb-1" />
                  ) : (
                    <ArrowDownRight className="w-5 h-5 text-red-400 mb-1" />
                  )
                )}
              </div>
              {kpi.sub && (
                <div className="mt-2 text-[11px] text-[#555]">{kpi.sub}</div>
              )}
            </div>
          ))}
        </section>

        {/* Subtle data quality note */}
        {!detail.success ? (
          <div className="mb-6 flex items-center gap-2 text-[11px] text-[#444]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#444]" />
            Using approximate data — live feed reconnecting for {sector.ticker}.
          </div>
        ) : null}

        {/* ─── Performance Chart ─── */}
        <section className="mb-10 rounded-3xl overflow-hidden" style={{ background: "#0a0a0a" }}>
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4" style={{ color: sector.color }} />
              <h2 className="text-lg font-bold">Price Performance</h2>
            </div>
            <p className="text-[12px] text-[#555] mb-6">Sector ETF vs S&P 500 benchmark</p>
            <SectorPerformanceChart
              sectorMonthly={detail.sectorMonthly}
              spMonthly={detail.spMonthly}
              sectorName={sector.name}
            />
          </div>
        </section>

        {/* ─── Key Drivers ─── */}
        <section className="mb-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Key Drivers</h2>
            <p className="mt-1 text-[13px] text-[#555]">
              What makes {sector.name} go up or down in the current environment.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sector.factors.map((f) => (
              <div
                key={f.name}
                className="group rounded-2xl p-5 transition-all duration-200 hover:translate-y-[-2px]"
                style={{ background: "#0a0a0a" }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-[14px] font-semibold text-white leading-snug">{f.name}</h3>
                  <span
                    className="shrink-0 inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold"
                    style={{
                      background: f.direction === "up" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                      color: f.direction === "up" ? "#4ade80" : "#f87171",
                    }}
                  >
                    {f.direction === "up" ? "↑" : "↓"} {f.impactLabel}
                  </span>
                </div>
                <p className="text-[13px] text-[#888] leading-relaxed">{f.explanation}</p>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#444]">
                  <Clock className="w-3 h-3" />
                  {f.speed}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Companies ─── */}
        <section className="mb-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Notable Companies</h2>
            <p className="mt-1 text-[13px] text-[#555]">
              Major companies operating in the {sector.name.toLowerCase()} space.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {sector.companies.map((c) => (
              <div
                key={c.ticker}
                className="group flex items-center gap-3 rounded-2xl p-4 transition-all duration-200 hover:translate-y-[-2px]"
                style={{ background: "#0a0a0a" }}
              >
                <CompanyLogo ticker={c.ticker} name={c.ticker} size={36} />
                <div>
                  <span className="text-sm font-bold text-white">{c.ticker}</span>
                  {c.name && <p className="text-[11px] text-[#555] mt-0.5">{c.name}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Trends ─── */}
        {sector.trends && sector.trends.length > 0 && (
          <section className="mb-10">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Emerging Trends</h2>
              <p className="mt-1 text-[13px] text-[#555]">
                Secular shifts worth watching in {sector.name.toLowerCase()}.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sector.trends.map((t) => (
                <div
                  key={t.name}
                  className="rounded-2xl p-5 transition-all duration-200 hover:translate-y-[-2px]"
                  style={{ background: "#0a0a0a" }}
                >
                  <h3 className="text-[14px] font-bold text-white mb-2">{t.name}</h3>
                  <p className="text-[13px] text-[#888] leading-relaxed mb-4">{t.whyEmerging}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {t.bestPositioned.map((ticker) => (
                      <span
                        key={ticker}
                        className="rounded-md px-2 py-0.5 text-[11px] font-semibold"
                        style={{ background: `${sector.color}15`, color: sector.color }}
                      >
                        {ticker}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#555]">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{t.timeline}</span>
                    <span
                      className="font-semibold"
                      style={{
                        color: t.risk === "Low" ? "#4ade80" : t.risk === "Medium" ? "#fbbf24" : "#f87171"
                      }}
                    >
                      {t.risk} risk
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Fixed disclaimer banner */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-3 text-[10px] text-[#333] leading-relaxed">
          Zemen Sectors is for educational and informational purposes only. Nothing on this page constitutes financial advice, investment recommendations, or an offer to buy or sell securities. Always do your own research and consult a qualified financial advisor before investing. Past performance does not guarantee future results.
        </div>
      </div>
    </div>
  );
}
