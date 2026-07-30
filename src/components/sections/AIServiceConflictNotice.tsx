"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { readAIDraft } from "@/lib/ai/persistence";

const DRAFT_STORAGE_KEY = "dhp-ai-sales-engine-draft-v1";
const RESET_LABEL = "Xóa hồ sơ đã lưu và bắt đầu lại";

export function AIServiceConflictNotice({
  requestedService,
}: {
  requestedService: string | null;
}) {
  const router = useRouter();
  const [currentService, setCurrentService] = useState<string | null>(null);
  const continueButtonRef = useRef<HTMLButtonElement>(null);
  const newDraftButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!requestedService) {
      setCurrentService(null);
      return;
    }

    try {
      const draft = readAIDraft(window.localStorage.getItem(DRAFT_STORAGE_KEY));
      const savedService =
        draft.status === "ready" ? draft.session.memory.service ?? null : null;

      setCurrentService(
        savedService && savedService !== requestedService ? savedService : null,
      );
    } catch {
      setCurrentService(null);
    }
  }, [requestedService]);

  useEffect(() => {
    if (!currentService) return;

    continueButtonRef.current?.focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        router.replace("/#ai-office", { scroll: false });
        setCurrentService(null);
        return;
      }

      if (event.key !== "Tab") return;
      const first = continueButtonRef.current;
      const last = newDraftButtonRef.current;
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentService, router]);

  if (!requestedService || !currentService) return null;

  const continueCurrentDraft = () => {
    router.replace("/#ai-office", { scroll: false });
    setCurrentService(null);
  };

  const startNewDraft = () => {
    const resetButton = document.querySelector<HTMLButtonElement>(
      `#ai-office button[aria-label="${RESET_LABEL}"]`,
    );
    resetButton?.click();
    setCurrentService(null);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end bg-black/60 p-[var(--space-container)] sm:items-center sm:justify-center">
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="ai-service-conflict-title"
        aria-describedby="ai-service-conflict-description"
        className="w-full max-w-xl rounded-[var(--radius-xl)] border border-[var(--color-border-dark)] bg-[var(--color-surface-dark-soft)] p-[var(--space-card)] text-[var(--color-text-inverse)] shadow-[var(--shadow-lg)] sm:p-[var(--space-card-lg)]"
      >
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-primary-soft-text)]">
          Bảo vệ hồ sơ đang làm
        </p>
        <h2
          id="ai-service-conflict-title"
          className="mt-[var(--space-control)] text-2xl font-bold"
        >
          Anh/chị đang có hồ sơ “{currentService}”
        </h2>
        <p
          id="ai-service-conflict-description"
          className="mt-[var(--space-control)] text-sm leading-6 text-[var(--color-text-dark-muted)]"
        >
          CTA vừa chọn dành cho “{requestedService}”. Hồ sơ hiện tại sẽ không bị
          thay đổi trừ khi anh/chị chủ động bắt đầu hồ sơ mới.
        </p>
        <div className="mt-[var(--space-stack)] grid gap-[var(--space-control)] sm:grid-cols-2">
          <button
            ref={continueButtonRef}
            type="button"
            onClick={continueCurrentDraft}
            className="min-h-[var(--control-min-size)] rounded-[var(--radius-md)] border border-[var(--color-border-dark)] px-[var(--space-stack)] font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          >
            Tiếp tục hồ sơ hiện tại
          </button>
          <button
            ref={newDraftButtonRef}
            type="button"
            onClick={startNewDraft}
            className="min-h-[var(--control-min-size)] rounded-[var(--radius-md)] bg-[var(--color-primary)] px-[var(--space-stack)] font-bold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-dark)]"
          >
            Bắt đầu hồ sơ “{requestedService}”
          </button>
        </div>
      </section>
    </div>
  );
}
