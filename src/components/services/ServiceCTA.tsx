import { Bot } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { ServiceItem } from "@/types/content";

export function ServiceCTA({ service }: { service: ServiceItem }) {
  const consultationHref = `/ai-tu-van?service=${encodeURIComponent(service.aiService)}&ai=1`;

  return (
    <section className="relative overflow-hidden bg-[var(--color-surface-dark)] py-[var(--space-8)] text-white lg:py-[var(--space-10)]">
      <Container>
        <div className="relative flex flex-col items-start justify-between gap-[var(--space-4)] rounded-[var(--radius-lg)] border border-[var(--color-border-dark)] bg-[var(--color-surface-dark-soft)] p-[var(--space-4)] sm:p-[var(--space-5)] md:flex-row md:items-center lg:p-[var(--space-6)]">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-primary-soft-text)]">
              Bước tiếp theo
            </p>
            <h2 className="mt-[var(--space-2)] text-xl font-bold leading-tight sm:text-2xl">
              Lập hồ sơ {service.title.toLowerCase()} cùng trợ lý tư vấn
            </h2>
            <p className="mt-[var(--space-2)] text-sm leading-6 text-[var(--color-text-dark-muted)]">
              Gửi vị trí, kích thước dự kiến, ảnh hiện trạng và nhu cầu. Trợ lý giữ ngữ cảnh để kỹ sư tiếp tục xác minh mà không phải hỏi lại từ đầu.
            </p>
          </div>
          <Button href={consultationHref} className="w-full flex-shrink-0 sm:w-auto">
            <Bot className="h-4 w-4" aria-hidden="true" />
            Mở trợ lý tư vấn
          </Button>
        </div>
      </Container>
    </section>
  );
}
