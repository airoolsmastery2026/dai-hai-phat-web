import { ArrowRight, Bot, CheckCircle2 } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { COMPANY_CONFIG } from "@/content/company";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-surface-dark)] text-white">
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-[var(--radius-full)] bg-[var(--color-primary)] opacity-[0.16] blur-3xl"
        aria-hidden="true"
      />
      <Container className="relative grid items-center gap-[var(--space-12)] py-[var(--space-16)] sm:py-[var(--space-20)] lg:grid-cols-[1.15fr_0.85fr] lg:py-[var(--space-24)]">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-[var(--space-2)] rounded-[var(--radius-full)] border border-[var(--color-primary)]/40 bg-[var(--color-primary)]/10 px-[var(--space-3)] py-[var(--space-2)] text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-primary-soft-text)]">
            <Bot className="h-4 w-4" aria-hidden="true" /> Tư vấn nhà ở 24/7
          </span>

          <h1 className="mt-[var(--space-6)] text-4xl font-black leading-[1.08] tracking-[-0.04em] text-white sm:text-5xl lg:text-7xl">
            Nội thất & cơ khí dân dụng{" "}
            <span className="block text-[var(--color-primary-soft-text)]">
              từ khảo sát đến hoàn thiện.
            </span>
          </h1>

          <p className="mt-[var(--space-6)] max-w-2xl text-base leading-7 text-[var(--color-text-dark-muted)] sm:text-lg sm:leading-8">
            Thiết kế, thi công nội thất và cơ khí dân dụng theo dữ liệu hiện
            trạng của từng nhà ở.
          </p>

          <div className="mt-[var(--space-10)] flex flex-wrap gap-[var(--space-4)]">
            <Button href="#ai-office">
              Lập hồ sơ tư vấn <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Button>
            <Button href="/gallery" variant="secondary">Xem công trình</Button>
          </div>

          <ul className="mt-[var(--space-8)] flex flex-wrap gap-x-[var(--space-6)] gap-y-[var(--space-3)] text-sm text-[var(--color-text-dark-muted)]">
            {["Khảo sát theo hiện trạng", "Vật liệu được xác nhận", "Kỹ sư duyệt phương án"].map((item) => (
              <li key={item} className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--color-primary-soft-text)]" aria-hidden="true" /> {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border-dark)] bg-[var(--color-surface-dark-soft)] p-[var(--space-5)] shadow-[var(--shadow-lg)] sm:p-[var(--space-8)]">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-primary-soft-text)]">
            Từ nhu cầu đến thi công
          </p>
          <ol className="mt-[var(--space-5)] space-y-[var(--space-4)]">
            {["Chọn hạng mục dân dụng", "Ghi nhận kích thước và ảnh hiện trạng", "Đối chiếu vật liệu và phương án", "Kỹ sư khảo sát trước khi báo giá"].map((item, index) => (
              <li key={item} className="flex gap-[var(--space-4)] rounded-[var(--radius-lg)] bg-[var(--color-surface-dark-muted)] p-[var(--space-4)]">
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-primary)] font-black"
                >
                  {index + 1}
                </span>
                <span className="self-center font-semibold">{item}</span>
              </li>
            ))}
          </ol>
          <Button
            href={`tel:${COMPANY_CONFIG.phones[0].raw}`}
            variant="secondary"
            className="mt-[var(--space-5)] w-full shadow-none"
          >
            Cần gấp? Gọi kỹ sư {COMPANY_CONFIG.phones[0].display}
          </Button>
        </div>
      </Container>
    </section>
  );
}
