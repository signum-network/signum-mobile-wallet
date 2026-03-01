export type ThemeDesign =
  | "defaultLight"
  | "defaultDark"
  | "midnight"
  | "solarized"
  | "sunrise"
  | "bubblegum";

export type ThemeTokens = {
  background: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  text: string;
  textMuted: string;
  primary: string;
  primarySoft: string;
  success: string;
  error: string;
};

type TokenMap = Record<ThemeDesign, ThemeTokens>;

export const themeTokens: TokenMap = {
  defaultLight: {
    background: "#F9FAFB",
    surface: "#FFFFFF",
    surfaceElevated: "#EEF2FF",
    border: "#E5E7EB",
    text: "#111827",
    textMuted: "#6B7280",
    primary: "#2563EB",
    primarySoft: "#DBEAFE",
    success: "#16A34A",
    error: "#DC2626",
  },

  defaultDark: {
    background: "#000000",
    surface: "#171717",
    surfaceElevated: "#222222",
    border: "#27272A",
    text: "#F9FAFB",
    textMuted: "#9CA3AF",
    primary: "#0099ff",
    primarySoft: "#1D4ED8",
    success: "#22C55E",
    error: "#F97373",
  },

  midnight: {
    background: "#020617",
    surface: "#020617",
    surfaceElevated: "#0F172A",
    border: "#1E293B",
    text: "#E5E7EB",
    textMuted: "#6B7280",
    primary: "#38BDF8",
    primarySoft: "#0F172A",
    success: "#22C55E",
    error: "#F97373",
  },

  solarized: {
    background: "#002B36",
    surface: "#00212B",
    surfaceElevated: "#094757",
    border: "#073642",
    text: "#EEE8D5",
    textMuted: "#93A1A1",
    primary: "#268BD2",
    primarySoft: "#0B3C4A",
    success: "#2AA198",
    error: "#CB4B16",
  },

  sunrise: {
    background: "#FFF7F0",
    surface: "#FFF9ED",
    surfaceElevated: "#FFF6D8",
    border: "#F7C6A5",
    text: "#2D1B12",
    textMuted: "#8C6E63",
    primary: "#FF6B4A",
    primarySoft: "#FFD7CC",
    success: "#16A34A",
    error: "#E63946",
  },

  bubblegum: {
    background: "#FFF0F8",
    surface: "#FFFFFF",
    surfaceElevated: "#FCEFFF",
    border: "#F5C9E6",
    text: "#1D0F1A",
    textMuted: "#8B7280",
    primary: "#FF4FBF",
    primarySoft: "#FFE0F5",
    success: "#4FB3FF",
    error: "#C04AFF",
  },
};
