"use client";

import { SendHorizontal } from "lucide-react";
import { useState, type FormEvent } from "react";

import {
  resolveConversationChoice,
  type ConversationQuestion,
} from "@/lib/ai";
import { validateCustomerAnswer } from "@/lib/ai/customer-input";

interface AIChatAnswerComposerProps {
  question: ConversationQuestion;
  engineError?: string | null;
  onAnswer: (value: string) => void;
}

function publicCopy(value: string): string {
  return value.replace(/\bAI\b/g, "trợ lý");
}

function getAutocomplete(question: ConversationQuestion): string {
  if (question.field === "name") return "name";
  if (question.field === "phone" || question.field === "zalo") return "tel";
  if (question.field === "email") return "email";
  if (question.field === "surveyAddress") return "street-address";
  return "off";
}

export function AIChatAnswerComposer({
  question,
  engineError = null,
  onAnswer,
}: AIChatAnswerComposerProps) {
  const [draft, setDraft] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [formatNote, setFormatNote] = useState<string | null>(null);

  const submitText = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let candidate = draft.trim();
    if (question.inputType === "choice") {
      const resolved = resolveConversationChoice(question, candidate);
      if (!resolved) {
        setInputError("Tôi chưa hiểu chắc lựa chọn này. Hãy chọn một gợi ý hoặc mô tả rõ hơn.");
        return;
      }
      candidate = resolved;
    }

    const validation = validateCustomerAnswer(question, candidate);
    if (!validation.ok) {
      setInputError(validation.error);
      setFormatNote(null);
      return;
    }

    onAnswer(validation.value);
    setDraft("");
    setInputError(null);
    setFormatNote(validation.note ?? null);
  };

  const selectChoice = (value: string) => {
    const validation = validateCustomerAnswer(question, value);
    if (!validation.ok) {
      setInputError(validation.error);
      return;
    }
    onAnswer(validation.value);
    setDraft("");
    setInputError(null);
    setFormatNote(null);
  };

  const skip = () => {
    onAnswer("");
    setDraft("");
    setInputError(null);
    setFormatNote(null);
  };

  return (
    <div className="min-w-0">
      {question.inputType === "choice" && question.options?.length ? (
        <div className="mb-[var(--space-3)] flex max-h-32 flex-wrap gap-2 overflow-y-auto overscroll-contain">
          {question.options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => selectChoice(option.value)}
              className="min-h-9 max-w-full rounded-full border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-1.5 text-xs font-semibold transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            >
              <span className="break-words [overflow-wrap:anywhere]">{publicCopy(option.label)}</span>
            </button>
          ))}
        </div>
      ) : null}

      <form onSubmit={submitText} className="min-w-0">
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_2.75rem] items-end gap-2">
          <label htmlFor="ai-drawer-answer" className="sr-only">Câu trả lời</label>
          <input
            id="ai-drawer-answer"
            type={question.inputType === "tel" || question.inputType === "email" ? question.inputType : "text"}
            inputMode={question.inputType === "tel" ? "tel" : question.inputType === "email" ? "email" : "text"}
            autoComplete={getAutocomplete(question)}
            autoCapitalize={question.field === "name" || question.field === "surveyAddress" ? "words" : "sentences"}
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
              if (inputError) setInputError(null);
              if (formatNote) setFormatNote(null);
            }}
            aria-invalid={Boolean(inputError || engineError)}
            aria-describedby={inputError || engineError || formatNote ? "ai-drawer-answer-feedback" : undefined}
            placeholder={question.inputType === "choice" ? "Hoặc mô tả rõ hơn…" : "Nhập câu trả lời…"}
            className="min-h-11 min-w-0 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 text-base outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)] sm:text-sm"
          />
          <button
            type="submit"
            aria-label="Kiểm tra và gửi câu trả lời"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)] text-[var(--color-primary-contrast)]"
          >
            <SendHorizontal className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {!question.required && question.inputType !== "choice" ? (
          <button
            type="button"
            onClick={skip}
            className="mt-2 min-h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-xs font-bold text-[var(--color-text-muted)]"
          >
            Bỏ qua bước này
          </button>
        ) : null}
      </form>

      {inputError || engineError || formatNote ? (
        <p
          id="ai-drawer-answer-feedback"
          className={`mt-2 break-words text-xs leading-5 [overflow-wrap:anywhere] ${inputError || engineError ? "text-[var(--color-danger-text)]" : "text-[var(--color-text-muted)]"}`}
          role={inputError || engineError ? "alert" : "status"}
        >
          {publicCopy(inputError || engineError || formatNote || "")}
        </p>
      ) : null}

      {question.field === "phone" || question.field === "email" || question.field === "zalo" ? (
        <p className="mt-1 text-[11px] leading-4 text-[var(--color-text-muted)]">
          Hệ thống kiểm tra định dạng trước khi ghi nhận. “Đã xác minh” chỉ được dùng khi dịch vụ xác minh thực sự xác nhận.
        </p>
      ) : null}
    </div>
  );
}
