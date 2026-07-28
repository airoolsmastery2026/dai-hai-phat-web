import type { ReactNode } from "react";

type AlertTone = "info" | "success" | "warning" | "error";

interface AlertProps {
  title: string;
  children?: ReactNode;
  tone?: AlertTone;
  className?: string;
}

const TONE_CLASSES: Record<AlertTone, string> = {
  info: "border-[var(--color-border)] bg-[var(--color-surface-muted)] text-[var(--color-text)]",
  success:
    "border-[var(--color-success)] bg-[var(--color-success-soft)] text-[var(--color-success)]",
  warning:
    "border-[var(--color-warning)] bg-[var(--color-warning-soft)] text-[var(--color-warning)]",
  error:
    "border-[var(--color-danger)] bg-[var(--color-danger-soft)] text-[var(--color-danger)]",
};

export function Alert({
  title,
  children,
  tone = "info",
  className = "",
}: AlertProps) {
  return (
    <div
      className={`rounded-[var(--radius-md)] border p-[var(--space-4)] ${TONE_CLASSES[tone]} ${className}`.trim()}
      role={tone === "error" ? "alert" : "status"}
    >
      <p className="font-bold">{title}</p>
      {children ? (
        <div className="mt-[var(--space-2)] text-sm leading-6">{children}</div>
      ) : null}
    </div>
  );
}
