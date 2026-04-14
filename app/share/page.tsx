import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SharePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const a = typeof sp.a === "string" ? sp.a : "";
  const m = typeof sp.m === "string" ? sp.m : "";

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-10 text-zinc-100">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white">Shared Ask Zemen response</h1>
          <Link href="/" className="text-sm text-[#FFD000] hover:underline">
            Back to Zemen
          </Link>
        </div>
        <p className="mt-2 text-sm text-zinc-500">Mode: {m || "Unknown"}</p>

        <div className="mt-6 rounded-2xl border border-white/[0.08] bg-[#12121a] p-5">
          <div className="text-xs uppercase tracking-[0.14em] text-zinc-500">Question</div>
          <div className="mt-2 whitespace-pre-wrap text-sm text-zinc-200">{q || "—"}</div>
        </div>

        <div className="mt-4 rounded-2xl border border-white/[0.08] bg-[#12121a] p-5">
          <div className="text-xs uppercase tracking-[0.14em] text-zinc-500">Answer</div>
          <div className="mt-2 whitespace-pre-wrap text-sm text-zinc-200">{a || "—"}</div>
        </div>
      </div>
    </div>
  );
}

