"use client";

import { useMemo, useState } from "react";
import { ChevronDown, BrainCircuit } from "lucide-react";

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
};

export function IntelligencePanel({ topicSlug, chartTitle, rows }: IntelligencePanelProps) {
  const content: IndicatorIntelligence | undefined = INTELLIGENCE_CONTENT[topicSlug];
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(0);

  const currentValue = useMemo(() => {
    if (!content) return null;
    return getCurrentValue(rows, content.primarySeriesKey);
  }, [content, rows]);

  if (!content) return null;

  const summary = content.currentSummaryTemplate.replace("{value}", formatNumber(currentValue));
  const currentPosition = markerLeftPct(currentValue, content.rangeZones);

  return (
    <section className="mt-5 rounded-2xl border border-white/[0.07] bg-[#0e0e10] overflow-hidden">
      {/* Top accent line */}
      <div className="h-[1px] w-full bg-white/15" />

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.06] border border-white/[0.07]">
              <BrainCircuit className="h-3.5 w-3.5 text-zinc-300" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[2px] text-white/50 font-semibold">Intelligence Panel</p>
              <h4 className="mt-0.5 text-sm text-zinc-200 font-medium">
                {content.title} — {chartTitle}
              </h4>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.10] px-3 py-1 text-xs text-zinc-400 transition hover:border-white/20 hover:text-zinc-200"
          >
            <span>{open ? "Collapse" : "Expand"}</span>
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`}
              aria-hidden
            />
          </button>
        </div>

        <div
          className={`grid overflow-hidden transition-all duration-300 ease-out ${
            open ? "mt-4 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-60"
          }`}
        >
          <div className="min-h-0 space-y-6 text-[14px] leading-7 text-zinc-300">
            <section className="border-t border-white/[0.06] pt-5">
              <h5 className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 font-semibold mb-3">
                What You&apos;re Looking At
              </h5>
              <p className="mb-2 text-sm text-zinc-400 leading-relaxed">
                <span className="font-semibold text-zinc-200">What is this graph showing? </span>
                {content.what}
              </p>
              <p className="mb-3 text-sm text-zinc-400 leading-relaxed">
                <span className="font-semibold text-zinc-200">What is the unit? </span>
                {content.unit}
              </p>

              {/* Range gauge */}
              <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4">
                <p className="text-sm text-zinc-400 mb-3 leading-relaxed">
                  <span className="font-semibold text-zinc-200">Normal/healthy range: </span>
                  {content.rangeTitle}
                </p>
                <div
                  className="relative h-2.5 rounded-full"
                  style={{
                    background:
                      "linear-gradient(to right, #ef4444 0% 20%, #ffffff 20% 40%, #22c55e 40% 60%, #ffffff 60% 80%, #ef4444 80% 100%)",
                  }}
                >
                  <span
                    className="absolute -top-1 h-4.5 w-1 rounded-full bg-white shadow-lg"
                    style={{ left: `calc(${currentPosition}% - 2px)` }}
                  />
                </div>
                <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-zinc-500">
                  {content.rangeZones.map((zone) => (
                    <span key={zone.label}>
                      {zone.label}: {zone.min}–{zone.max}
                    </span>
                  ))}
                </div>
              </div>

              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                <span className="font-semibold text-zinc-200">Current reading: </span>
                {summary}
              </p>
            </section>

            <section className="border-t border-white/[0.06] pt-5">
              <h5 className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 font-semibold mb-4">
                Why This Number Matters
              </h5>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  { label: "When HIGH it means…", items: content.highMeans },
                  { label: "When LOW it means…", items: content.lowMeans },
                  { label: "When RISING it means…", items: content.risingMeans },
                  { label: "When FALLING it means…", items: content.fallingMeans },
                ].map(({ label, items }) => (
                  <div key={label} className="rounded-xl border border-white/[0.06] bg-black/20 p-3.5">
                    <p className="font-semibold text-zinc-300 text-xs mb-2">{label}</p>
                    <ul className="space-y-1.5">
                      {items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-xs text-zinc-500 leading-relaxed">
                          <span className="mt-1.5 h-1 w-1 rounded-full bg-white/20 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section className="border-t border-white/[0.06] pt-5">
              <h5 className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 font-semibold mb-4">
                What Affects This Number
              </h5>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {content.factors.map((factor) => (
                  <article
                    key={factor.name}
                    className="rounded-xl border border-white/[0.06] bg-black/20 p-3.5 transition hover:border-white/[0.12]"
                  >
                    <p className="font-semibold text-zinc-200 text-sm">{factor.name}</p>
                    <p className="mt-1 text-[11px] text-zinc-500">Direction: {factor.direction}</p>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-400">{factor.explanation}</p>
                    <p className="mt-2 text-[10px] text-zinc-600">Speed: {factor.speed}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="border-t border-white/[0.06] pt-5">
              <h5 className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 font-semibold mb-4">Key Players</h5>
              <div className="grid gap-3 lg:grid-cols-3">
                {content.players.map((player) => (
                  <article
                    key={player.name}
                    className="rounded-xl border border-white/[0.06] bg-black/20 p-3.5 transition hover:border-white/[0.12]"
                  >
                    <p className="font-semibold text-zinc-200 text-sm">{player.name}</p>
                    <p className="mt-1 text-[11px] text-zinc-500">Type: {player.type}</p>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-400">{player.role}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[10px] text-zinc-600">Power:</span>
                      <PowerDots power={player.power} />
                    </div>
                    <p className="mt-2 text-[10px] text-zinc-600">Example: {player.example}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="border-t border-white/[0.06] pt-5">
              <h5 className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 font-semibold mb-4">
                Historical Context Timeline
              </h5>
              <div className="overflow-x-auto pb-2">
                <div className="relative min-w-[560px] px-3">
                  <div className="absolute top-[7px] left-3 right-3 h-[1px] bg-white/[0.08]" />
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
                              : "border-white/20 bg-[#0e0e10] group-hover:border-white/40"
                          }`}
                        />
                        <span className="mt-2 text-[11px] text-zinc-400">{event.year}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-3 rounded-xl border border-white/[0.07] bg-black/20 p-4">
                <p className="font-semibold text-zinc-200 text-sm">{content.timeline[selectedEvent]?.event}</p>
                <p className="mt-1 text-xs text-zinc-500">{content.timeline[selectedEvent]?.move}</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {content.timeline[selectedEvent]?.explanation}
                </p>
              </div>
            </section>

            <section className="border-t border-white/[0.06] pt-5">
              <h5 className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 font-semibold mb-3">
                Why This Matters Right Now (2025–2026)
              </h5>
              <div className="space-y-3">
                {content.nowContext.map((paragraph) => (
                  <p key={paragraph} className="text-sm text-zinc-400 leading-relaxed">{paragraph}</p>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
