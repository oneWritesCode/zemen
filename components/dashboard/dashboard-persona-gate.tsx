"use client";

import { usePersona } from "@/components/global/persona-provider";
import { PERSONA_OPTIONS } from "@/lib/personalization";

export function DashboardPersonaGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { persona, setPersona } = usePersona();

  return (
    <>
      {children}
      {!persona ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-[#101010] p-6 sm:p-8">
            <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">
              Who are you? This helps Zemen speak your language.
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {PERSONA_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setPersona(option.id)}
                  className="rounded-2xl border border-white/10 bg-[#1a1a1a] p-5 text-left transition hover:border-[#FFFFFF]/60 hover:bg-[#1f1f1f]"
                >
                  <p className="text-xl font-semibold text-[#FFFFFF]">{option.title}</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    {option.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

