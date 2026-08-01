import Link from "next/link";
import type { ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  external?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  external = false,
  loading = false,
  disabled = false,
}: ButtonProps) {
  const baseClasses =
    "inline-flex min-h-[var(--control-min-size)] touch-manipulation items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] px-[var(--space-6)] py-[var(--space-3)] text-sm font-bold transition-colors duration-[var(--duration-fast)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2";
  const variantClasses =
    variant === "primary"
      ? "bg-[var(--color-primary)] text-[var(--color-primary-contrast)] shadow-[var(--shadow-md)] hover:bg-[var(--color-primary-hover)]"
      : variant === "secondary"
        ? "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-primary)] shadow-[var(--shadow-sm)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)]"
        : "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-surface-muted)]";
  const classes =
    `${baseClasses} ${variantClasses} ${disabled || loading ? "cursor-not-allowed opacity-60" : ""} ${className}`.trim();
  const content = loading ? (
    <>
      <LoaderCircle
        className="h-4 w-4 animate-spin"
        aria-hidden="true"
      />
      <span>Đang xử lý</span>
    </>
  ) : (
    children
  );

  if (disabled || loading) {
    return (
      <span
        className={classes}
        role="link"
        aria-disabled="true"
        aria-busy={loading || undefined}
      >
        {content}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={classes}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
    >
      {content}
    </Link>
  );
}
