import { Zap } from "lucide-react";

import type { ServiceFeature as ServiceFeatureType } from "@/types/content";

export function ServiceFeature({ feature }: { feature: ServiceFeatureType }) {
  return (
    <div className="group relative rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-6)] shadow-[var(--shadow-sm)] transition-colors duration-[var(--duration-fast)] hover:border-[var(--color-primary)]">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
        <Zap className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="mt-[var(--space-4)] text-lg font-bold text-[var(--color-text)]">
        {feature.title}
      </h3>
      <p className="mt-[var(--space-2)] text-sm leading-7 text-[var(--color-text-muted)]">
        {feature.description}
      </p>
    </div>
  );
}
