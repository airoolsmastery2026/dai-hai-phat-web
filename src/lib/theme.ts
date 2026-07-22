export const theme = {
  colors: {
    primary: "#FF5722",
    primaryHover: "#ea4b0f",
    background: "#F8FAFC",
    surface: "#FFFFFF",
    surfaceMuted: "#F1F5F9",
    text: "#0F172A",
    textMuted: "#475569",
    border: "#E2E8F0",
    accent: "#2563EB",
  },
  typography: {
    sans: 'Inter, "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    heading: '"Be Vietnam Pro", "Segoe UI", system-ui, sans-serif',
  },
  shadows: {
    soft: "0 10px 30px rgba(15, 23, 42, 0.08)",
    card: "0 16px 40px rgba(15, 23, 42, 0.1)",
  },
} as const;

export const NAV_ITEMS = [
  { label: "Giới thiệu", href: "#about" },
  { label: "Dịch vụ", href: "#services" },
  { label: "Dự án", href: "#projects" },
  { label: "Quy trình", href: "#process" },
  { label: "Liên hệ", href: "#contact" },
] as const;
