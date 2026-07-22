import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  tone?: "default" | "muted";
  hoverable?: boolean;
}

export function Card({ children, className = "", tone = "default", hoverable = false }: CardProps) {
  const toneClass = tone === "muted" ? "bg-[var(--color-surface-muted)]" : "bg-[var(--color-surface)]";
  const hoverClass = hoverable ? "transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]" : "";

  return (
    <div className={`rounded-[var(--radius-xl)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] ${toneClass} ${hoverClass} ${className}`.trim()}>
      {children}
    </div>
  );
}
