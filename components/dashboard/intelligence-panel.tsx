"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

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

function powerDots(power: number): string {
  return "●".repeat(power) + "○".repeat(5 - power);
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
    <section className="mt-5 rounded-2xl border border-white/10 border-t-2 border-t-[#FFD000] bg-[#111111] p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#FFD000]">Intelligence Panel</p>
          <h4 className="mt-1 text-sm text-zinc-200">
            {content.title} - {chartTitle}
          </h4>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-xs text-zinc-300 transition hover:border-[#FFD000]/50 hover:text-white"
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
        <div className="min-h-0 space-y-5 text-[14px] leading-7 text-zinc-300">
          <section className="border-t border-white/10 pt-4">
            <h5 className="text-xs uppercase tracking-[0.18em] text-[#FFD000]">What You Are Looking At</h5>
            <p className="mt-2">
              <span className="font-semibold text-zinc-100">What is this graph showing? </span>
              {content.what}
            </p>
            <p className="mt-2">
              <span className="font-semibold text-zinc-100">What is the unit? </span>
              {content.unit}
            </p>
            <div className="mt-3">
              <p>
                <span className="font-semibold text-zinc-100">What is a normal/healthy range? </span>
                {content.rangeTitle}
              </p>
              <div className="mt-2">
                <div
                  className="relative h-3 rounded-full"
                  style={{
                    background:
                      "linear-gradient(to right, #ef4444 0% 20%, #f59e0b 20% 40%, #22c55e 40% 60%, #f59e0b 60% 80%, #ef4444 80% 100%)",
                  }}
                >
                  <span
                    className="absolute -top-1 h-5 w-1 rounded bg-[#FFD000]"
                    style={{ left: `calc(${currentPosition}% - 2px)` }}
                  />
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-zinc-400">
                  {content.rangeZones.map((zone) => (
                    <span key={zone.label}>
                      {zone.label}: {zone.min} to {zone.max}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-3">
              <span className="font-semibold text-zinc-100">Current reading explained in one sentence: </span>
              {summary}
            </p>
          </section>

          <section className="border-t border-white/10 pt-4">
            <h5 className="text-xs uppercase tracking-[0.18em] text-[#FFD000]">Why This Number Matters</h5>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div>
                <p className="font-semibold text-zinc-100">When this number is HIGH it usually means...</p>
                <ul className="mt-1 list-disc space-y-1 pl-5">
                  {content.highMeans.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold text-zinc-100">When this number is LOW it usually means...</p>
                <ul className="mt-1 list-disc space-y-1 pl-5">
                  {content.lowMeans.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold text-zinc-100">When this number is RISING it usually means...</p>
                <ul className="mt-1 list-disc space-y-1 pl-5">
                  {content.risingMeans.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold text-zinc-100">When this number is FALLING it usually means...</p>
                <ul className="mt-1 list-disc space-y-1 pl-5">
                  {content.fallingMeans.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="border-t border-white/10 pt-4">
            <h5 className="text-xs uppercase tracking-[0.18em] text-[#FFD000]">What Affects This Number</h5>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {content.factors.map((factor) => (
                <article
                  key={factor.name}
                  className="rounded-xl border border-white/10 bg-[#1a1a1a] p-3 transition hover:border-[#FFD000]/60"
                >
                  <p className="font-semibold text-zinc-100">{factor.name}</p>
                  <p className="mt-1 text-xs text-[#FFD000]">Direction: {factor.direction}</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">{factor.explanation}</p>
                  <p className="mt-2 text-xs text-zinc-400">Effect speed: {factor.speed}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="border-t border-white/10 pt-4">
            <h5 className="text-xs uppercase tracking-[0.18em] text-[#FFD000]">Key Players</h5>
            <div className="mt-3 grid gap-3 lg:grid-cols-3">
              {content.players.map((player) => (
                <article
                  key={player.name}
                  className="rounded-xl border border-white/10 bg-[#1a1a1a] p-3 transition hover:border-[#FFD000]/60"
                >
                  <p className="font-semibold text-zinc-100">{player.name}</p>
                  <p className="mt-1 text-xs text-zinc-400">Type: {player.type}</p>
                  <p className="mt-2 text-sm leading-6">{player.role}</p>
                  <p className="mt-2 text-xs text-[#FFD000]">Power: {powerDots(player.power)}</p>
                  <p className="mt-2 text-xs text-zinc-400">Example: {player.example}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="border-t border-white/10 pt-4">
            <h5 className="text-xs uppercase tracking-[0.18em] text-[#FFD000]">Historical Context Timeline</h5>
            <div className="mt-3 overflow-x-auto pb-2">
              <div className="relative min-w-[560px] px-3">
                <div className="absolute top-4 left-3 right-3 h-[2px] bg-zinc-700" />
                <div className="relative flex items-start justify-between gap-4">
                  {content.timeline.map((event, index) => (
                    <button
                      key={`${event.year}-${event.event}`}
                      type="button"
                      onClick={() => setSelectedEvent(index)}
                      className="flex w-24 flex-col items-center text-center"
                    >
                      <span
                        className={`h-3 w-3 rounded-full border ${
                          selectedEvent === index
                            ? "border-[#FFD000] bg-[#FFD000]"
                            : "border-[#FFD000]/70 bg-[#111111]"
                        }`}
                      />
                      <span className="mt-2 text-xs text-zinc-300">{event.year}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-3 rounded-lg border border-white/10 bg-[#1a1a1a] p-3">
              <p className="font-semibold text-zinc-100">{content.timeline[selectedEvent]?.event}</p>
              <p className="mt-1 text-xs text-[#FFD000]">{content.timeline[selectedEvent]?.move}</p>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                {content.timeline[selectedEvent]?.explanation}
              </p>
            </div>
          </section>

          <section className="border-t border-white/10 pt-4">
            <h5 className="text-xs uppercase tracking-[0.18em] text-[#FFD000]">
              Why this matters right now (2025-2026)
            </h5>
            <div className="mt-2 space-y-3">
              {content.nowContext.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

