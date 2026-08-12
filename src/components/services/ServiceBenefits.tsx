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
    <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-[var(--space-4)] sm:p-[var(--space-5)]" aria-labelledby="service-benefits-title">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-primary)]">
        Lợi ích chính
      </p>
      <h2 id="service-benefits-title" className="mt-[var(--space-2)] text-xl font-bold text-[var(--color-text)]">
        Giá trị cần giữ khi chốt phương án
      </h2>
      <ul className="mt-[var(--space-3)] grid gap-x-[var(--space-5)] gap-y-[var(--space-2)] md:grid-cols-2">
        {benefits.map((benefit) => (
          <li key={benefit} className="flex items-start gap-[var(--space-2)] py-[var(--space-1)]">
            <CheckCircle2
              className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-success)]"
              aria-hidden="true"
            />
            <span className="text-sm leading-6 text-[var(--color-text-muted)]">
              {benefit}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
