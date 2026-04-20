"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

type RegimeStatus = {
  regime: string;
  confidence: number;
  updatedAt: string;
  lastTransitionYear: number | null;
};

type RegimeAlertBannerProps = {
  variant?: "sticky" | "inline";
};

export function RegimeAlertBanner({ variant = "sticky" }: RegimeAlertBannerProps) {
  const [status, setStatus] = useState<RegimeStatus | null>(null);
  const [hidden, setHidden] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.sessionStorage.getItem("zemen-regime-banner-hidden") === "1";
  });
  const isSticky = variant === "sticky";

  useEffect(() => {
    if (isSticky) {
      document.documentElement.style.setProperty(
        "--regime-banner-offset",
        hidden ? "0px" : "40px",
      );
    }
    if (hidden) return;
    const load = async () => {
      try {
        const res = await fetch("/api/regime/status", { cache: "no-store" });
        if (!res.ok) return;
        const json = (await res.json()) as RegimeStatus;
        setStatus(json);
      } catch {
        // noop
      }
    };
    void load();
  }, [hidden, isSticky]);

  if (hidden) return null;

  const confidence = status?.confidence ?? 0;
  const text = !status
    ? "Loading regime status..."
    : confidence > 70
      ? `Regime stable: ${status.regime} — ${status.updatedAt}`
      : confidence >= 50
        ? "Regime signal weakening — indicators shifting"
        : `Regime transition detected — signals are mixed`;

  const dismiss = () => {
    setHidden(true);
    window.sessionStorage.setItem("zemen-regime-banner-hidden", "1");
  };

  if (isSticky) {
    return (
      <div className="z-[90] backdrop-blur-md">
        <div className="mx-auto flex h-10 max-w-7xl items-center gap-2 px-3">
          <Link href="/regime-detector" className="min-w-0 flex-1 truncate text-center text-xs text-zinc-400 hover:text-zinc-200 transition">
            {text}
          </Link>
          <button
            type="button"
            onClick={dismiss}
            className="inline-flex h-6 w-6 shrink-0 items-center justify-center text-zinc-500 hover:text-zinc-300 transition"
            aria-label="Hide regime alert banner"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 flex justify-center items-center">
      <div className="overflow-hidden rounded-xl bg-black/70">
        <div className="flex h-10 items-center gap-2 px-4">
          <Link href="/regime-detector" className="min-w-0 flex-1 truncate text-center text-xs text-zinc-100 hover:text-zinc-50 hover:underline underline-offset-2 transition capitalize font-medium">
            {text}
          </Link>
          <button
            type="button"
            onClick={dismiss}
            className="inline-flex h-6 w-6 shrink-0 items-center justify-center text-zinc-500 hover:text-zinc-300 transition"
            aria-label="Hide regime alert banner"
          >
          </button>
        </div>
      </div>
    </div>
  );
}
