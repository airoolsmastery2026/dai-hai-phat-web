"use client";

import { Bot, SendHorizontal } from "lucide-react";
import { useState, type FormEvent } from "react";

import type { ConversationSession } from "@/lib/ai";
import type { SalesEngineerAgentResponse } from "@/lib/ai/sales-engineer-agent";
import { readAIDraft } from "@/lib/ai/persistence";

const DRAFT_STORAGE_KEY = "dhp-ai-sales-engine-draft-v1";

interface SalesEngineerApiResponse {
  agent?: SalesEngineerAgentResponse;
  error?: string;
}

function readCurrentSession(): ConversationSession | null {
  try {
    const draft = readAIDraft(window.localStorage.getItem(DRAFT_STORAGE_KEY));
    return draft.status === "ready" ? draft.session : null;
  } catch {
    return null;
  }
}

export function SalesEngineerAgentPanel() {
  const [reply, setReply] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const message = String(data.get("message") ?? "").trim();
    if (!message) return;

    const session = readCurrentSession();
    if (!session) {
      setError("Hãy bắt đầu hồ sơ tư vấn bên dưới trước để AI có đủ ngữ cảnh.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/sales-engineer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        cache: "no-store",
        body: JSON.stringify({ message, memory: session.memory }),
      });
      const payload = (await response.json()) as SalesEngineerApiResponse;
      if (!response.ok || !payload.agent) {
        throw new Error(payload.error || "Trợ lý AI chưa thể phản hồi lúc này.");
      }

      setReply(payload.agent.reply);
      form.reset();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Trợ lý AI chưa thể phản hồi lúc này.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      aria-labelledby="sales-engineer-agent-title"
      className="mx-auto max-w-[var(--container-max)] px-[var(--space-container)] pt-[var(--space-stack)] sm:px-[var(--space-container-sm)] lg:px-[var(--space-container-lg)]"
    >
      <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-stack)] shadow-[var(--shadow-sm)] sm:p-[var(--space-card)]">
        <div className="flex items-start gap-[var(--space-inline)]">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
            <Bot className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-primary)]">
              DHP Sales Engineer
            </p>
            <h2 id="sales-engineer-agent-title" className="mt-[var(--space-2)] text-lg font-bold text-[var(--color-text)]">
              Hỏi AI theo hồ sơ hiện tại
            </h2>
            <p className="mt-[var(--space-2)] text-sm leading-6 text-[var(--color-text-muted)]">
              AI đọc phần hồ sơ đã lưu trên thiết bị để trả lời theo đúng hạng mục, kích thước và vật liệu đã cung cấp. Hồ sơ vẫn do luồng tư vấn bên dưới quản lý.
            </p>
          </div>
        </div>

        {reply ? (
          <div className="mt-[var(--space-stack)] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-[var(--space-stack)]" role="status">
            <p className="text-sm leading-6 text-[var(--color-text)]">{reply}</p>
            <p className="mt-[var(--space-control)] text-xs leading-5 text-[var(--color-text-subtle)]">
              Tư vấn sơ bộ; kỹ sư cần xác minh trước khi chốt phương án hoặc báo giá chính thức.
            </p>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-[var(--space-stack)]">
          <label htmlFor="sales-engineer-message" className="sr-only">
            Câu hỏi cho DHP Sales Engineer
          </label>
          <div className="flex items-center gap-[var(--space-control)] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background)] p-[var(--space-2)] focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary-soft)]">
            <input
              id="sales-engineer-message"
              name="message"
              type="text"
              required
              maxLength={1500}
              disabled={isLoading}
              className="min-h-11 min-w-0 flex-1 bg-transparent px-[var(--space-control)] text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-subtle)] disabled:cursor-wait"
              placeholder="Ví dụ: Với kích thước này nên ưu tiên vật liệu nào?"
            />
            <button
              type="submit"
              disabled={isLoading}
              aria-label={isLoading ? "Đang gửi câu hỏi" : "Gửi câu hỏi cho DHP Sales Engineer"}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)] text-[var(--color-primary-contrast)] transition hover:bg-[var(--color-primary-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] disabled:cursor-wait disabled:opacity-60"
            >
              <SendHorizontal className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          {isLoading ? (
            <p className="mt-[var(--space-control)] text-sm text-[var(--color-text-muted)]" role="status" aria-live="polite">
              Đang đối chiếu hồ sơ và dữ liệu Đại Hải Phát…
            </p>
          ) : null}
          {error ? (
            <p className="mt-[var(--space-control)] text-sm leading-6 text-[var(--color-danger-text)]" role="alert">
              {error}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
