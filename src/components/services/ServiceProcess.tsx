import type { ServiceProcessStep } from "@/types/content";

export function ServiceProcess({ steps }: { steps: ServiceProcessStep[] }) {
  return (
    <ol className="grid gap-[var(--space-3)] md:grid-cols-3">
      {steps.map((step, index) => (
        <li
          key={step.title}
          className="flex h-full gap-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-4)] shadow-[var(--shadow-sm)]"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-primary)] text-xs font-bold text-white">
            {index + 1}
          </span>
          <div>
            <h3 className="text-base font-bold leading-6 text-[var(--color-text)]">
              {step.title}
            </h3>
            <p className="mt-[var(--space-1)] text-sm leading-6 text-[var(--color-text-muted)]">
              {step.description}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
