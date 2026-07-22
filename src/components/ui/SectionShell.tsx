import type { ReactNode } from "react";

interface SectionShellProps {
  children: ReactNode;
  className?: string;
  background?: "default" | "muted" | "dark";
}

export function SectionShell({ children, className = "", background = "default" }: SectionShellProps) {
  const bgClass =
    background === "muted"
      ? "bg-[var(--color-surface-muted)]"
      : background === "dark"
        ? "bg-[var(--color-surface-dark)] text-white"
        : "bg-[var(--color-background)]";

  return <section className={`py-20 md:py-24 ${bgClass} ${className}`.trim()}>{children}</section>;
}
