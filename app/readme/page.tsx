import { PresentationShell } from "@/components/site/presentation-shell";
import Link from "next/link";

export default function ReadmePage() {
  return (
    <PresentationShell>
      <article className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <header className="section-reveal rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">README</p>
          <h1 className="mt-3 text-5xl font-bold text-zinc-100 sm:text-6xl">ZEMEN — Macro Intelligence</h1>
        </header>

        <section className="section-reveal mt-12 space-y-6">
          <h2 className="text-3xl font-semibold text-[#FFD000]">What is Zemen?</h2>
          <p className="text-lg leading-relaxed text-zinc-300">
            Zemen is a macro intelligence app that watches economic indicators and translates them into one
            simple story. Instead of asking you to interpret raw charts, it tells you the current economic
            regime, how confident it is, and what similar periods looked like in history.
          </p>
        </section>

        <section className="section-reveal mt-12 space-y-6">
          <h2 className="text-3xl font-semibold text-[#FFD000]">The Problem</h2>
          <p className="text-lg leading-relaxed text-zinc-300">
            Existing tools are often fragmented or too technical. You usually need many tabs, financial
            jargon, and lots of time to connect inflation, jobs, growth, and rates into one clear picture.
            Zemen closes that gap.
          </p>
        </section>

        <section className="section-reveal mt-12 space-y-6">
          <h2 className="text-3xl font-semibold text-[#FFD000]">How It Works</h2>
          <p className="text-lg leading-relaxed text-zinc-300">
            Zemen runs a pipeline that fetches macro data, cleans it, and builds comparable monthly
            snapshots. It then applies clustering (a machine learning method that groups similar patterns)
            using models like KMeans and Gaussian Mixture Model to detect economic regimes. The app is
            deployed on Zerve and serves an interactive front end plus API responses.
          </p>
        </section>

        <section className="section-reveal mt-12 space-y-6">
          <h2 className="text-3xl font-semibold text-[#FFD000]">Data Sources</h2>
          <div className="overflow-hidden rounded-xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-zinc-200">
                <tr>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">What it provides</th>
                  <th className="px-4 py-3">Update frequency</th>
                </tr>
              </thead>
              <tbody className="text-zinc-300">
                <tr className="border-t border-white/10">
                  <td className="px-4 py-3">FRED</td>
                  <td className="px-4 py-3">10+ macroeconomic indicators</td>
                  <td className="px-4 py-3">Daily/Monthly</td>
                </tr>
                <tr className="border-t border-white/10">
                  <td className="px-4 py-3">Federal Reserve</td>
                  <td className="px-4 py-3">Interest rate decisions</td>
                  <td className="px-4 py-3">As announced</td>
                </tr>
                <tr className="border-t border-white/10">
                  <td className="px-4 py-3">BLS</td>
                  <td className="px-4 py-3">Unemployment and CPI</td>
                  <td className="px-4 py-3">Monthly</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="section-reveal mt-12 space-y-4">
          <h2 className="text-3xl font-semibold text-[#FFD000]">Tech Stack</h2>
          <ul className="list-disc space-y-1 pl-6 text-zinc-300">
            <li>Platform: Zerve AI</li>
            <li>Language: Python</li>
            <li>ML: Scikit-learn (KMeans / Gaussian Mixture Model)</li>
            <li>Visualization: Plotly + Streamlit</li>
            <li>Data: FRED API via fredapi library</li>
            <li>Deployment: Zerve Hosted App + API endpoint</li>
          </ul>
        </section>

        <section className="section-reveal mt-12 space-y-6">
          <h2 className="text-3xl font-semibold text-[#FFD000]">The 5 Regimes</h2>
          <div className="overflow-hidden rounded-xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-zinc-200">
                <tr>
                  <th className="px-4 py-3">Regime</th>
                  <th className="px-4 py-3">Key signals</th>
                  <th className="px-4 py-3">Typical duration</th>
                </tr>
              </thead>
              <tbody className="text-zinc-300">
                <tr className="border-t border-white/10">
                  <td className="px-4 py-3">Goldilocks</td>
                  <td className="px-4 py-3">Steady growth, controlled inflation</td>
                  <td className="px-4 py-3">1-3 years</td>
                </tr>
                <tr className="border-t border-white/10">
                  <td className="px-4 py-3">Recovery</td>
                  <td className="px-4 py-3">Growth returns after slowdown</td>
                  <td className="px-4 py-3">1-2 years</td>
                </tr>
                <tr className="border-t border-white/10">
                  <td className="px-4 py-3">Overheating</td>
                  <td className="px-4 py-3">High demand, rising inflation pressure</td>
                  <td className="px-4 py-3">6-18 months</td>
                </tr>
                <tr className="border-t border-white/10">
                  <td className="px-4 py-3">Stagflation</td>
                  <td className="px-4 py-3">High inflation with weak growth</td>
                  <td className="px-4 py-3">1-3 years</td>
                </tr>
                <tr className="border-t border-white/10">
                  <td className="px-4 py-3">Recession</td>
                  <td className="px-4 py-3">Shrinking output, job losses</td>
                  <td className="px-4 py-3">6-18 months</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="section-reveal mt-12 space-y-4">
          <h2 className="text-3xl font-semibold text-[#FFD000]">Features</h2>
          <ul className="list-disc space-y-1 pl-6 text-zinc-300">
            <li>Live macro dashboard with topic-level visualizations</li>
            <li>Regime detection with confidence score</li>
            <li>Historical playbook for stocks, gold, and bonds</li>
            <li>Indicator education in plain language</li>
            <li>Dark, mobile-first interface with clear visual hierarchy</li>
          </ul>
        </section>

        <section className="section-reveal mt-12 space-y-4">
          <h2 className="text-3xl font-semibold text-[#FFD000]">Live App</h2>
          <Link
            href="/dashboard"
            className="inline-flex rounded-full bg-[#FFD000] px-6 py-3 font-semibold text-black"
          >
            Open Zemen App
          </Link>
        </section>

        <section className="section-reveal mt-12 space-y-3 text-zinc-300">
          <h2 className="text-3xl font-semibold text-[#FFD000]">Built at</h2>
          <p>Zerve AI Hackathon 2025</p>
        </section>

        <section className="section-reveal mt-12 space-y-3 pb-8 text-zinc-300">
          <h2 className="text-3xl font-semibold text-[#FFD000]">Author</h2>
          <p>[Your Name]</p>
          <p>Portfolio: your-portfolio-link</p>
          <p>X: your-x-link</p>
          <p>LinkedIn: your-linkedin-link</p>
          <p>Email: your-email</p>
        </section>
      </article>
    </PresentationShell>
  );
}
