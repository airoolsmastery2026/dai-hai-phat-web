import { CheckCircle2 } from "lucide-react";

import { EmptyState } from "@/components/ui/EmptyState";
import type { ServiceItem } from "@/types/content";

export function ServiceBenefits({ benefits }: { benefits: ServiceItem["benefits"] }) {
  if (!benefits.length) {
    return (
      <EmptyState
        title="Chưa có dữ liệu lợi ích"
        description="Lợi ích của dịch vụ sẽ được bổ sung sau khi nội dung kỹ thuật được xác minh."
      />
    );
  }

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-[var(--space-8)] shadow-[var(--shadow-sm)] md:p-[var(--space-10)]">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
        Lợi ích chính
      </p>
      <div className="mt-[var(--space-8)] grid gap-[var(--space-4)] md:grid-cols-2">
        {benefits.map((benefit) => (
          <div
            key={benefit}
            className="flex items-start gap-[var(--space-4)] rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-[var(--space-5)] shadow-[var(--shadow-sm)]"
          >
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-success-soft)]">
              <CheckCircle2
                className="h-5 w-5 text-[var(--color-success)]"
                aria-hidden="true"
              />
            </div>
            <p className="text-sm font-medium text-[var(--color-text-muted)]">
              {benefit}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
