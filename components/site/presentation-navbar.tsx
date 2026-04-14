"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/briefing", label: "Briefing" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/indicators", label: "Indicators" },
  { href: "/regimes", label: "Regimes" },
];

const APP_URL = "/dashboard";

export function PresentationNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed w-full top-0 z-50 border-b border-white/[0.06] bg-[#09090b]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-base font-bold tracking-[0.12em] text-zinc-100">
          ZEMEN
        </Link>

        <nav className="hidden items-center gap-8 text-[13px] text-zinc-400 md:flex">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-zinc-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href={APP_URL}
            className="rounded-lg bg-white/[0.08] border border-white/[0.08] px-4 py-1.5 text-[13px] font-medium text-zinc-100 transition hover:bg-white/[0.12] hover:border-white/[0.12]"
          >
            Dashboard
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-md p-2 text-zinc-400 hover:text-zinc-100 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/[0.06] bg-[#09090b] p-4 md:hidden">
          <nav className="flex flex-col gap-1 text-sm text-zinc-400">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2.5 transition hover:bg-white/[0.04] hover:text-zinc-100"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={APP_URL}
              className="mt-3 inline-flex justify-center rounded-lg bg-white/[0.08] border border-white/[0.08] px-4 py-2.5 text-sm font-medium text-zinc-100"
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
