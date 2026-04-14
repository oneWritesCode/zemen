export type FreshnessTone = "green" | "yellow" | "red" | "gray";

export function getFreshnessLabel(updatedAtIso: string | null): {
  text: string;
  tone: FreshnessTone;
} {
  if (!updatedAtIso) return { text: "Date unknown", tone: "gray" };
  const ms = Date.parse(`${updatedAtIso}T00:00:00Z`);
  if (!Number.isFinite(ms)) return { text: "Date unknown", tone: "gray" };
  const daysAgo = Math.max(0, Math.floor((Date.now() - ms) / (1000 * 60 * 60 * 24)));
  if (daysAgo <= 7) return { text: `Updated ${daysAgo}d ago`, tone: "green" };
  if (daysAgo <= 35) return { text: `Updated ${daysAgo}d ago`, tone: "yellow" };
  return { text: `Updated ${daysAgo}d ago`, tone: "red" };
}

