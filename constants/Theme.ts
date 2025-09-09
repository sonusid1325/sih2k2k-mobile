export const Colors = {
  light: {
    primary: "#f97316", // orange-500
    primaryForeground: "#ffffff",
    secondary: "#f3f4f6", // gray-100
    secondaryForeground: "#1f2937", // gray-800
    accent: "#fef3c7", // amber-100
    accentForeground: "#92400e", // amber-800
    destructive: "#ef4444", // red-500
    destructiveForeground: "#ffffff",
    muted: "#f9fafb", // gray-50
    mutedForeground: "#6b7280", // gray-500
    card: "#ffffff",
    cardForeground: "#111827", // gray-900
    popover: "#ffffff",
    popoverForeground: "#111827", // gray-900
    border: "#e5e7eb", // gray-200
    input: "#f3f4f6", // gray-100
    background: "#ffffff",
    foreground: "#111827", // gray-900
    success: "#10b981", // emerald-500
    warning: "#f59e0b", // amber-500
    info: "#3b82f6", // blue-500
  },
  dark: {
    primary: "#fb923c", // orange-400
    primaryForeground: "#1f2937", // gray-800
    secondary: "#374151", // gray-700
    secondaryForeground: "#f9fafb", // gray-50
    accent: "#451a03", // amber-950
    accentForeground: "#fbbf24", // amber-400
    destructive: "#f87171", // red-400
    destructiveForeground: "#111827", // gray-900
    muted: "#1f2937", // gray-800
    mutedForeground: "#9ca3af", // gray-400
    card: "#111827", // gray-900
    cardForeground: "#f9fafb", // gray-50
    popover: "#111827", // gray-900
    popoverForeground: "#f9fafb", // gray-50
    border: "#374151", // gray-700
    input: "#374151", // gray-700
    background: "#0f1419", // dark background
    foreground: "#f9fafb", // gray-50
    success: "#34d399", // emerald-400
    warning: "#fbbf24", // amber-400
    info: "#60a5fa", // blue-400
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const FontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
  "5xl": 48,
};

export const FontWeights = {
  normal: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
};

export const Shadows = {
  none: {},
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 1,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
};
