"use client";

import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/lib/hooks/use-toast";

type ExternalLinkProps = {
  platformName: string;
  url: string;
  className?: string;
  children: React.ReactNode;
  onTrackedClick?: (platformName: string) => void;
};

const CLICK_KEY = "zemen_action_clicks";

function readClicks(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(CLICK_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, number>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeClick(name: string) {
  if (typeof window === "undefined") return;
  const current = readClicks();
  current[name] = (current[name] ?? 0) + 1;
  window.localStorage.setItem(CLICK_KEY, JSON.stringify(current));
}

export function usePlatformPopularity(platformName: string): number {
  const [counts] = useState<Record<string, number>>(() => readClicks());
  return counts[platformName] ?? 0;
}

export function ExternalLink({
  platformName,
  url,
  className,
  children,
  onTrackedClick,
}: ExternalLinkProps) {
  const [open, setOpen] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [countdown, setCountdown] = useState(2);
  const { showToast } = useToast();

  useEffect(() => {
    if (!open) return;
    const interval = window.setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          window.clearInterval(interval);
          setEnabled(true);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [open]);

  const continueText = useMemo(() => {
    if (enabled) return "Continue →";
    return `Continue in ${countdown}s`;
  }, [enabled, countdown]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setEnabled(false);
          setCountdown(2);
          setOpen(true);
        }}
        className={className}
      >
        {children}
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Leave Zemen to open ${platformName}`}
        >
          <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#111111] p-5">
            <h3 className="text-lg font-semibold text-zinc-100">You are leaving Zemen</h3>
            <p className="mt-2 text-sm text-zinc-300">
              You are about to visit <span className="font-semibold text-zinc-100">{platformName}</span>.
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Zemen is not responsible for content on external websites.
            </p>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md border border-white/15 px-3 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/[0.04]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!enabled}
                onClick={() => {
                  writeClick(platformName);
                  onTrackedClick?.(platformName);
                  showToast(`Opening ${platformName}...`, 'info');
                  window.open(url, "_blank", "noopener,noreferrer");
                  setOpen(false);
                }}
                className="rounded-md border border-[#FFFFFF]/40 bg-[#FFFFFF]/15 px-3 py-2 text-xs font-semibold text-[#FFFFFF] disabled:opacity-50"
              >
                {continueText}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

