import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { ServiceItem } from "@/types/content";

export function ServiceCTA({ service }: { service: ServiceItem }) {
  return (
    <section className="relative overflow-hidden bg-[var(--color-surface-dark)] py-[var(--space-10)] text-white lg:py-[var(--space-section)]">
      <Container>
        <div className="relative flex flex-col items-start justify-between gap-[var(--space-5)] rounded-[var(--radius-xl)] border border-[var(--color-border-dark)] bg-[var(--color-surface-dark-soft)] p-[var(--space-5)] sm:p-[var(--space-6)] md:flex-row md:items-center lg:p-[var(--space-8)]">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-primary-soft-text)]">
              Bước tiếp theo
            </p>
            <h2 className="mt-[var(--space-2)] text-2xl font-bold leading-tight md:text-3xl">
              Trao đổi hạng mục {service.title.toLowerCase()} với kỹ sư
            </h2>
            <p className="mt-[var(--space-3)] text-sm leading-6 text-[var(--color-text-dark-muted)] md:text-base">
              Chuẩn bị vị trí, kích thước dự kiến và ảnh hiện trạng để đội ngũ xác nhận phạm vi trước khi khảo sát.
            </p>
          </div>
          <Button href="/contact" className="w-full flex-shrink-0 sm:w-auto">
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Trao đổi với kỹ sư
          </Button>
        </div>
      </Container>
    </section>
  );
}
