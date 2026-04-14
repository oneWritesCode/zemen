"use client";

import { createContext, useContext, useMemo, useState } from "react";

import { PERSONA_OPTIONS, PERSONA_STORAGE_KEY, type Persona } from "@/lib/personalization";

type PersonaContextValue = {
  persona: Persona | null;
  setPersona: (persona: Persona) => void;
};

const PersonaContext = createContext<PersonaContextValue | null>(null);

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  const storedPersona =
    typeof window !== "undefined"
      ? ((window.localStorage.getItem(PERSONA_STORAGE_KEY) as Persona | null) ?? null)
      : null;

  const [persona, setPersonaState] = useState<Persona | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(PERSONA_STORAGE_KEY) as Persona | null;
    return raw && PERSONA_OPTIONS.some((p) => p.id === raw) ? raw : null;
  });

  const setPersona = (next: Persona) => {
    setPersonaState(next);
    window.localStorage.setItem(PERSONA_STORAGE_KEY, next);
  };

  const effectivePersona =
    persona ??
    (storedPersona && PERSONA_OPTIONS.some((p) => p.id === storedPersona)
      ? storedPersona
      : null);

  const value = useMemo(
    () => ({ persona: effectivePersona, setPersona }),
    [effectivePersona],
  );

  return <PersonaContext.Provider value={value}>{children}</PersonaContext.Provider>;
}

export function usePersona() {
  const ctx = useContext(PersonaContext);
  if (!ctx) throw new Error("usePersona must be used inside PersonaProvider");
  return ctx;
}

