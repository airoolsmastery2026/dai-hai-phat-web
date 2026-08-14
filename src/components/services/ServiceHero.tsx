import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { ServiceItem } from "@/types/content";

export function ServiceHero({ service }: { service: ServiceItem }) {
  const aiOfficeHref = `/?service=${encodeURIComponent(service.aiService)}#ai-office`;

  return (
    <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-[linear-gradient(125deg,var(--color-surface)_0%,var(--color-primary-soft)_78%,var(--color-metal-soft)_100%)] py-[var(--space-8)] text-[var(--color-text)] sm:py-[var(--space-10)] lg:py-[var(--space-12)]">
      <Container>
        <div className="relative grid items-center gap-[var(--space-5)] lg:grid-cols-[1.12fr_0.88fr] lg:gap-[var(--space-8)]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-metal-strong)]">
              Dịch vụ kỹ thuật
            </p>
            <h1 className="mt-[var(--space-2)] text-[length:var(--font-h1)] font-extrabold leading-tight tracking-[-0.03em]">
              {service.title}
            </h1>
            <p className="mt-[var(--space-2)] text-sm font-semibold text-[var(--color-primary)] sm:text-base">
              {service.subtitle}
            </p>
            <p className="mt-[var(--space-3)] max-w-2xl text-sm leading-6 text-[var(--color-text-muted)] sm:text-base">
              {service.summary}
            </p>
            <div className="mt-[var(--space-4)] flex flex-wrap gap-[var(--space-2)]">
              <Button href={aiOfficeHref}>Tư vấn ngay với trợ lý AI</Button>
              <Button href="#faq" variant="secondary">
                Xem câu hỏi thường gặp
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[var(--radius-lg)] border border-white/80 shadow-[var(--shadow-sm)] lg:aspect-[4/3]">
              <Image
                src={service.image}
                alt={service.title}
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 42vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
