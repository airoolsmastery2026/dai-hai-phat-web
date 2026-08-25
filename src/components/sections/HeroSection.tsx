import { ArrowRight, Bot, CheckCircle2, Circle, Sparkles } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const PROJECT_STEPS = [
  { label: "Tiếp nhận thông tin", status: "Hoàn tất", complete: true },
  { label: "Khảo sát & đo đạc", status: "Hoàn tất", complete: true },
  { label: "Đối chiếu phương án", status: "Đang xử lý", complete: true },
  { label: "Dự toán & báo giá", status: "Chờ xử lý", complete: false },
  { label: "Ký kết & triển khai", status: "Chờ xử lý", complete: false },
] as const;

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-background)]">
      <Container className="py-[var(--space-8)] sm:py-[var(--space-10)] lg:py-[var(--space-4)]">
        <div className="grid items-center gap-[var(--space-6)] lg:grid-cols-[0.95fr_1.15fr] lg:gap-[var(--space-8)]">
          <div className="relative z-20 py-[var(--space-4)] lg:py-[var(--space-10)]">
            <div className="inline-flex items-center gap-[var(--space-3)]">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[var(--color-wood)] sm:text-xs">
                Văn phòng kỹ thuật số 24/7
              </p>
              <span className="hidden h-px w-10 bg-[var(--color-metal)] sm:block" aria-hidden="true" />
            </div>

            <h1 className="mt-[var(--space-3)] max-w-[38rem] text-[length:var(--font-h1)] font-extrabold leading-[1.04] tracking-[-0.04em] text-[var(--color-text)]">
              <span className="block">Thiết kế &amp; thi công</span>
              <span className="mt-1 block text-[var(--color-wood)]">từ nhu cầu đến</span>
              <span className="block text-[var(--color-wood)]">hồ sơ kỹ thuật.</span>
            </h1>

            <p className="mt-[var(--space-4)] max-w-[35rem] text-sm leading-6 text-[var(--color-text-muted)] sm:text-base sm:leading-7">
              Gửi nhu cầu hoặc ảnh hiện trạng. Trợ lý sắp xếp thông tin từng bước và chuyển kỹ sư xác nhận trước khảo sát, phương án và báo giá.
            </p>

            <div className="mt-[var(--space-5)] flex flex-wrap gap-[var(--space-2)]">
              <Button href="/ai-tu-van?ai=1#consultation">
                <Bot className="h-4 w-4" aria-hidden="true" />
                Bắt đầu tư vấn
              </Button>
              <Button href="/bao-gia" variant="secondary">
                Chuẩn bị báo giá
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>

            <ul className="mt-[var(--space-4)] flex flex-wrap gap-x-[var(--space-5)] gap-y-[var(--space-2)] text-xs font-semibold text-[var(--color-text-muted)] sm:text-sm">
              {["Tiếp nhận 24/7", "Lưu hồ sơ từng bước", "Kỹ sư kiểm tra đầu ra"].map((item) => (
                <li key={item} className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 lg:min-h-[30rem]">
            <div className="relative aspect-[16/11] overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] shadow-[var(--shadow-md)] lg:absolute lg:inset-y-0 lg:right-0 lg:w-[95%]">
              <Image
                src="/images/brand/hero-luxury-materials-v1.webp"
                alt="Không gian nội thất hiện đại minh họa cho quy trình thiết kế và thi công Đại Hải Phát"
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 56vw"
                className="object-cover object-center"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.08),transparent_45%)]"
                aria-hidden="true"
              />
            </div>

            <div className="relative z-20 mx-[var(--space-3)] -mt-[var(--space-8)] rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)]/95 p-[var(--space-4)] shadow-[var(--shadow-lg)] backdrop-blur-xl sm:mx-[var(--space-6)] sm:p-[var(--space-5)] lg:absolute lg:left-0 lg:top-1/2 lg:mx-0 lg:mt-0 lg:w-[19.5rem] lg:-translate-x-[var(--space-6)] lg:-translate-y-1/2">
              <div className="flex items-start gap-[var(--space-3)]">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                  <Sparkles className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[var(--color-text-muted)]">Kho dự án</p>
                  <p className="mt-1 text-base font-black leading-5 text-[var(--color-text)]">Đang đối chiếu phương án</p>
                  <p className="mt-1 text-[11px] font-semibold text-[var(--color-primary)]">Nội thất · Phương án tham chiếu</p>
                </div>
              </div>

              <div className="mt-[var(--space-4)] flex items-center gap-[var(--space-3)]">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--color-surface-strong)]">
                  <div className="h-full w-2/5 rounded-full bg-[var(--color-primary)]" />
                </div>
                <span className="text-[11px] font-semibold text-[var(--color-text-muted)]">Bước 2/5</span>
              </div>

              <ul className="mt-[var(--space-4)] space-y-[var(--space-3)] border-t border-[var(--color-border)] pt-[var(--space-4)]">
                {PROJECT_STEPS.map((step) => (
                  <li key={step.label} className="flex items-center gap-[var(--space-2)] text-[11px]">
                    {step.complete ? (
                      <CheckCircle2 className="size-4 shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
                    ) : (
                      <Circle className="size-4 shrink-0 text-[var(--color-text-subtle)]" aria-hidden="true" />
                    )}
                    <span className={`min-w-0 flex-1 font-semibold ${step.complete ? "text-[var(--color-text)]" : "text-[var(--color-text-subtle)]"}`}>
                      {step.label}
                    </span>
                    <span className={step.complete ? "text-[var(--color-text-muted)]" : "text-[var(--color-text-subtle)]"}>
                      {step.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
