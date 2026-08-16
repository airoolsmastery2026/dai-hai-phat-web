"use client";

import { Bot, CheckCircle2, ImagePlus, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AIChatAnswerComposer } from "@/components/ai/AIChatAnswerComposer";
import { useAI } from "@/hooks/useAI";
import {
  getConversationHistory,
  getStateLabel,
} from "@/lib/ai";
import type { ConversationHistoryItem } from "@/lib/ai";
import type { ContactVerificationReceipt } from "@/lib/ai/contact-verification";
import { buildConversationAcknowledgement } from "@/lib/ai/conversation-acknowledgement";

interface AIChatDrawerPanelProps {
  servicePreset?: string | null;
}

function humanizePublicCopy(value: string): string {
  return value.replace(/\bAI\b/g, "trợ lý");
}

function displayHistoryValue(item: ConversationHistoryItem): string {
  if (item.field === "phone" || item.field === "zalo") {
    const digits = item.value.replace(/\D/g, "");
    return digits.length >= 7
      ? `${digits.slice(0, 3)}••••${digits.slice(-3)}`
      : "Đã ghi nhận";
  }
  if (item.field === "email") {
    const [local, domain] = item.value.split("@");
    if (local && domain) return `${local.slice(0, 2)}•••@${domain}`;
  }
  return item.value;
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
  const [handoffConsent, setHandoffConsent] = useState(false);
  const [verificationReceipt, setVerificationReceipt] =
    useState<ContactVerificationReceipt | null>(null);
  const history = useMemo(() => getConversationHistory(session).slice(-6), [session]);
  const contextualAcknowledgement = buildConversationAcknowledgement(
    history.at(-1),
    verificationReceipt,
  );

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

  const handleAnswer = (
    value: string,
    receipt: ContactVerificationReceipt | null = null,
  ) => {
    setVerificationReceipt(receipt);
    answer(value);
  };

  const handleReset = () => {
    setHandoffConsent(false);
    setVerificationReceipt(null);
    reset();
  };

  if (session.state === "DONE") {
    return (
      <div className="flex h-full min-h-0 min-w-0 w-full flex-col overflow-hidden bg-[var(--color-background)] text-[var(--color-text)]">
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-[var(--space-4)] sm:p-[var(--space-5)]">
          <div className="min-w-0 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-4)] shadow-[var(--shadow-sm)] sm:p-[var(--space-5)]">
            <CheckCircle2 className="h-8 w-8 text-[var(--color-success)]" aria-hidden="true" />
            <h2 className="mt-[var(--space-3)] break-words text-xl font-black">Hồ sơ của bạn đã sẵn sàng</h2>
            <p className="mt-[var(--space-2)] break-words text-sm leading-6 text-[var(--color-text-muted)] [overflow-wrap:anywhere]">
              Thông tin đang được lưu trên thiết bị. Chỉ khi bạn chọn gửi, đội ngũ kỹ thuật mới tiếp nhận để liên hệ và xác nhận bước tiếp theo.
            </p>

            {handoff ? (
              <div className="mt-[var(--space-4)] rounded-[var(--radius-md)] border border-[var(--color-success)] bg-[var(--color-success-soft)] p-[var(--space-3)] text-sm text-[var(--color-success)]" role="status">
                <p className="font-bold">Hồ sơ đã được gửi tới đội ngũ kỹ thuật.</p>
                <p className="mt-1 leading-5">Đại Hải Phát sẽ liên hệ để xác nhận bước tiếp theo.</p>
              </div>
            ) : (
              <>
                <label className="mt-[var(--space-4)] flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-[var(--space-3)] text-xs leading-5 text-[var(--color-text-muted)]">
                  <input
                    type="checkbox"
                    checked={handoffConsent}
                    onChange={(event) => setHandoffConsent(event.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-primary)]"
                  />
                  <span className="min-w-0 break-words [overflow-wrap:anywhere]">
                    Tôi đồng ý gửi thông tin liên hệ và dữ liệu dự án đã nhập cho Đại Hải Phát để tư vấn kỹ thuật. {" "}
                    <Link href="/privacy" className="font-bold text-[var(--color-primary)] underline underline-offset-2">
                      Xem cách dữ liệu được xử lý
                    </Link>
                  </span>
                </label>
                <button
                  type="button"
                  onClick={submitHandoff}
                  disabled={!handoffConsent || handoffStatus === "submitting"}
                  className="mt-[var(--space-3)] min-h-11 w-full rounded-[var(--radius-md)] bg-[var(--color-primary)] px-[var(--space-4)] text-sm font-bold text-[var(--color-primary-contrast)] transition-colors hover:bg-[var(--color-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {handoffStatus === "submitting" ? "Đang gửi hồ sơ…" : "Gửi hồ sơ cho kỹ sư"}
                </button>
              </>
            )}

            {handoffError ? (
              <div className="mt-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--color-warning)] bg-[var(--color-warning-soft)] p-[var(--space-3)] text-sm leading-6 text-[var(--color-text)]" role="alert">
                <p className="font-bold">Kênh gửi tự động đang tạm gián đoạn.</p>
                <p className="mt-1 text-[var(--color-text-muted)]">Hồ sơ vẫn được giữ trên thiết bị. Bạn có thể dùng Zalo hoặc gọi kỹ sư ở thanh phía dưới để tiếp tục ngay.</p>
              </div>
            ) : null}

            <button type="button" onClick={handleReset} className="mt-[var(--space-3)] min-h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-[var(--space-4)] text-sm font-bold">
              Bắt đầu yêu cầu mới
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 min-w-0 w-full max-w-full flex-col overflow-hidden bg-[var(--color-background)] text-[var(--color-text)]">
      <div className="shrink-0 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-[var(--space-4)] py-[var(--space-3)]">
        <div className="flex min-w-0 items-center justify-between gap-[var(--space-3)]">
          <div className="min-w-0 flex-1">
            <p className="flex min-w-0 items-center gap-2 text-sm font-black">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-success)] motion-safe:animate-pulse" aria-hidden="true" />
              <span className="min-w-0 break-words">Đại Hải Phát đang sẵn sàng hỗ trợ</span>
            </p>
            <p className="mt-1 truncate text-xs text-[var(--color-text-muted)]">
              {humanizePublicCopy(getStateLabel(session.state))} · Hồ sơ {session.proposal.progress}%
            </p>
          </div>
          <button type="button" onClick={handleReset} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] text-[var(--color-text-muted)]" aria-label="Bắt đầu lại hồ sơ tư vấn">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-[var(--space-3)] h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-muted)]">
          <div className="h-full rounded-full bg-[var(--color-primary)] transition-[width] duration-500" style={{ width: `${session.proposal.progress}%` }} />
        </div>
      </div>

      <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-[var(--space-4)] py-[var(--space-4)] sm:px-[var(--space-5)]" aria-live="polite">
        {!history.length ? (
          <AssistantMessage>Chào bạn! Hãy kể ngắn gọn nhu cầu. Tôi sẽ hỏi từng bước và chỉ ghi nhận dữ liệu vượt qua kiểm tra chất lượng.</AssistantMessage>
        ) : null}

        <div className="min-w-0 space-y-[var(--space-3)]">
          {history.map((item) => (
            <div key={item.field} className="flex min-w-0 justify-end">
              <div className="min-w-0 max-w-[84%] rounded-[var(--radius-lg)] rounded-br-[var(--radius-sm)] bg-[var(--color-primary)] px-[var(--space-3)] py-[var(--space-2)] text-sm text-[var(--color-primary-contrast)]">
                <p className="break-words text-[11px] font-semibold opacity-75 [overflow-wrap:anywhere]">{humanizePublicCopy(item.label)}</p>
                <p className="mt-0.5 break-words font-semibold leading-5 [overflow-wrap:anywhere]">{humanizePublicCopy(displayHistoryValue(item))}</p>
              </div>
            </div>
          ))}

          {contextualAcknowledgement ? <AssistantMessage>{contextualAcknowledgement}</AssistantMessage> : null}

          {analysisStatus === "loading" ? (
            <AssistantMessage>Đang đối chiếu hồ sơ và dữ liệu dự án…</AssistantMessage>
          ) : analysisStatus === "ready" && analysis ? (
            <AssistantMessage>{humanizePublicCopy(analysis.recommendation)}</AssistantMessage>
          ) : null}

          {question ? (
            <div className="flex min-w-0 items-end gap-[var(--space-2)]">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)] text-[var(--color-primary-contrast)]">
                <Bot className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 max-w-[86%] rounded-[var(--radius-lg)] rounded-bl-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-3)] shadow-[var(--shadow-sm)]">
                <p className="break-words text-sm font-bold leading-6 [overflow-wrap:anywhere]">{humanizePublicCopy(question.prompt)}</p>
                <p className="mt-1 break-words text-xs leading-5 text-[var(--color-text-muted)] [overflow-wrap:anywhere]">{humanizePublicCopy(question.supportingText)}</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {question ? (
        <div className="min-w-0 shrink-0 border-t border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-3)] sm:p-[var(--space-4)]">
          {question.inputType === "file" ? (
            <>
              <div className="grid min-w-0 gap-2 sm:grid-cols-2">
                <label className="flex min-h-11 min-w-0 cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-4 text-sm font-bold text-[var(--color-primary-contrast)]">
                  <ImagePlus className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="break-words text-center">{isProcessingImages ? "Đang xử lý…" : "Gửi ảnh hiện trạng"}</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" disabled={isProcessingImages} onChange={(event) => void addImages(event.currentTarget.files)} />
                </label>
                <button type="button" onClick={deferImages} className="min-h-11 min-w-0 rounded-[var(--radius-md)] border border-[var(--color-border)] px-4 text-sm font-bold">
                  Bổ sung ảnh sau
                </button>
              </div>
              {error ? <p className="mt-2 break-words text-xs leading-5 text-[var(--color-danger-text)] [overflow-wrap:anywhere]" role="alert">{humanizePublicCopy(error)}</p> : null}
            </>
          ) : (
            <AIChatAnswerComposer question={question} engineError={error} onAnswer={handleAnswer} />
          )}
        </div>
      ) : null}
    </div>
  );
}

function AssistantMessage({ children }: { children: string }) {
  return (
    <div className="mb-[var(--space-3)] flex min-w-0 items-end gap-[var(--space-2)]">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)] text-[var(--color-primary-contrast)]">
        <Bot className="h-4 w-4" aria-hidden="true" />
      </span>
      <p className="min-w-0 max-w-[86%] break-words rounded-[var(--radius-lg)] rounded-bl-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-3)] text-sm leading-6 shadow-[var(--shadow-sm)] [overflow-wrap:anywhere]">
        {humanizePublicCopy(children)}
      </p>
    </div>
  );
}
