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

export function RegimeAlertBanner() {
  const [status, setStatus] = useState<RegimeStatus | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const dismissed = window.sessionStorage.getItem("zemen-regime-banner-hidden");
    if (dismissed === "1") {
      setHidden(true);
      return;
    }
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
  }, []);

  if (hidden) return null;

  const confidence = status?.confidence ?? 0;
  const text = !status
    ? "Loading regime status..."
    : confidence > 70
      ? `Regime stable: ${status.regime} — Last updated ${status.updatedAt}`
      : confidence >= 50
        ? "⚠️ Regime signal weakening — Some indicators are shifting. Watch closely."
        : `🔴 Regime transition detected — Signals are mixed. A shift may be coming. Last transition like this: ${status.lastTransitionYear ?? "N/A"}`;

  const tone = !status
    ? "bg-zinc-800 text-zinc-100"
    : confidence > 70
      ? "bg-emerald-600/90 text-emerald-50"
      : confidence >= 50
        ? "bg-yellow-500/90 text-black"
        : "bg-orange-500/90 text-black";

  return (
    <div className={`fixed w-full top-0 z-[90] ${tone}`}>
      <div className="mx-auto flex h-12 max-w-7xl items-center gap-2 px-3">
        <Link
          href="/regime-detector"
          className="flex min-w-0 flex-1 items-center justify-center text-center text-sm font-semibold"
        >
          <span className="truncate">{text}</span>
        </Link>
        <button
          type="button"
          onClick={() => {
            setHidden(true);
            window.sessionStorage.setItem("zemen-regime-banner-hidden", "1");
          }}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-black/20 bg-black/10 hover:bg-black/20"
          aria-label="Hide regime alert banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

