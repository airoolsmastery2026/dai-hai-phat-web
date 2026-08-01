import { ArrowRight, Bot, CheckCircle2 } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { COMPANY_CONFIG } from "@/content/company";

const DELIVERY_STEPS = [
  "Chọn hạng mục và nhu cầu",
  "Ghi nhận hiện trạng, kích thước",
  "Đối chiếu vật liệu và phương án",
  "Kỹ sư khảo sát trước báo giá",
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
        className="-z-20 object-cover object-[68%_center]"
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(255_254_250/0.98)_0%,rgb(243_247_246/0.95)_45%,rgb(243_247_246/0.64)_72%,rgb(243_247_246/0.34)_100%)]"
        aria-hidden="true"
      />
      <div
        className="metallic-rule pointer-events-none absolute inset-x-0 bottom-0 h-px"
        aria-hidden="true"
      />

      <Container className="relative grid items-center gap-[var(--space-8)] py-[var(--space-10)] sm:py-[var(--space-12)] lg:min-h-[38rem] lg:grid-cols-[1.08fr_0.72fr] lg:gap-[var(--space-12)] lg:py-[var(--space-16)]">
        <div className="max-w-[42rem]">
          <span className="inline-flex items-center gap-[var(--space-2)] rounded-[var(--radius-full)] border border-[var(--color-metal)]/45 bg-[var(--color-metal-soft)]/80 px-[var(--space-3)] py-[var(--space-2)] text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-metal-strong)]">
            <Bot className="h-4 w-4" aria-hidden="true" /> Tư vấn nhà ở 24/7
          </span>

          <h1 className="mt-[var(--space-5)] text-[length:var(--font-display)] font-extrabold leading-[1.04] tracking-[-0.04em] text-[var(--color-text)]">
            Nội thất &amp; cơ khí dân dụng
            <span className="mt-[var(--space-2)] block text-[var(--color-wood)]">
              tinh gọn từ khảo sát đến hoàn thiện.
            </span>
          </h1>

          <p className="mt-[var(--space-5)] max-w-xl text-base leading-7 text-[var(--color-text-muted)] sm:text-lg">
            Thiết kế và thi công theo dữ liệu hiện trạng, vật liệu được xác nhận
            và phương án có kỹ sư kiểm tra trước khi báo giá.
          </p>

          <div className="mt-[var(--space-8)] flex flex-wrap gap-[var(--space-3)]">
            <Button href="#ai-office">
              Trò chuyện với AI <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button href="/gallery" variant="secondary">
              Xem công trình
            </Button>
          </div>

          <ul className="mt-[var(--space-6)] flex flex-wrap gap-x-[var(--space-5)] gap-y-[var(--space-2)] text-sm text-[var(--color-text-muted)]">
            {["Khảo sát theo hiện trạng", "Xác nhận vật liệu", "Kỹ sư duyệt phương án"].map((item) => (
              <li key={item} className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <aside className="rounded-[var(--radius-xl)] border border-white/80 bg-[var(--color-surface)]/84 p-[var(--space-5)] shadow-[var(--shadow-md)] backdrop-blur-md sm:p-[var(--space-6)]">
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
