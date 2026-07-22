import Link from "next/link";
import type { ReactNode } from "react";

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}

export function Button({ href, children, variant = "primary", className = "" }: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5722] focus-visible:ring-offset-2";
  const variantClasses =
    variant === "primary"
      ? "bg-[var(--color-primary)] text-white shadow-[var(--shadow-md)] hover:bg-[var(--color-primary-hover)]"
      : variant === "secondary"
        ? "border border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
        : "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-surface-muted)]";

  return (
    <Link href={href} className={`${baseClasses} ${variantClasses} ${className}`.trim()}>
      {children}
    </Link>
  );
}
