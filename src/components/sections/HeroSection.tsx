import { ArrowRight, Bot } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-background)]">
      <Container className="py-[var(--space-6)] sm:py-[var(--space-8)] lg:py-[var(--space-10)]">
        <div className="grid items-center gap-[var(--space-5)] lg:grid-cols-[0.82fr_1.18fr] lg:gap-[var(--space-8)]">
          <div className="relative z-10 order-2 py-[var(--space-2)] lg:order-1 lg:py-[var(--space-6)]">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-wood)]">
              Đại Hải Phát · Thiết kế &amp; thi công
            </p>
            <h1 className="mt-[var(--space-3)] max-w-[38rem] text-[length:var(--font-h1)] font-extrabold leading-[1.06] tracking-[-0.04em] text-[var(--color-text)]">
              Không gian sống đẹp, giải pháp thi công chỉn chu.
            </h1>
            <p className="mt-[var(--space-3)] max-w-[34rem] text-sm leading-6 text-[var(--color-text-muted)] sm:text-base sm:leading-7">
              Tư vấn, thiết kế và hoàn thiện nhà ở theo nhu cầu thực tế — từ kiến trúc, nội thất đến cửa, cổng, cầu thang, lan can và mái che.
            </p>
            <div className="mt-[var(--space-5)] flex flex-wrap gap-[var(--space-2)]">
              <Button href="/ai-tu-van?ai=1#consultation">
                <Bot className="h-4 w-4" aria-hidden="true" />
                Trao đổi nhu cầu
              </Button>
              <Button href="/gallery" variant="secondary">
                Xem thư viện hình ảnh
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
            <p className="mt-[var(--space-4)] text-xs font-medium text-[var(--color-text-subtle)]">
              Tiếp nhận yêu cầu · Khảo sát hiện trạng · Kỹ sư xác nhận phương án
            </p>
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
