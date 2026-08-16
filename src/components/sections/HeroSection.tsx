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
    headline: "AI đang tiếp nhận nhu cầu của bạn.",
    label: "Tiếp nhận yêu cầu",
    detail: "Mô tả nhu cầu · ảnh hiện trạng · kích thước",
  },
  {
    image: "/images/interior/interior01.webp",
    headline: "Kho dự án đang đối chiếu phương án.",
    label: "Đối chiếu dữ liệu",
    detail: "Nội thất · vật liệu · phương án tham chiếu",
  },
  {
    image: "/images/factory/factory01.webp",
    headline: "Kỹ sư đang sẵn sàng xác nhận.",
    label: "Sẵn sàng bàn giao",
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

      <Container className="relative py-[var(--space-6)] sm:py-[var(--space-8)] lg:py-[var(--space-10)]">
        <div className="mb-[var(--space-4)] flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]/92 px-[var(--space-4)] py-[var(--space-3)] shadow-[var(--shadow-sm)] backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--color-success)] opacity-70 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--color-success)]" />
            </span>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--color-primary)]">
              Đại Hải Phát · Live
            </p>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-bold text-[var(--color-text-muted)] sm:text-xs">
            <span>AI: Sẵn sàng</span>
            <span>Dữ liệu: Đã kết nối</span>
            <span>Kỹ sư: Trực tuyến</span>
          </div>
        </div>

        <div className="grid items-center gap-[var(--space-5)] lg:min-h-[24rem] lg:grid-cols-[1.08fr_0.72fr] lg:gap-[var(--space-8)]">
          <div className="max-w-[43rem]">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-metal-strong)]">
              Văn phòng kỹ thuật số 24/7
            </p>

            <h1 className="mt-[var(--space-2)] text-[length:var(--font-display)] font-extrabold leading-[1.02] tracking-[-0.04em] text-[var(--color-text)]">
              Thiết kế &amp; thi công
              <span className="block text-[var(--color-wood)]">đang hoạt động ngay lúc này.</span>
            </h1>

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
            </div>

            <p className="mt-[var(--space-4)] max-w-xl text-sm leading-6 text-[var(--color-text-muted)] sm:text-base sm:leading-7">
              Gửi nhu cầu hoặc ảnh hiện trạng. AI lập hồ sơ từng bước và chuyển kỹ sư xác nhận trước khảo sát, phương án và báo giá.
            </p>

            <div className="mt-[var(--space-5)] flex flex-wrap gap-[var(--space-2)]">
              <Button href="/ai-tu-van?ai=1">
                <Bot className="h-4 w-4" aria-hidden="true" />
                Mở chat ngay
              </Button>
              <Button href="/gallery" variant="secondary">
                Xem công trình
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>

            <ul className="mt-[var(--space-4)] flex flex-wrap gap-x-[var(--space-5)] gap-y-[var(--space-2)] text-xs font-semibold text-[var(--color-text-muted)] sm:text-sm">
              {["Chat mở tức thì", "Hồ sơ tự lưu", "Kỹ sư kiểm tra đầu ra"].map((item) => (
                <li key={item} className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <aside className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border-dark)] bg-[var(--color-surface-dark)]/95 text-white shadow-[var(--shadow-lg)] backdrop-blur-md">
            <div className="flex items-center justify-between gap-4 border-b border-white/15 px-[var(--space-4)] py-[var(--space-3)] sm:px-[var(--space-5)]">
              <div>
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-text-dark-muted)]">
                  <Radio className="h-4 w-4" aria-hidden="true" /> Live workflow
                </p>
                <p className="mt-1 text-sm font-black text-white">Luồng xử lý đang chạy</p>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-black text-white">
                ONLINE
              </span>
            </div>

            <div className="p-[var(--space-4)] sm:p-[var(--space-5)]">
              <div className="rounded-[var(--radius-lg)] border border-white/15 bg-white/10 p-[var(--space-4)]" aria-live="polite">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-text-dark-muted)]">
                  Đang xử lý
                </p>
                <p className="mt-2 text-base font-black text-white">{activeScene.label}</p>
                <p className="mt-1 text-xs leading-5 text-[var(--color-text-dark-muted)]">{activeScene.detail}</p>
              </div>

              <div className="mt-[var(--space-3)] flex gap-2" aria-label="Trạng thái hero">
                {HERO_SCENES.map((scene, index) => (
                  <button
                    key={scene.label}
                    type="button"
                    onClick={() => setSceneIndex(index)}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      sceneIndex === index ? "bg-white" : "bg-white/25"
                    }`}
                    aria-label={`Hiển thị trạng thái ${index + 1}: ${scene.label}`}
                    aria-pressed={sceneIndex === index}
                  />
                ))}
              </div>

              <ol className="mt-[var(--space-4)] grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                {DELIVERY_STEPS.map((item, index) => {
                  const active = index === sceneIndex || (sceneIndex === 2 && index === 3);
                  return (
                    <li
                      key={item}
                      className={`flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-xs font-semibold transition-colors duration-500 ${
                        active ? "bg-white/12 text-white" : "text-[var(--color-text-dark-muted)]"
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${
                          active ? "bg-white text-[var(--color-surface-dark)]" : "bg-white/10 text-white/70"
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
                className="mt-[var(--space-4)] flex min-h-11 items-center justify-center rounded-[var(--radius-md)] border border-white/20 bg-white/10 px-[var(--space-4)] text-center text-sm font-bold text-white transition hover:bg-white/15"
              >
                Cần gấp? Gọi kỹ sư {COMPANY_CONFIG.phones[0].display}
              </a>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
