import { ArrowRight, Bot, CheckCircle2 } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { COMPANY_CONFIG } from "@/content/company";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-surface-dark)] text-white">
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-[var(--radius-full)] bg-[var(--color-primary)] opacity-[0.16] blur-3xl"
        aria-hidden="true"
      />
      <Container className="relative grid min-h-[calc(100svh-4rem)] items-center gap-[var(--space-12)] py-[var(--space-16)] lg:min-h-[calc(100svh-5rem)] lg:grid-cols-[1.15fr_0.85fr]">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-[var(--space-2)] rounded-[var(--radius-full)] border border-[var(--color-primary)]/40 bg-[var(--color-primary)]/10 px-[var(--space-3)] py-[var(--space-2)] text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-primary-soft-text)]">
            <Bot className="h-4 w-4" aria-hidden="true" /> AI Engineering Office 24/7
          </span>

          <h1 className="mt-[var(--space-6)] text-4xl font-black leading-[1.08] tracking-[-0.04em] text-white sm:text-5xl lg:text-7xl">
            Tư vấn cơ khí & nội thất
            <span className="block text-[var(--color-primary-soft-text)]">
              từ nhu cầu đến phương án.
            </span>
          </h1>

          <p className="mt-[var(--space-6)] max-w-2xl text-base leading-7 text-[var(--color-text-dark-muted)] sm:text-lg sm:leading-8">
            Trả lời từng câu hỏi ngắn để hệ thống ghi nhận hạng mục, vật liệu,
            dữ liệu hiện trạng và chuẩn bị hồ sơ sơ bộ trước khi kỹ sư khảo sát.
          </p>

          <div className="mt-[var(--space-10)] flex flex-wrap gap-[var(--space-4)]">
            <a
              href="#ai-office"
              className="inline-flex min-h-[var(--control-min-size)] items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] bg-[var(--color-primary)] px-[var(--space-6)] py-[var(--space-3)] font-bold text-white transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-primary-hover)]"
            >
              Bắt đầu tư vấn <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </a>
            <a
              href="/gallery"
              className="inline-flex min-h-[var(--control-min-size)] items-center justify-center rounded-[var(--radius-md)] border border-white/30 px-[var(--space-6)] py-[var(--space-3)] font-bold text-white transition-colors duration-[var(--duration-fast)] hover:bg-white hover:text-[var(--color-surface-dark)]"
            >
              Xem công trình
            </a>
          </div>

          <div className="mt-[var(--space-8)] flex flex-wrap gap-x-[var(--space-6)] gap-y-[var(--space-3)] text-sm text-[var(--color-text-dark-muted)]">
            {["Một câu hỏi mỗi bước", "Không báo giá khi thiếu dữ liệu", "Kỹ sư xác nhận phương án"].map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--color-primary-soft-text)]" aria-hidden="true" /> {item}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border-dark)] bg-[var(--color-surface-dark-soft)] p-[var(--space-5)] shadow-[var(--shadow-lg)] sm:p-[var(--space-8)]">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-primary-soft-text)]">
            Quy trình kỹ thuật số
          </p>
          <ol className="mt-[var(--space-5)] space-y-[var(--space-4)]">
            {["Chọn hạng mục cần tư vấn", "Xác định vật liệu và dữ liệu hiện trạng", "Nhận proposal sơ bộ", "Chuyển hồ sơ cho kỹ sư khảo sát"].map((item, index) => (
              <li key={item} className="flex gap-[var(--space-4)] rounded-[var(--radius-lg)] bg-[var(--color-surface-dark-muted)] p-[var(--space-4)]">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-primary)] font-black">{index + 1}</span>
                <span className="self-center font-semibold">{item}</span>
              </li>
            ))}
          </ol>
          <a href={`tel:${COMPANY_CONFIG.phones[0].raw}`} className="mt-[var(--space-5)] block text-center text-sm font-semibold text-[var(--color-text-dark-muted)]">
            Cần gấp? Gọi kỹ sư: <span className="text-white">{COMPANY_CONFIG.phones[0].display}</span>
          </a>
        </div>
      </Container>
    </section>
  );
}
