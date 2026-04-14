"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/briefing", label: "Briefing" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/indicators", label: "Indicators" },
  { href: "/regimes", label: "Regimes" },
  { href: "/readme", label: "README" },
];

const APP_URL = "/dashboard";

export function PresentationNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed w-full top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-xl font-black tracking-[0.16em] text-[#FFD000]">
          ZEMEN
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-zinc-200 md:flex">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-[#FFD000]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href={APP_URL}
          className="hidden rounded-full bg-[#FFD000] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#ffdc4d] md:inline-flex"
        >
          dashboard
        </Link>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-md border border-white/15 p-2 text-zinc-200 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-white/10 bg-[#0a0a0a] p-4 md:hidden">
          <nav className="flex flex-col gap-3 text-sm text-zinc-200">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 transition hover:bg-white/5 hover:text-[#FFD000]"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={APP_URL}
              className="mt-2 inline-flex justify-center rounded-full bg-[#FFD000] px-4 py-2 font-semibold text-black"
              onClick={() => setOpen(false)}
            >
              dashboard
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
