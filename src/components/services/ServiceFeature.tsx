import { Zap } from "lucide-react";

import type { ServiceFeature as ServiceFeatureType } from "@/types/content";

export function ServiceFeature({ feature }: { feature: ServiceFeatureType }) {
  return (
    <article className="group relative rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-4)] shadow-[var(--shadow-sm)] transition-colors duration-[var(--duration-fast)] hover:border-[var(--color-primary)]">
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
        <Zap className="h-4 w-4" aria-hidden="true" />
      </div>
      <h3 className="mt-[var(--space-3)] text-base font-bold leading-6 text-[var(--color-text)]">
        {feature.title}
      </h3>
      <p className="mt-[var(--space-1)] text-sm leading-6 text-[var(--color-text-muted)]">
        {feature.description}
      </p>
    </article>
  );
}
