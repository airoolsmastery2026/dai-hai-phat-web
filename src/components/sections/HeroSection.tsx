import { ArrowRight, Bot } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const DELIVERY_STEPS = [
  "Chọn hạng mục",
  "Ghi nhận hiện trạng",
  "Chốt vật liệu & phương án",
  "Kỹ sư khảo sát, báo giá",
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <div
        className="metallic-rule pointer-events-none absolute inset-x-0 bottom-0 h-px"
        aria-hidden="true"
      />

      <Container className="relative grid items-center gap-[var(--space-6)] py-[var(--space-6)] sm:py-[var(--space-8)] lg:min-h-[30rem] lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.75fr)] lg:gap-[var(--space-8)] lg:py-[var(--space-12)]">
        <div className="max-w-[42rem]">
          <span className="inline-flex items-center gap-[var(--space-2)] rounded-[var(--radius-full)] border border-[var(--color-metal)] bg-[var(--color-metal-soft)] px-[var(--space-3)] py-[var(--space-2)] text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-metal-strong)]">
            <Bot className="h-4 w-4" aria-hidden="true" /> Trợ lý AI tư vấn 24/7
          </span>

          <h1 className="mt-[var(--space-3)] text-[length:var(--font-display)] font-extrabold leading-[1.02] tracking-[-0.04em] text-[var(--color-text)]">
            Thiết kế &amp; thi công nhà ở
            <span className="mt-[var(--space-2)] block text-[var(--color-wood)]">
              gọn từ khảo sát đến hoàn thiện.
            </span>
          </h1>

          <p className="mt-[var(--space-3)] max-w-xl text-base leading-7 text-[var(--color-text-muted)] sm:text-lg">
            Nội thất, cửa cổng, cầu thang và mái che theo hiện trạng thực tế.
            Trợ lý AI tiếp nhận nhu cầu ngay, sau đó kỹ sư kiểm tra phương án trước báo giá.
          </p>

          <div className="mt-[var(--space-5)] grid gap-[var(--space-2)] sm:flex sm:flex-wrap">
            <Button href="#ai-office">
              Trò chuyện với trợ lý AI <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button href="/gallery" variant="secondary">
              Xem công trình
            </Button>
          </div>
        </div>

        <figure className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] shadow-[var(--shadow-sm)]">
          <div className="relative aspect-[16/10] lg:aspect-[4/3]">
            <Image
              src="/images/brand/hero-luxury-materials-v1.webp"
              alt="Bộ mẫu vật liệu nội thất và hoàn thiện nhà ở Đại Hải Phát"
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 38vw"
              className="object-cover object-[72%_center]"
            />
          </div>
          <figcaption className="flex flex-col gap-[var(--space-1)] border-t border-[var(--color-border)] bg-[var(--color-surface)] px-[var(--space-4)] py-[var(--space-3)] sm:flex-row sm:items-center sm:justify-between sm:gap-[var(--space-4)]">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-metal-strong)]">
              Vật liệu &amp; hoàn thiện
            </span>
            <span className="text-sm text-[var(--color-text-muted)]">
              Gỗ, đá và kim loại trong cùng một không gian
            </span>
          </figcaption>
        </figure>

        <ol className="grid gap-[var(--space-3)] border-t border-[var(--color-border)] pt-[var(--space-4)] sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4">
          {DELIVERY_STEPS.map((item, index) => (
            <li key={item} className="flex items-start gap-[var(--space-3)] text-sm font-semibold leading-6 text-[var(--color-text-muted)]">
              <span
                aria-hidden="true"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-primary)] text-xs font-bold text-[var(--color-primary-contrast)]"
              >
                {index + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
