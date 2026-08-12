import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { ServiceItem } from "@/types/content";

export function ServiceHero({ service }: { service: ServiceItem }) {
  return (
    <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-[linear-gradient(125deg,var(--color-surface)_0%,var(--color-primary-soft)_78%,var(--color-metal-soft)_100%)] py-[var(--space-10)] text-[var(--color-text)] lg:py-[var(--space-section)]">
      <Container>
        <div className="relative grid items-center gap-[var(--space-6)] lg:grid-cols-[1.1fr_0.9fr] lg:gap-[var(--space-10)]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-metal-strong)]">
              Dịch vụ kỹ thuật
            </p>
            <h1 className="mt-[var(--space-3)] text-[length:var(--font-h1)] font-extrabold leading-tight tracking-[-0.03em]">
              {service.title}
            </h1>
            <p className="mt-[var(--space-3)] text-base font-semibold text-[var(--color-primary)] sm:text-lg">
              {service.subtitle}
            </p>
            <p className="mt-[var(--space-3)] max-w-2xl text-sm leading-6 text-[var(--color-text-muted)] sm:text-base sm:leading-7">
              {service.summary}
            </p>
            <div className="mt-[var(--space-5)] flex flex-wrap gap-[var(--space-3)]">
              <Button href="/contact">Trao đổi với kỹ sư</Button>
              <Button href="#faq" variant="secondary">
                Câu hỏi thường gặp
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-xl)] border border-white/80 shadow-[var(--shadow-md)]">
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
