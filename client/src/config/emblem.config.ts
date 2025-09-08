// emblem.config.ts
export const tokens = {
  colors: { bg: "#000", sea: "#0e3a5b", glow: "#1cb0f6", duoAccent: "#e83e8c" },
  timing: { introMs: 1200, idleAmp: 0.05, idleRot: 0.06 }
};

export const countryThemes: Record<string, { accent: string }> = {
  JM: { accent: "#FED100" }, // Jamaica
  US: { accent: "#1DA1F2" },
  KE: { accent: "#00BFA5" },
  NG: { accent: "#34C759" },
  DEFAULT: { accent: tokens.colors.duoAccent }
};