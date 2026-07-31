"use client";

import { Mic, MicOff, Radio, Volume2 } from "lucide-react";

import { useGeminiLive } from "@/hooks/useGeminiLive";

function getStatusLabel(status: string): string {
  switch (status) {
    case "connecting":
      return "Đang kết nối…";
    case "listening":
      return "Đang nghe";
    case "speaking":
      return "Gemini đang trả lời";
    case "error":
      return "Đã ngắt kết nối";
    default:
      return "Chưa kết nối";
  }
}

export function GeminiLivePanel() {
  const {
    status,
    error,
    userTranscript,
    assistantTranscript,
    start,
    stop,
  } = useGeminiLive();
  const isActive = status === "connecting" || status === "listening" || status === "speaking";

  return (
    <section
      aria-labelledby="gemini-live-title"
      className="bg-[var(--color-surface-dark)] px-[var(--space-container)] pt-[var(--space-section-compact)] text-[var(--color-text-inverse)] sm:px-[var(--space-container-sm)] lg:px-[var(--space-container-lg)]"
    >
      <div className="mx-auto max-w-7xl rounded-[var(--radius-xl)] border border-[var(--color-border-dark)] bg-[var(--color-surface-dark-soft)] p-[var(--space-card)] sm:p-[var(--space-card-lg)]">
        <div className="flex flex-col gap-[var(--space-stack)] md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-[var(--space-inline)]">
              <span className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)]">
                <Radio aria-hidden="true" className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--color-primary)]">
                  Gemini Live
                </p>
                <h2 id="gemini-live-title" className="text-xl font-bold sm:text-2xl">
                  Trao đổi trực tiếp bằng giọng nói
                </h2>
              </div>
            </div>
            <p className="mt-[var(--space-stack)] text-sm leading-6 text-[var(--color-text-dark-muted)]">
              Nhấn “Bắt đầu”, cho phép microphone, rồi nói ngắn gọn nhu cầu. Có thể ngắt lời
              Gemini bất cứ lúc nào. Báo giá cuối cùng vẫn cần kỹ sư khảo sát xác nhận.
            </p>
          </div>

          <button
            type="button"
            onClick={isActive ? stop : start}
            disabled={status === "connecting"}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-5 py-3 font-bold text-[var(--color-primary-contrast)] transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-dark-soft)] disabled:cursor-wait disabled:opacity-70"
            aria-pressed={isActive}
          >
            {isActive ? <MicOff aria-hidden="true" className="h-5 w-5" /> : <Mic aria-hidden="true" className="h-5 w-5" />}
            {status === "connecting" ? "Đang kết nối…" : isActive ? "Kết thúc" : "Bắt đầu nói"}
          </button>
        </div>

        <div className="mt-[var(--space-stack)] flex items-center gap-2 text-sm" role="status" aria-live="polite">
          <span
            className={`h-2.5 w-2.5 rounded-full ${isActive ? "animate-pulse bg-[var(--color-primary)]" : "bg-[var(--color-text-dark-subtle)]"}`}
            aria-hidden="true"
          />
          <span className="font-semibold">{getStatusLabel(status)}</span>
        </div>

        {error ? (
          <p className="mt-[var(--space-control)] rounded-[var(--radius-md)] border border-red-400/40 bg-red-950/30 p-[var(--space-control)] text-sm leading-6 text-red-100" role="alert">
            {error}
          </p>
        ) : null}

        {userTranscript || assistantTranscript ? (
          <div className="mt-[var(--space-stack)] grid gap-[var(--space-control)] md:grid-cols-2" aria-live="polite">
            <div className="rounded-[var(--radius-md)] border border-[var(--color-border-dark)] p-[var(--space-control)]">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-text-dark-subtle)]">
                Anh/chị nói
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-dark-muted)]">
                {userTranscript || "Đang nghe…"}
              </p>
            </div>
            <div className="rounded-[var(--radius-md)] border border-[var(--color-border-dark)] p-[var(--space-control)]">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-text-dark-subtle)]">
                <Volume2 aria-hidden="true" className="h-4 w-4" /> Gemini trả lời
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-dark-muted)]">
                {assistantTranscript || "Đang chuẩn bị phản hồi…"}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
