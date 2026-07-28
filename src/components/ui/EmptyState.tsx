import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-8)] text-center ${className}`.trim()}
    >
      <h3 className="text-lg font-bold text-[var(--color-text)]">{title}</h3>
      <p className="mx-auto mt-[var(--space-3)] max-w-lg text-sm leading-6 text-[var(--color-text-muted)]">
        {description}
      </p>
      {action ? (
        <div className="mt-[var(--space-6)] flex justify-center">{action}</div>
      ) : null}
    </div>
  );
}
