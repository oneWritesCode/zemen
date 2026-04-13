import Link from "next/link";

import { LandingNavbar } from "@/components/landing/landing-navbar";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0b] text-zinc-100">
      <LandingNavbar />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(255, 204, 0, 0.2), transparent), radial-gradient(ellipse 60% 40% at 100% 50%, rgba(96, 165, 250, 0.08), transparent)",
        }}
      />
      <div className="relative mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-5xl flex-col justify-center px-6 py-16 sm:px-10 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#ffcc00]">
          Zemen
        </p>
        <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl">
          A macro regime detector for markets
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
          Ingest Federal Reserve Economic Data, cluster historical regimes, and
          study how asset classes behaved in each environment — starting with
          live FRED dashboards for rates, inflation, gold, equities, and more.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/dashboard"
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#ffcc00] px-8 text-sm font-semibold text-black transition hover:bg-[#e6b800]"
          >
            Open dashboard
          </Link>
          <a
            href="https://fred.stlouisfed.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-zinc-400 underline-offset-4 hover:text-zinc-200 hover:underline"
          >
            FRED data
          </a>
        </div>
        <p className="mt-16 text-xs text-zinc-600">
          Set <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-zinc-400">FRED_API_KEY</code> in{" "}
          <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-zinc-400">.env</code> or{" "}
          <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-zinc-400">.env.local</code> to load series.
        </p>
      </div>
    </div>
  );
}
