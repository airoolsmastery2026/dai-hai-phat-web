"use client";

import { SendHorizontal } from "lucide-react";
import { useState, type FormEvent } from "react";

import {
  resolveConversationChoice,
  type ConversationQuestion,
} from "@/lib/ai";
import { validateCustomerAnswer } from "@/lib/ai/customer-input";

export type ContactVerificationLevel =
  | "format_only"
  | "network_valid"
  | "domain_valid";

export interface ContactVerificationReceipt {
  field: "phone" | "email" | "zalo";
  verification: ContactVerificationLevel;
  message: string;
}

interface AIChatAnswerComposerProps {
  question: ConversationQuestion;
  engineError?: string | null;
  onAnswer: (value: string, receipt?: ContactVerificationReceipt | null) => void;
}

interface ContactValidationResponse {
  valid?: boolean;
  normalizedValue?: string;
  verification?: "invalid" | ContactVerificationLevel;
  message?: string;
  error?: string;
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

function isContactField(
  question: ConversationQuestion,
): question is ConversationQuestion & {
  field: "phone" | "email" | "zalo";
} {
  return question.field === "phone" || question.field === "email" || question.field === "zalo";
}

function isContactVerificationLevel(
  value: ContactValidationResponse["verification"],
): value is ContactVerificationLevel {
  return value === "format_only" || value === "network_valid" || value === "domain_valid";
}

function isReceiptCompatible(
  field: "phone" | "email" | "zalo",
  verification: ContactVerificationLevel,
): boolean {
  if (verification === "format_only") return true;
  if (field === "email") return verification === "domain_valid";
  return verification === "network_valid";
}

async function validateContactOnServer(
  question: ConversationQuestion,
  value: string,
): Promise<
  | {
      ok: true;
      normalizedValue: string;
      receipt: ContactVerificationReceipt | null;
    }
  | { ok: false; error: string }
> {
  if (!isContactField(question)) {
    return { ok: true, normalizedValue: value, receipt: null };
  }

  try {
    const response = await fetch("/api/validation/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ field: question.field, value }),
    });
    const payload = (await response.json().catch(() => ({}))) as ContactValidationResponse;

    if (
      !response.ok ||
      payload.valid !== true ||
      !isContactVerificationLevel(payload.verification) ||
      !isReceiptCompatible(question.field, payload.verification)
    ) {
      return {
        ok: false,
        error:
          payload.message ||
          payload.error ||
          "Thông tin liên hệ không vượt qua bước kiểm tra. Vui lòng kiểm tra lại.",
      };
    }

    return {
      ok: true,
      normalizedValue: payload.normalizedValue?.trim() || value,
      receipt: {
        field: question.field,
        verification: payload.verification,
        message:
          payload.message?.trim() ||
          "Thông tin liên hệ đã vượt qua bước kiểm tra hiện có nhưng chưa xác minh quyền sở hữu.",
      },
    };
  } catch {
    return {
      ok: false,
      error:
        "Không thể kiểm tra thông tin liên hệ ở phía máy chủ lúc này. Vui lòng thử lại trước khi tiếp tục.",
    };
  }
}

export function AIChatAnswerComposer({
  question,
  engineError = null,
  onAnswer,
}: AIChatAnswerComposerProps) {
  const [draft, setDraft] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const submitText = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isChecking) return;

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
      return;
    }

    setIsChecking(true);
    const serverValidation = await validateContactOnServer(question, validation.value);
    setIsChecking(false);
    if (!serverValidation.ok) {
      setInputError(serverValidation.error);
      return;
    }

    onAnswer(serverValidation.normalizedValue, serverValidation.receipt);
    setDraft("");
    setInputError(null);
  };

  const selectChoice = (value: string) => {
    const validation = validateCustomerAnswer(question, value);
    if (!validation.ok) {
      setInputError(validation.error);
      return;
    }
    onAnswer(validation.value, null);
    setDraft("");
    setInputError(null);
  };

  const skip = () => {
    if (isChecking) return;
    onAnswer("", null);
    setDraft("");
    setInputError(null);
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
              disabled={isChecking}
              className="min-h-9 max-w-full rounded-full border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-1.5 text-xs font-semibold transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:cursor-wait disabled:opacity-60"
            >
              <span className="break-words [overflow-wrap:anywhere]">{publicCopy(option.label)}</span>
            </button>
          ))}
        </div>
      ) : null}

      <form onSubmit={(event) => void submitText(event)} className="min-w-0">
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_2.75rem] items-end gap-2">
          <label htmlFor="ai-drawer-answer" className="sr-only">Câu trả lời</label>
          <input
            id="ai-drawer-answer"
            type={question.inputType === "tel" || question.inputType === "email" ? question.inputType : "text"}
            inputMode={question.inputType === "tel" ? "tel" : question.inputType === "email" ? "email" : "text"}
            autoComplete={getAutocomplete(question)}
            autoCapitalize={question.field === "name" || question.field === "surveyAddress" ? "words" : "sentences"}
            value={draft}
            disabled={isChecking}
            onChange={(event) => {
              setDraft(event.target.value);
              if (inputError) setInputError(null);
            }}
            aria-invalid={Boolean(inputError || engineError)}
            aria-describedby={inputError || engineError || isChecking ? "ai-drawer-answer-feedback" : undefined}
            placeholder={question.inputType === "choice" ? "Hoặc mô tả rõ hơn…" : "Nhập câu trả lời…"}
            className="min-h-11 min-w-0 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 text-base outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)] disabled:cursor-wait disabled:opacity-70 sm:text-sm"
          />
          <button
            type="submit"
            disabled={isChecking}
            aria-label="Kiểm tra và gửi câu trả lời"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)] text-[var(--color-primary-contrast)] disabled:cursor-wait disabled:opacity-60"
          >
            <SendHorizontal className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {!question.required && question.inputType !== "choice" ? (
          <button
            type="button"
            onClick={skip}
            disabled={isChecking}
            className="mt-2 min-h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-xs font-bold text-[var(--color-text-muted)] disabled:cursor-wait disabled:opacity-60"
          >
            Bỏ qua bước này
          </button>
        ) : null}
      </form>

      {inputError || engineError || isChecking ? (
        <p
          id="ai-drawer-answer-feedback"
          className={`mt-2 break-words text-xs leading-5 [overflow-wrap:anywhere] ${inputError || engineError ? "text-[var(--color-danger-text)]" : "text-[var(--color-text-muted)]"}`}
          role={inputError || engineError ? "alert" : "status"}
        >
          {isChecking && !inputError && !engineError
            ? "Đang kiểm tra thông tin trước khi ghi nhận…"
            : publicCopy(inputError || engineError || "")}
        </p>
      ) : null}

      {isContactField(question) ? (
        <p className="mt-1 text-[11px] leading-4 text-[var(--color-text-muted)]">
          Định dạng được kiểm tra ở thiết bị và server. Mạng/domain được đối chiếu khi dịch vụ khả dụng; quyền sở hữu vẫn cần OTP hoặc xác nhận liên hệ thực tế.
        </p>
      ) : null}
    </div>
  );
}
