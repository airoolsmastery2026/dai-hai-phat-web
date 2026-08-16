"use client";

import { ArrowRight, Bot, CheckCircle2, Radio, Sparkles } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { COMPANY_CONFIG } from "@/content/company";

const HERO_SCENES = [
  {
    image: "/images/brand/hero-luxury-materials-v1.webp",
    label: "AI đang tiếp nhận yêu cầu mới",
    detail: "Mô tả nhu cầu · ảnh hiện trạng · kích thước",
  },
  {
    image: "/images/interior/interior01.webp",
    label: "Kho dự án đang sẵn sàng đối chiếu",
    detail: "Nội thất · vật liệu · phương án tham chiếu",
  },
  {
    image: "/images/factory/factory01.webp",
    label: "Kỹ sư sẵn sàng xác nhận hồ sơ",
    detail: "Khảo sát · phương án · báo giá",
  },
] as const;

const DELIVERY_STEPS = [
  "Tiếp nhận nhu cầu",
  "Đối chiếu dữ liệu",
  "Lập hồ sơ sơ bộ",
  "Kỹ sư xác nhận",
] as const;

export function HeroSection() {
  const [sceneIndex, setSceneIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(
      () => setSceneIndex((current) => (current + 1) % HERO_SCENES.length),
      4200,
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
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_18%,rgba(195,160,104,0.18),transparent_32%)]"
        aria-hidden="true"
      />
      <div
        className="metallic-rule pointer-events-none absolute inset-x-0 bottom-0 h-px"
        aria-hidden="true"
      />

      <Container className="relative grid items-center gap-[var(--space-6)] py-[var(--space-7)] sm:py-[var(--space-9)] lg:min-h-[31rem] lg:grid-cols-[1.08fr_0.72fr] lg:gap-[var(--space-8)] lg:py-[var(--space-12)]">
        <div className="max-w-[42rem]">
          <span className="inline-flex items-center gap-[var(--space-2)] rounded-[var(--radius-full)] border border-[var(--color-metal)]/45 bg-[var(--color-surface)]/88 px-[var(--space-3)] py-[var(--space-2)] text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-metal-strong)] shadow-[var(--shadow-sm)] backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--color-success)] opacity-70 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--color-success)]" />
            </span>
            Hệ thống đang hoạt động 24/7
          </span>

          <h1 className="mt-[var(--space-3)] text-[length:var(--font-display)] font-extrabold leading-[1.02] tracking-[-0.04em] text-[var(--color-text)]">
            Thiết kế &amp; thi công nhà ở
            <span className="mt-[var(--space-2)] block text-[var(--color-wood)]">
              bắt đầu bằng một cuộc trò chuyện.
            </span>
          </h1>

          <p className="mt-[var(--space-3)] max-w-xl text-base leading-7 text-[var(--color-text-muted)] sm:text-lg">
            Gửi nhu cầu, ảnh hiện trạng hoặc kích thước nếu có. AI lập hồ sơ từng bước,
            đối chiếu dữ liệu và chuyển kỹ sư xác nhận trước khảo sát và báo giá.
          </p>

          <div className="mt-[var(--space-5)] flex flex-wrap gap-[var(--space-2)]">
            <Button href="/ai-tu-van?ai=1">
              <Bot className="h-4 w-4" aria-hidden="true" />
              Chat với AI ngay
            </Button>
            <Button href="/gallery" variant="secondary">
              Xem công trình
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>

          <ul className="mt-[var(--space-4)] flex flex-wrap gap-x-[var(--space-5)] gap-y-[var(--space-2)] text-sm text-[var(--color-text-muted)]">
            {["Không cần cuộn trang", "Hồ sơ tự lưu", "Kỹ sư kiểm tra đầu ra"].map((item) => (
              <li key={item} className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <aside className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)]/90 p-[var(--space-4)] shadow-[var(--shadow-lg)] backdrop-blur-md sm:p-[var(--space-5)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-primary)]">
                <Radio className="h-4 w-4" aria-hidden="true" /> Live workflow
              </p>
              <p className="mt-1 text-sm font-black text-[var(--color-text)]">Văn phòng kỹ thuật số Đại Hải Phát</p>
            </div>
            <span className="rounded-full bg-[var(--color-success-soft)] px-3 py-1 text-[11px] font-bold text-[var(--color-success-text)]">
              ONLINE
            </span>
          </div>

          <div
            className="mt-[var(--space-4)] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background)] p-[var(--space-4)]"
            aria-live="polite"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-black text-[var(--color-text)]">{activeScene.label}</p>
                <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">{activeScene.detail}</p>
              </div>
            </div>
          </div>

          <ol className="mt-[var(--space-3)] grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {DELIVERY_STEPS.map((item, index) => {
              const active = index === sceneIndex || (sceneIndex === 2 && index === 3);
              return (
                <li
                  key={item}
                  className={`flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-xs font-semibold transition-colors duration-500 ${
                    active
                      ? "bg-[var(--color-primary-soft)] text-[var(--color-primary-soft-text)]"
                      : "text-[var(--color-text-muted)]"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${
                      active
                        ? "bg-[var(--color-primary)] text-[var(--color-primary-contrast)]"
                        : "bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]"
                    }`}
                  >
                    {index + 1}
                  </span>
                  {item}
                </li>
              );
            })}
          </ol>

          <a
            href={`tel:${COMPANY_CONFIG.phones[0].raw}`}
            className="mt-[var(--space-4)] flex min-h-11 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-[var(--space-4)] text-center text-sm font-bold text-[var(--color-text)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          >
            Cần gấp? Gọi kỹ sư {COMPANY_CONFIG.phones[0].display}
          </a>
        </aside>
      </Container>
    </section>
  );
}
