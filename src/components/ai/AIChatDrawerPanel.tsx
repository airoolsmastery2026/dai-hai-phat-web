"use client";

import { Bot, CheckCircle2, ImagePlus, RotateCcw, SendHorizontal } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";

import { useAI } from "@/hooks/useAI";
import {
  getConversationHistory,
  getStateLabel,
  resolveConversationChoice,
  type ConversationQuestion,
} from "@/lib/ai";

interface AIChatDrawerPanelProps {
  servicePreset?: string | null;
}

export function AIChatDrawerPanel({ servicePreset = null }: AIChatDrawerPanelProps) {
  const {
    session,
    question,
    error,
    isProcessingImages,
    analysis,
    analysisStatus,
    answer,
    addImages,
    deferImages,
    reset,
    handoff,
    handoffError,
    handoffStatus,
    submitHandoff,
  } = useAI();
  const [draft, setDraft] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const history = useMemo(() => getConversationHistory(session).slice(-6), [session]);

  useEffect(() => {
    if (
      servicePreset &&
      question?.field === "service" &&
      !session.memory.service &&
      question.options?.some((item) => item.value === servicePreset)
    ) {
      answer(servicePreset);
    }
  }, [answer, question, servicePreset, session.memory.service]);

  const submitText = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!question) return;

    const value = draft.trim();
    if (!value && question.required) return;

    if (question.inputType === "choice") {
      const resolved = resolveConversationChoice(question, value);
      if (!resolved) {
        setInputError("Chọn một gợi ý bên trên hoặc mô tả ngắn theo cách của bạn.");
        return;
      }
      answer(resolved);
    } else {
      answer(value);
    }
    setDraft("");
    setInputError(null);
  };

  if (session.state === "DONE") {
    return (
      <div className="flex h-full flex-col bg-[var(--color-background)] text-[var(--color-text)]">
        <div className="flex-1 overflow-y-auto p-[var(--space-4)] sm:p-[var(--space-5)]">
          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-5)] shadow-[var(--shadow-sm)]">
            <CheckCircle2 className="h-8 w-8 text-[var(--color-success)]" aria-hidden="true" />
            <h2 className="mt-[var(--space-3)] text-xl font-black">Hồ sơ tư vấn đã sẵn sàng</h2>
            <p className="mt-[var(--space-2)] text-sm leading-6 text-[var(--color-text-muted)]">
              Dữ liệu đã được lưu trên thiết bị. Kỹ sư chỉ nhận hồ sơ khi bạn chủ động bàn giao.
            </p>
            {handoff ? (
              <p className="mt-[var(--space-4)] rounded-[var(--radius-md)] bg-[var(--color-success-soft)] p-[var(--space-3)] text-sm font-semibold text-[var(--color-success-text)]">
                Đã bàn giao hồ sơ #{handoff.leadId}.
              </p>
            ) : (
              <button
                type="button"
                onClick={submitHandoff}
                disabled={handoffStatus === "submitting"}
                className="mt-[var(--space-4)] min-h-11 w-full rounded-[var(--radius-md)] bg-[var(--color-primary)] px-[var(--space-4)] text-sm font-bold text-[var(--color-primary-contrast)] disabled:opacity-60"
              >
                {handoffStatus === "submitting" ? "Đang bàn giao…" : "Bàn giao cho kỹ sư"}
              </button>
            )}
            {handoffError ? (
              <p className="mt-[var(--space-3)] text-sm text-[var(--color-danger-text)]" role="alert">
                {handoffError}
              </p>
            ) : null}
            <button
              type="button"
              onClick={reset}
              className="mt-[var(--space-3)] min-h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-[var(--space-4)] text-sm font-bold"
            >
              Bắt đầu hồ sơ mới
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-[var(--color-background)] text-[var(--color-text)]">
      <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-[var(--space-4)] py-[var(--space-3)]">
        <div className="flex items-center justify-between gap-[var(--space-3)]">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm font-black">
              <span className="h-2 w-2 rounded-full bg-[var(--color-success)] motion-safe:animate-pulse" aria-hidden="true" />
              Đại Hải Phát đang sẵn sàng hỗ trợ
            </p>
            <p className="mt-1 truncate text-xs text-[var(--color-text-muted)]">
              {getStateLabel(session.state)} · Hồ sơ {session.proposal.progress}%
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] text-[var(--color-text-muted)]"
            aria-label="Bắt đầu lại hồ sơ tư vấn"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-[var(--space-3)] h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-muted)]">
          <div
            className="h-full rounded-full bg-[var(--color-primary)] transition-[width] duration-500"
            style={{ width: `${session.proposal.progress}%` }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-[var(--space-4)] py-[var(--space-4)] sm:px-[var(--space-5)]" aria-live="polite">
        {!history.length ? (
          <AssistantMessage>
            Chào bạn! Hãy kể ngắn gọn nhu cầu. Tôi sẽ hỏi từng bước để lập hồ sơ cho kỹ sư.
          </AssistantMessage>
        ) : null}

        <div className="space-y-[var(--space-3)]">
          {history.map((item) => (
            <div key={item.field} className="flex justify-end">
              <div className="max-w-[84%] rounded-[var(--radius-lg)] rounded-br-[var(--radius-sm)] bg-[var(--color-primary)] px-[var(--space-3)] py-[var(--space-2)] text-sm text-[var(--color-primary-contrast)]">
                <p className="text-[11px] font-semibold opacity-75">{item.label}</p>
                <p className="mt-0.5 font-semibold leading-5">{item.value}</p>
              </div>
            </div>
          ))}

          {analysisStatus === "loading" ? (
            <AssistantMessage>Đang đối chiếu hồ sơ và dữ liệu dự án…</AssistantMessage>
          ) : analysisStatus === "ready" && analysis ? (
            <AssistantMessage>{analysis.recommendation}</AssistantMessage>
          ) : null}

          {question ? (
            <div className="flex items-end gap-[var(--space-2)]">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)] text-[var(--color-primary-contrast)]">
                <Bot className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="max-w-[86%] rounded-[var(--radius-lg)] rounded-bl-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-3)] shadow-[var(--shadow-sm)]">
                <p className="text-sm font-bold leading-6">{question.prompt}</p>
                <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">{question.supportingText}</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {question ? (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-3)] sm:p-[var(--space-4)]">
          {question.inputType === "choice" && question.options?.length ? (
            <div className="mb-[var(--space-3)] flex max-h-32 flex-wrap gap-2 overflow-y-auto">
              {question.options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    answer(option.value);
                    setDraft("");
                    setInputError(null);
                  }}
                  className="min-h-9 rounded-full border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-1.5 text-xs font-semibold transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : null}

          {question.inputType === "file" ? (
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-4 text-sm font-bold text-[var(--color-primary-contrast)]">
                <ImagePlus className="h-4 w-4" aria-hidden="true" />
                {isProcessingImages ? "Đang xử lý…" : "Gửi ảnh hiện trạng"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="sr-only"
                  disabled={isProcessingImages}
                  onChange={(event) => void addImages(event.currentTarget.files)}
                />
              </label>
              <button
                type="button"
                onClick={deferImages}
                className="min-h-11 rounded-[var(--radius-md)] border border-[var(--color-border)] px-4 text-sm font-bold"
              >
                Bổ sung ảnh sau
              </button>
            </div>
          ) : (
            <form onSubmit={submitText} className="flex items-end gap-2">
              <label htmlFor="ai-drawer-answer" className="sr-only">Câu trả lời</label>
              <input
                id="ai-drawer-answer"
                type={question.inputType === "tel" || question.inputType === "email" ? question.inputType : "text"}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={question.inputType === "choice" ? "Hoặc gõ câu trả lời…" : "Nhập câu trả lời…"}
                className="min-h-11 min-w-0 flex-1 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)]"
              />
              <button
                type="submit"
                aria-label="Gửi câu trả lời"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)] text-[var(--color-primary-contrast)]"
              >
                <SendHorizontal className="h-4 w-4" aria-hidden="true" />
              </button>
              {!question.required && question.inputType !== "choice" ? (
                <button
                  type="button"
                  onClick={() => answer("")}
                  className="min-h-11 rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-xs font-bold"
                >
                  Bỏ qua
                </button>
              ) : null}
            </form>
          )}

          {inputError || error ? (
            <p className="mt-2 text-xs leading-5 text-[var(--color-danger-text)]" role="alert">
              {inputError || error}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function AssistantMessage({ children }: { children: string }) {
  return (
    <div className="mb-[var(--space-3)] flex items-end gap-[var(--space-2)]">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)] text-[var(--color-primary-contrast)]">
        <Bot className="h-4 w-4" aria-hidden="true" />
      </span>
      <p className="max-w-[86%] rounded-[var(--radius-lg)] rounded-bl-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-3)] text-sm leading-6 shadow-[var(--shadow-sm)]">
        {children}
      </p>
    </div>
  );
}
