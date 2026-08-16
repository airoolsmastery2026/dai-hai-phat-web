export const theme = {
  colors: {
    primary: "var(--color-primary)",
    primaryHover: "var(--color-primary-hover)",
    background: "var(--color-background)",
    surface: "var(--color-surface)",
    surfaceMuted: "var(--color-surface-muted)",
    text: "var(--color-text)",
    textMuted: "var(--color-text-muted)",
    border: "var(--color-border)",
    focus: "var(--color-focus)",
  },
  typography: {
    sans: "var(--font-sans)",
    heading: "var(--font-heading)",
  },
  shadows: {
    soft: "var(--shadow-sm)",
    card: "var(--shadow-md)",
  },
} as const;

export const NAV_ITEMS = [
  { label: "Trang chủ", href: "/" },
  { label: "Dịch vụ", href: "/services" },
  { label: "Dự án", href: "/gallery" },
  { label: "AI Tư Vấn", href: "/ai-tu-van" },
  { label: "Báo giá", href: "/bao-gia" },
  { label: "Liên hệ", href: "/contact" },
] as const;
