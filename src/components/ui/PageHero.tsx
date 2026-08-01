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
    <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-[linear-gradient(125deg,var(--color-surface)_0%,var(--color-primary-soft)_72%,var(--color-metal-soft)_100%)] py-[var(--space-12)] text-[var(--color-text)] lg:py-[var(--space-section)]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,color-mix(in_srgb,var(--color-metal)_16%,transparent),transparent_38%)]"
        aria-hidden="true"
      />
      <Container className="relative">
        <div className="max-w-[var(--content-max)]">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-metal-strong)] sm:text-sm">
            {eyebrow}
          </p>
          <h1 className="mt-[var(--space-4)] text-[length:var(--font-h1)] font-extrabold leading-tight tracking-[-0.03em]">
            {title}
          </h1>
          <p className="mt-[var(--space-5)] text-base leading-7 text-[var(--color-text-muted)] sm:text-lg">
            {description}
          </p>
          {actions ? (
            <div className="mt-[var(--space-6)] flex flex-wrap gap-[var(--space-3)]">
              {actions}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
