"use client";

import { useMemo, useState } from "react";
import { BrainCircuit } from "lucide-react";

import type { ChartRow } from "@/lib/fred/get-topic-dataset";
import {
  INTELLIGENCE_CONTENT,
  type IndicatorIntelligence,
  type RangeZone,
} from "@/lib/intelligence/intelligence-content";

function getCurrentValue(rows: ChartRow[], key: string): number | null {
  const last = rows[rows.length - 1];
  if (!last) return null;
  const value = last[key];
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function formatNumber(value: number | null): string {
  if (value == null) return "N/A";
  if (Math.abs(value) >= 1000) return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
  return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

function markerLeftPct(value: number | null, zones: RangeZone[]): number {
  const min = zones[0]?.min ?? 0;
  const max = zones[zones.length - 1]?.max ?? 1;
  if (value == null || min === max) return 50;
  const clamped = Math.min(max, Math.max(min, value));
  return ((clamped - min) / (max - min)) * 100;
}

function PowerDots({ power }: { power: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full ${i < power ? "bg-white/60" : "bg-white/10"}`}
        />
      ))}
    </div>
  );
}

type IntelligencePanelProps = {
  topicSlug: string;
  chartTitle: string;
  rows: ChartRow[];
  variant?: 'default' | 'ghost';
};

export function IntelligencePanel({ topicSlug, chartTitle, rows, variant = 'default' }: IntelligencePanelProps) {
  const content: IndicatorIntelligence | undefined = INTELLIGENCE_CONTENT[topicSlug];
  const [selectedEvent, setSelectedEvent] = useState(0);

  const currentValue = useMemo(() => {
    if (!content) return null;
    return getCurrentValue(rows, content.primarySeriesKey);
  }, [content, rows]);

  if (!content) return null;

  const summary = content.currentSummaryTemplate.replace("{value}", formatNumber(currentValue));
  const currentPosition = markerLeftPct(currentValue, content.rangeZones);

  const containerClasses = variant === 'ghost' 
    ? "intelligence-panel" 
    : "mt-5 rounded-2xl border border-[#111] bg-[#0d0d0d] overflow-hidden intelligence-panel";

  return (
    <section className={containerClasses}>
      {/* Top accent line */}
      {variant === 'default' && <div className="h-[1px] w-full bg-white/[0.08]" />}

      <div className={variant === 'default' ? "p-4 sm:p-5" : ""}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06]">
              <BrainCircuit className="h-3.5 w-3.5 text-[#888]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] uppercase tracking-[2px] text-[#999] font-bold truncate">Intelligence Panel</p>
              <h4 className="mt-0.5 text-sm text-[#ddd] font-medium truncate">
                {content.title} — {chartTitle}
              </h4>
            </div>
          </div>
        </div>

        <div
          className="grid overflow-hidden transition-all duration-300 ease-out mt-4 grid-rows-[1fr] opacity-100"
        >
          <div className="min-h-0 space-y-6 text-[14px] leading-7 text-[#bbb]">
            <section className="border-t border-[#151515] pt-5">
              <h5 className="text-[10px] uppercase tracking-[0.18em] text-[#999] font-bold mb-3">
                What You&apos;re Looking At
              </h5>
              <p className="mb-2 text-sm text-[#bbb] leading-relaxed">
                <span className="font-semibold text-[#eee]">What is this graph showing? </span>
                {content.what}
              </p>
              <p className="mb-3 text-sm text-[#bbb] leading-relaxed">
                <span className="font-semibold text-[#eee]">What is the unit? </span>
                {content.unit}
              </p>

              {/* Range gauge */}
              <div className="rounded-xl border border-[#111] bg-[#080808] p-4">
                <p className="text-sm text-[#bbb] mb-3 leading-relaxed">
                  <span className="font-semibold text-[#eee]">Normal/healthy range: </span>
                  {content.rangeTitle}
                </p>
                <div
                  className="relative h-2.5 rounded-full"
                  style={{
                    background:
                      "linear-gradient(to right, #ef4444 0% 20%, #f59e0b 20% 40%, #22c55e 40% 60%, #f59e0b 60% 80%, #ef4444 80% 100%)",
                  }}
                >
                  <span
                    className="absolute -top-1 h-4.5 w-1 rounded-full bg-white shadow-lg"
                    style={{ left: `calc(${currentPosition}% - 2px)` }}
                  />
                </div>
                <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-[#999]">
                  {content.rangeZones.map((zone) => (
                    <span key={zone.label}>
                      {zone.label}: {zone.min}–{zone.max}
                    </span>
                  ))}
                </div>
              </div>

              <p className="mt-3 text-sm text-[#bbb] leading-relaxed">
                <span className="font-semibold text-[#eee]">Current reading: </span>
                {summary}
              </p>
            </section>

            <section className="border-t border-[#151515] pt-5">
              <h5 className="text-[10px] uppercase tracking-[0.18em] text-[#999] font-bold mb-4">
                Why This Number Matters
              </h5>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  { label: "When HIGH it means…", items: content.highMeans },
                  { label: "When LOW it means…", items: content.lowMeans },
                  { label: "When RISING it means…", items: content.risingMeans },
                  { label: "When FALLING it means…", items: content.fallingMeans },
                ].map(({ label, items }) => (
                  <div key={label} className="rounded-xl border border-[#111] bg-[#080808] p-3.5">
                    <p className="font-semibold text-[#ddd] text-xs mb-2">{label}</p>
                    <ul className="space-y-1.5">
                      {items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-xs text-[#bbb] leading-relaxed">
                          <span className="mt-1.5 h-1 w-1 rounded-full bg-white/20 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section className="border-t border-[#151515] pt-5">
              <h5 className="text-[10px] uppercase tracking-[0.18em] text-[#999] font-bold mb-4">
                What Affects This Number
              </h5>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {content.factors.map((factor) => (
                  <article
                    key={factor.name}
                    className="rounded-xl border border-[#111] bg-[#080808] p-3.5 transition hover:border-white/[0.08]"
                  >
                    <p className="font-semibold text-[#ddd] text-sm">{factor.name}</p>
                    <p className="mt-1 text-[11px] text-[#999]">Direction: {factor.direction}</p>
                    <p className="mt-2 text-xs leading-relaxed text-[#bbb]">{factor.explanation}</p>
                    <p className="mt-2 text-[10px] text-[#666]">Speed: {factor.speed}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="border-t border-[#151515] pt-5">
              <h5 className="text-[10px] uppercase tracking-[0.18em] text-[#999] font-bold mb-4">Key Players</h5>
              <div className="grid gap-3 lg:grid-cols-3">
                {content.players.map((player) => (
                  <article
                    key={player.name}
                    className="rounded-xl border border-[#111] bg-[#080808] p-3.5 transition hover:border-white/[0.08]"
                  >
                    <p className="font-semibold text-[#ddd] text-sm">{player.name}</p>
                    <p className="mt-1 text-[11px] text-[#999]">Type: {player.type}</p>
                    <p className="mt-2 text-xs leading-relaxed text-[#bbb]">{player.role}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[10px] text-[#666]">Power:</span>
                      <PowerDots power={player.power} />
                    </div>
                    <p className="mt-2 text-[10px] text-[#666]">Example: {player.example}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="border-t border-[#151515] pt-5">
              <h5 className="text-[10px] uppercase tracking-[0.18em] text-[#999] font-bold mb-4">
                Historical Context Timeline
              </h5>
              <div className="overflow-x-auto pb-2">
                <div className="relative min-w-[560px] px-3">
                  <div className="absolute top-[7px] left-3 right-3 h-[1px] bg-white/[0.04]" />
                  <div className="relative flex items-start justify-between gap-4">
                    {content.timeline.map((event, index) => (
                      <button
                        key={`${event.year}-${event.event}`}
                        type="button"
                        onClick={() => setSelectedEvent(index)}
                        className="flex w-24 flex-col items-center text-center group"
                      >
                        <span
                          className={`h-3.5 w-3.5 rounded-full border-2 transition-all ${
                            selectedEvent === index
                              ? "border-white bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                              : "border-white/10 bg-[#050505] group-hover:border-white/40"
                          }`}
                        />
                        <span className="mt-2 text-[11px] text-[#999]">{event.year}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-3 rounded-xl border border-[#111] bg-[#080808] p-4">
                <p className="font-semibold text-[#999] text-sm">{content.timeline[selectedEvent]?.event}</p>
                <p className="mt-1 text-xs text-[#999]">{content.timeline[selectedEvent]?.move}</p>
                <p className="mt-2 text-sm leading-relaxed text-[#bbb]">
                  {content.timeline[selectedEvent]?.explanation}
                </p>
              </div>
            </section>

            <section className="border-t border-[#151515] pt-5">
              <h5 className="text-[10px] uppercase tracking-[0.18em] text-[#999] font-bold mb-3">
                Why This Matters Right Now (2025–2026)
              </h5>
              <div className="space-y-3">
                {content.nowContext.map((paragraph) => (
                  <p key={paragraph} className="text-sm text-[#bbb] leading-relaxed">{paragraph}</p>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
