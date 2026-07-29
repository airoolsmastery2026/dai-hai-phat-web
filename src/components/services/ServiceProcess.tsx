import type { ServiceProcessStep } from "@/types/content";

export function ServiceProcess({ steps }: { steps: ServiceProcessStep[] }) {
  return (
    <ol className="grid gap-[var(--space-8)] md:grid-cols-3">
      {steps.map((step, index) => (
        <li key={step.title} className="relative">
          <div className="relative h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-6)] shadow-[var(--shadow-sm)]">
            <div className="absolute -top-6 flex h-12 w-12 items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-primary)] font-bold text-white shadow-[var(--shadow-md)]">
              {index + 1}
            </div>
            <h3 className="mt-[var(--space-4)] text-lg font-bold text-[var(--color-text)]">
              {step.title}
            </h3>
            <p className="mt-[var(--space-3)] text-sm leading-7 text-[var(--color-text-muted)]">
              {step.description}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
