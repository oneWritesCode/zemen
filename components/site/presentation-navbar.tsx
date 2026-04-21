"use client";

import Link from "next/link";
import { Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const links = [
  { href: "/briefing", label: "Briefing" },
  { href: "/stock-scout", label: "Stock Scout" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/indicators", label: "Indicators" },
  { href: "/regimes", label: "Regimes" },
];

const APP_URL = "/dashboard";

export function PresentationNavbar() {
  const [open, setOpen] = useState(false);
  const { user, logout, loading } = useAuth();

  return (
    <header className="fixed w-full top-0 z-50 border-b border-white/[0.06] bg-black/20 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-4xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-base font-bold tracking-[0.12em] text-zinc-100"
        >
          ZEMEN
        </Link>

        <nav className="hidden items-center gap-4 text-[13px] text-zinc-200 font-medium md:flex">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-zinc-100 px-2 py-0.5 rounded hover:bg-white/10"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <div className="h-8 w-20 animate-pulse bg-white/5 rounded-lg" />
          ) : user ? (
            <div className="flex items-center gap-3">
              {user.profile && (
                <div className="flex items-center gap-1.5 rounded-full bg-[#FFD000]/10 border border-[#FFD000]/20 px-2.5 py-1">
                  <span className="text-[11px] font-black text-[#FFD000]">{user.profile.totalXp}</span>
                  <span className="text-[9px] font-bold text-[#FFD000]/80 uppercase tracking-tighter">PTS</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 rounded-lg bg-white/[0.08] border border-white/[0.08] px-3 py-1.5 text-[12px] font-bold text-white transition hover:bg-white/[0.12]"
                >
                  <User className="h-3.5 w-3.5" />
                  {user.username}
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-[#666] hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg border border-white/10 px-4 py-1.5 text-[13px] font-bold text-zinc-100 transition hover:bg-white/5"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-white px-4 py-1.5 text-[13px] font-bold text-black transition hover:bg-[#FFD000]"
              >
                Join
              </Link>
            </>
          )}
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
            {user && (
              <div className="flex items-center gap-2 px-3 py-2 mb-2 border-b border-white/5">
                <User className="h-4 w-4 text-[#FFD000]" />
                <span className="font-bold text-white">{user.username}</span>
              </div>
            )}
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
            {!user ? (
              <div className="grid grid-cols-2 gap-2 mt-4">
                <Link
                  href="/login"
                  className="flex justify-center rounded-lg border border-white/10 px-4 py-2.5 text-sm font-bold text-zinc-100"
                  onClick={() => setOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-black"
                  onClick={() => setOpen(false)}
                >
                  Join
                </Link>
              </div>
            ) : (
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 py-2.5 text-sm font-bold text-red-400"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
