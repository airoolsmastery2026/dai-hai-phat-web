import { ArrowRight, CheckCircle2, HardHat } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { COMPANY_CONFIG } from "@/content/company";

const DELIVERY_STEPS = [
  "Chọn hạng mục",
  "Ghi nhận hiện trạng",
  "Chốt vật liệu & phương án",
  "Kỹ sư khảo sát, báo giá",
];

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <Image
        src="/images/brand/hero-luxury-materials-v1.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[72%_center]"
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(255_254_250/0.99)_0%,rgb(243_247_246/0.96)_48%,rgb(243_247_246/0.7)_76%,rgb(243_247_246/0.38)_100%)]"
        aria-hidden="true"
      />
      <div
        className="metallic-rule pointer-events-none absolute inset-x-0 bottom-0 h-px"
        aria-hidden="true"
      />

      <Container className="relative grid items-center gap-[var(--space-8)] py-[var(--space-6)] sm:py-[var(--space-10)] lg:min-h-[34rem] lg:grid-cols-[1.08fr_0.72fr] lg:gap-[var(--space-12)] lg:py-[var(--space-14)]">
        <div className="max-w-[42rem]">
          <span className="inline-flex items-center gap-[var(--space-2)] rounded-[var(--radius-full)] border border-[var(--color-metal)]/45 bg-[var(--color-metal-soft)]/85 px-[var(--space-3)] py-[var(--space-2)] text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-metal-strong)]">
            <HardHat className="h-4 w-4" aria-hidden="true" /> Tiếp nhận yêu cầu 24/7
          </span>

          <h1 className="mt-[var(--space-4)] text-[length:var(--font-display)] font-extrabold leading-[1.02] tracking-[-0.04em] text-[var(--color-text)]">
            Thiết kế &amp; thi công nhà ở
            <span className="mt-[var(--space-2)] block text-[var(--color-wood)]">
              gọn từ khảo sát đến hoàn thiện.
            </span>
          </h1>

          <p className="mt-[var(--space-4)] max-w-xl text-base leading-7 text-[var(--color-text-muted)] sm:text-lg">
            Nội thất, cửa cổng, cầu thang và mái che theo hiện trạng thực tế.
            Vật liệu và phương án được kỹ sư kiểm tra trước báo giá.
          </p>

          <div className="mt-[var(--space-6)] flex flex-wrap gap-[var(--space-3)]">
            <Button href="/contact">
              Trao đổi với kỹ sư <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button href="/gallery" variant="secondary">
              Xem công trình
            </Button>
          </div>

          <ul className="mt-[var(--space-5)] grid gap-[var(--space-2)] text-sm text-[var(--color-text-muted)] sm:flex sm:flex-wrap sm:gap-x-[var(--space-5)]">
            {["Khảo sát hiện trạng", "Xác nhận vật liệu", "Kỹ sư duyệt phương án"].map((item) => (
              <li key={item} className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-[var(--space-5)] grid grid-cols-2 gap-[var(--space-2)] rounded-[var(--radius-lg)] border border-white/70 bg-white/65 p-[var(--space-3)] backdrop-blur-sm lg:hidden">
            {DELIVERY_STEPS.map((item, index) => (
              <div key={item} className="flex items-start gap-[var(--space-2)] text-xs font-semibold leading-5 text-[var(--color-text-muted)]">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-[10px] font-bold text-[var(--color-primary-contrast)]">
                  {index + 1}
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <aside className="hidden rounded-[var(--radius-xl)] border border-white/80 bg-[var(--color-surface)]/84 p-[var(--space-6)] shadow-[var(--shadow-md)] backdrop-blur-md lg:block">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-metal-strong)]">
              Lộ trình tư vấn
            </p>
            <span className="rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-primary-soft-text)]">
              4 bước
            </span>
          </div>
          <ol className="mt-[var(--space-4)] divide-y divide-[var(--color-border)]">
            {DELIVERY_STEPS.map((item, index) => (
              <li key={item} className="flex items-center gap-[var(--space-3)] py-[var(--space-3)] first:pt-0 last:pb-0">
                <span
                  aria-hidden="true"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-xs font-bold text-[var(--color-primary-contrast)]"
                >
                  {index + 1}
                </span>
                <span className="text-sm font-semibold text-[var(--color-text)]">{item}</span>
              </li>
            ))}
          </ol>
          <a
            href={`tel:${COMPANY_CONFIG.phones[0].raw}`}
            className="mt-[var(--space-5)] flex min-h-12 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-metal)]/55 bg-[var(--color-metal-soft)]/75 px-[var(--space-4)] text-center text-sm font-bold text-[var(--color-metal-strong)] transition hover:bg-[var(--color-metal-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
          >
            Cần gấp? Gọi kỹ sư {COMPANY_CONFIG.phones[0].display}
          </a>
        </aside>
      </Container>
    </section>
  );
}
