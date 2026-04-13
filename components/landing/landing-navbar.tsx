"use client";

import Link from "next/link";
import { useState } from "react";
import { FlaskConical, Home, LayoutDashboard, Menu, X } from "lucide-react";
import { BiAnalyse } from "react-icons/bi";

const links = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  {
    href: "/regime-detector",
    label: "Regime detector",
    Icon: FlaskConical,
  },
] as const;

export function LandingNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#0a0a0b]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <BiAnalyse
            className="h-7 w-7 text-[#ffcc00]"
            aria-hidden
          />
          <div className="flex flex-col leading-none">
            <span className="font-serif text-lg font-semibold tracking-wide text-[#ffcc00]">
              ZEMEN
            </span>
            <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-zinc-500">
              Regime detector
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
            >
              <Icon className="h-4 w-4 opacity-80" aria-hidden />
              {label}
            </Link>
          ))}
          <a
            href="https://fred.stlouisfed.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 inline-flex items-center rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-400 transition hover:border-[#ffcc00]/40 hover:text-[#ffcc00]"
          >
            FRED
          </a>
        </nav>

        <button
          type="button"
          className="inline-flex rounded-lg p-2 text-zinc-300 md:hidden"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/[0.08] bg-[#0a0a0b] px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-200"
                onClick={() => setOpen(false)}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {label}
              </Link>
            ))}
            <a
              href="https://fred.stlouisfed.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg px-3 py-2.5 text-sm text-zinc-400"
              onClick={() => setOpen(false)}
            >
              FRED (external)
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
