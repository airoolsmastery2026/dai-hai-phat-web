import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import type { ServiceItem } from "@/types/content";

export function ServiceCTA({ service }: { service: ServiceItem }) {
  const aiOfficeHref = `/?service=${encodeURIComponent(service.aiService)}#ai-office`;

  return (
    <section className="relative overflow-hidden bg-[var(--color-surface-dark)] py-[var(--space-section)] text-white lg:py-[var(--space-section-lg)]">
      <Container>
        <div className="relative flex flex-col items-start justify-between gap-[var(--space-8)] rounded-[var(--radius-xl)] border border-[var(--color-border-dark)] bg-[var(--color-surface-dark-soft)] p-[var(--space-8)] md:flex-row md:items-center md:p-[var(--space-12)]">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-primary-soft-text)]">
              Bước tiếp theo
            </p>
            <h2 className="mt-[var(--space-4)] text-3xl font-bold leading-tight md:text-4xl">
              Chuẩn bị dữ liệu để kỹ sư khảo sát công trình
            </h2>
            <p className="mt-[var(--space-3)] text-lg text-[var(--color-text-dark-muted)]">
              Gửi hạng mục, vị trí, kích thước dự kiến và ảnh hiện trạng để đội
              ngũ tư vấn phạm vi phù hợp.
            </p>
          </div>
          <div className="flex flex-shrink-0 flex-col gap-[var(--space-3)] sm:flex-row">
            <Button href={aiOfficeHref}>Lập hồ sơ tư vấn</Button>
            <Button href="/contact" variant="secondary">
              Liên hệ kỹ sư
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
