import { ChevronDown } from "lucide-react";

import { EmptyState } from "@/components/ui/EmptyState";
import type { ServiceFaqItem } from "@/types/content";

function FAQItem({ item }: { item: ServiceFaqItem }) {
  return (
    <details className="group rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
      <summary className="flex min-h-[var(--control-min-size)] cursor-pointer list-none items-center justify-between gap-[var(--space-4)] p-[var(--space-6)] text-left">
        <h3 className="text-lg font-bold text-[var(--color-text)]">
          {item.question}
        </h3>
        <ChevronDown
          className="h-5 w-5 shrink-0 text-[var(--color-primary)] transition-transform duration-[var(--duration-fast)] group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>

      <div className="border-t border-[var(--color-border)] px-[var(--space-6)] py-[var(--space-4)]">
        <p className="text-sm leading-7 text-[var(--color-text-muted)]">
          {item.answer}
        </p>
      </div>
    </details>
  );
}

export function ServiceFAQ({ items }: { items: ServiceFaqItem[] }) {
  if (!items.length) {
    return (
      <EmptyState
        title="Chưa có câu hỏi thường gặp"
        description="Nội dung sẽ được bổ sung sau khi câu trả lời kỹ thuật được xác minh."
      />
    );
  }

  return (
    <div className="space-y-[var(--space-4)]">
      {items.map((item) => (
        <FAQItem key={item.question} item={item} />
      ))}
    </div>
  );
}
