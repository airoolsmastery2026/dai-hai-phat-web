"use client";

import { ArrowRight, Bot, CheckCircle2, Sparkles } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const HERO_SCENES = [
  {
    image: "/images/brand/hero-luxury-materials-v1.webp",
    headline: "Trợ lý đang tiếp nhận nhu cầu của bạn.",
    detail: "Mô tả nhu cầu · ảnh hiện trạng · kích thước",
  },
  {
    image: "/images/interior/interior01.webp",
    headline: "Kho dự án đang đối chiếu phương án.",
    detail: "Nội thất · vật liệu · phương án tham chiếu",
  },
  {
    image: "/images/factory/factory01.webp",
    headline: "Kỹ sư đang sẵn sàng xác nhận.",
    detail: "Khảo sát · phương án · báo giá",
  },
] as const;

export function HeroSection() {
  const [sceneIndex, setSceneIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(
      () => setSceneIndex((current) => (current + 1) % HERO_SCENES.length),
      3200,
    );
    return () => window.clearInterval(timer);
  }, []);

  const activeScene = HERO_SCENES[sceneIndex];

  return (
    <section className="relative isolate overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      {HERO_SCENES.map((scene, index) => (
        <Image
          key={scene.image}
          src={scene.image}
          alt=""
          fill
          priority={index === 0}
          sizes="100vw"
          className={`-z-30 object-cover object-[70%_center] transition-opacity duration-1000 motion-reduce:transition-none ${
            sceneIndex === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div
        className="hero-surface-overlay pointer-events-none absolute inset-0 -z-20"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_82%_15%,rgba(195,160,104,0.2),transparent_34%)]"
        aria-hidden="true"
      />
      <div
        className="metallic-rule pointer-events-none absolute inset-x-0 bottom-0 h-px"
        aria-hidden="true"
      />

      <Container className="relative py-[var(--space-8)] sm:py-[var(--space-10)] lg:py-[var(--space-12)]">
        <div className="max-w-[46rem]">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-metal-strong)]">
            Văn phòng kỹ thuật số 24/7
          </p>

          <h1 className="mt-[var(--space-2)] text-[length:var(--font-display)] font-extrabold leading-[1.02] tracking-[-0.04em] text-[var(--color-text)]">
            Thiết kế &amp; thi công
            <span className="block text-[var(--color-wood)]">từ nhu cầu đến hồ sơ kỹ thuật.</span>
          </h1>

          <p className="mt-[var(--space-4)] max-w-2xl text-sm leading-6 text-[var(--color-text-muted)] sm:text-base sm:leading-7">
            Gửi nhu cầu hoặc ảnh hiện trạng. Trợ lý sắp xếp thông tin từng bước và chuyển kỹ sư xác nhận trước khảo sát, phương án và báo giá.
          </p>

          <div className="mt-[var(--space-4)] max-w-xl rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]/92 p-[var(--space-4)] shadow-[var(--shadow-sm)] backdrop-blur-md" aria-live="polite">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-base font-black text-[var(--color-text)] sm:text-lg">
                  {activeScene.headline}
                </p>
                <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
                  {activeScene.detail}
                </p>
              </div>
            </div>
            <div className="mt-[var(--space-3)] flex gap-2" aria-label="Trạng thái quy trình">
              {HERO_SCENES.map((scene, index) => (
                <button
                  key={scene.headline}
                  type="button"
                  onClick={() => setSceneIndex(index)}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    sceneIndex === index ? "bg-[var(--color-primary)]" : "bg-[var(--color-text-muted)]/25"
                  }`}
                  aria-label={`Hiển thị bước ${index + 1}`}
                  aria-pressed={sceneIndex === index}
                />
              ))}
            </div>
          </div>

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
      </Container>
    </section>
  );
}
