// EmblemProvider.tsx
import React from "react";
import { countryThemes } from "@/config/emblem.config";

export const EmblemContext = React.createContext({ accent: "#e83e8c", reduced: false });

export function EmblemProvider({ country = "DEFAULT", children }: { country?: string, children: React.ReactNode }) {
  const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const accent = (countryThemes[country] || countryThemes.DEFAULT).accent;
  return <EmblemContext.Provider value={{ accent, reduced }}>{children}</EmblemContext.Provider>;
}