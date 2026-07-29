import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import type { ServiceItem } from "@/types/content";

export function ServiceHero({ service }: { service: ServiceItem }) {
  const aiOfficeHref = `/?service=${encodeURIComponent(service.aiService)}#ai-office`;

  return (
    <section className="relative overflow-hidden bg-[var(--color-surface-dark)] py-[var(--space-section)] text-white lg:py-[var(--space-section-lg)]">
      <Container>
        <div className="relative grid items-center gap-[var(--space-12)] lg:grid-cols-[1.2fr_1fr] lg:gap-[var(--space-16)]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-primary-soft-text)]">
              Dịch vụ kỹ thuật
            </p>
            <h1 className="mt-[var(--space-6)] text-4xl font-extrabold leading-tight tracking-[-0.03em] sm:text-5xl lg:text-6xl">
              {service.title}
            </h1>
            <p className="mt-[var(--space-6)] text-xl text-[var(--color-text-dark-muted)]">
              {service.subtitle}
            </p>
            <p className="mt-[var(--space-6)] max-w-2xl text-base leading-8 text-[var(--color-text-dark-subtle)]">
              {service.summary}
            </p>
            <div className="mt-[var(--space-10)] flex flex-wrap gap-[var(--space-4)]">
              <Button href={aiOfficeHref}>Lập hồ sơ tư vấn</Button>
              <Button href="#faq" variant="secondary">
                Xem câu hỏi thường gặp
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border-dark)] shadow-[var(--shadow-lg)]">
              <Image
                src={service.image}
                alt={service.title}
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
