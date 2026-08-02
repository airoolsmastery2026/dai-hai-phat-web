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
  { label: "AI tư vấn", href: "/#ai-office" },
  { label: "AI phối cảnh", href: "/cong-cu/ai-phoi-canh" },
  { label: "Công trình", href: "/gallery" },
  { label: "Checklist", href: "/blog" },
  { label: "Liên hệ", href: "/contact" },
] as const;
