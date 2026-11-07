import { ArrowRight, Bot, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-background)]">
      <Container className="py-[var(--space-6)] sm:py-[var(--space-8)] lg:py-[var(--space-10)]">
        <div className="grid items-center gap-[var(--space-5)] lg:grid-cols-[0.95fr_1.15fr] lg:gap-[var(--space-8)]">
          <div className="relative z-10 order-2 py-[var(--space-2)] lg:order-1 lg:py-[var(--space-6)]">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-wood)]">
              Văn phòng kỹ thuật số 24/7 · Đại Hải Phát
            </p>
            <h1 className="mt-[var(--space-3)] max-w-[38rem] text-[length:var(--font-h1)] font-extrabold leading-[1.06] tracking-[-0.04em] text-[var(--color-text)]">
              <span className="block">Thiết kế &amp; thi công</span>
              <span className="mt-1 block text-[var(--color-wood)]">từ nhu cầu đến</span>
              <span className="block text-[var(--color-wood)]">hồ sơ kỹ thuật.</span>
            </h1>
            <p className="mt-[var(--space-3)] max-w-[34rem] text-sm leading-6 text-[var(--color-text-muted)] sm:text-base sm:leading-7">
              Tư vấn, thiết kế và hoàn thiện nhà ở theo hiện trạng thực tế — từ kiến trúc, nội thất đến cửa, cổng, cầu thang, lan can và mái che. Chuẩn bị báo giá với thông tin và kích thước được kỹ sư xác nhận.
            </p>
            <div className="mt-[var(--space-5)] flex flex-wrap gap-[var(--space-2)]">
              <Button href="/ai-tu-van?ai=1#consultation">
                <Bot className="h-4 w-4" aria-hidden="true" />
                Bắt đầu tư vấn
              </Button>
              <Button href="/bao-gia" variant="secondary">
                <FileText className="h-4 w-4" aria-hidden="true" />
                Chuẩn bị báo giá
              </Button>
            </div>
            <div className="mt-[var(--space-4)] flex flex-wrap items-center gap-x-[var(--space-3)] gap-y-[var(--space-2)] text-xs font-medium text-[var(--color-text-subtle)]">
              <span>Tiếp nhận yêu cầu</span>
              <span aria-hidden="true">·</span>
              <span>Đang đối chiếu phương án</span>
              <span aria-hidden="true">·</span>
              <span>Kỹ sư xác nhận</span>
              <Link
                href="/gallery"
                className="inline-flex min-h-9 items-center gap-1 font-bold text-[var(--color-primary)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
              >
                Kho dự án <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="relative order-1 aspect-[16/10] overflow-hidden rounded-[var(--radius-xl)] bg-[var(--color-surface-muted)] lg:order-2 lg:aspect-[5/4]">
            <Image
              src="/images/brand/hero-luxury-materials-v1.webp"
              alt="Không gian nội thất hiện đại minh họa giải pháp thiết kế và hoàn thiện của Đại Hải Phát"
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 60vw"
              className="object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
