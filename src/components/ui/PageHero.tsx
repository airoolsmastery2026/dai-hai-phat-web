import type { ReactNode } from "react";

import { Container } from "@/components/ui/Container";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}

export function PageHero({
  eyebrow,
  title,
  description,
  actions,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[var(--color-surface-dark)] py-[var(--space-section)] text-[var(--color-text-inverse)] lg:py-[var(--space-section-lg)]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,color-mix(in_srgb,var(--color-primary)_20%,transparent),transparent_38%)]"
        aria-hidden="true"
      />
      <Container className="relative">
        <div className="max-w-[var(--content-max)]">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-primary-soft-text)] sm:text-sm">
            {eyebrow}
          </p>
          <h1 className="mt-[var(--space-4)] text-4xl font-extrabold leading-tight tracking-[-0.03em] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-[var(--space-6)] text-base leading-8 text-[var(--color-text-dark-muted)] sm:text-lg">
            {description}
          </p>
          {actions ? (
            <div className="mt-[var(--space-8)] flex flex-wrap gap-[var(--space-3)]">
              {actions}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
