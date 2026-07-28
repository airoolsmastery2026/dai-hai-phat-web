"use client";

import {
  Bot,
  Check,
  ClipboardList,
  Gauge,
  ImagePlus,
  MemoryStick,
  RotateCcw,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { FormEvent, ReactNode } from "react";

import { useAI } from "@/hooks/useAI";
import { getStateLabel, type ConversationQuestion, type ConversationSession } from "@/lib/ai";

const AUTO_COMPLETE_BY_FIELD: Partial<Record<ConversationQuestion["field"], string>> = {
  name: "name",
  phone: "tel",
  surveyAddress: "street-address",
  email: "email",
  zalo: "tel",
};

export function AIOfficeSection() {
  const { session, question, error, isProcessingImages, answer, addImages, reset } = useAI();

  return (
    <section
      id="ai-office"
      className="scroll-mt-16 bg-[var(--color-surface-dark)] py-[var(--space-section)] text-[var(--color-text-inverse)] lg:py-[var(--space-section-lg)]"
    >
      <div className="mx-auto max-w-7xl px-[var(--space-container)] sm:px-[var(--space-container-sm)] lg:px-[var(--space-container-lg)]">
        <header className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
            AI Digital Engineering Office
          </p>
          <h2 className="mt-[var(--space-inline)] text-3xl font-bold sm:text-4xl">
            Lập hồ sơ tư vấn cùng AI Sales Engineer
          </h2>
          <p className="mt-[var(--space-stack)] leading-7 text-[var(--color-text-dark-muted)]">
            Mỗi bước thu thập đúng một dữ liệu. Khoảng chi phí và phương án kỹ thuật
            chỉ được xác nhận khi đủ dữ liệu và hoàn tất khảo sát.
          </p>
        </header>

        <div className="mt-[var(--space-section-compact)] grid gap-[var(--space-stack)] lg:grid-cols-[1.15fr_0.85fr]">
          <ConversationPanel
            session={session}
            question={question}
            error={error}
            isProcessingImages={isProcessingImages}
            onAnswer={answer}
            onImages={addImages}
            onReset={reset}
          />
          <EngineeringWorkspace session={session} />
        </div>
      </div>
    </section>
  );
}

interface ConversationPanelProps {
  session: ConversationSession;
  question: ConversationQuestion | null;
  error: string | null;
  isProcessingImages: boolean;
  onAnswer: (value: string) => void;
  onImages: (files: FileList | null) => void;
  onReset: () => void;
}

function ConversationPanel({
  session,
  question,
  error,
  isProcessingImages,
  onAnswer,
  onImages,
  onReset,
}: ConversationPanelProps) {
  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border-dark)] bg-[var(--color-surface-dark-soft)] p-[var(--space-card)] sm:p-[var(--space-card-lg)]">
      <div className="flex items-center justify-between gap-[var(--space-stack)]">
        <div className="flex items-center gap-[var(--space-inline)]">
          <span className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)]">
            <Bot aria-hidden="true" />
          </span>
          <div>
            <p className="font-bold">AI Sales Engineer Đại Hải Phát</p>
            <p className="text-sm text-[var(--color-primary-soft-text)]">
              {getStateLabel(session.state)}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border-dark)] text-[var(--color-text-dark-muted)] transition hover:text-[var(--color-text-inverse)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          aria-label="Bắt đầu hồ sơ mới"
        >
          <RotateCcw className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {session.state === "DONE" ? (
        <CompletionState session={session} />
      ) : question ? (
        <div className="mt-[var(--space-card-lg)]">
          <div className="rounded-[var(--radius-lg)] bg-[var(--color-surface-dark-muted)] p-[var(--space-card)]">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
              Proposal {session.proposal.progress}%
            </p>
            <h3 className="mt-[var(--space-control)] text-xl font-bold leading-7">
              {question.prompt}
            </h3>
            <p className="mt-[var(--space-control)] text-sm leading-6 text-[var(--color-text-dark-muted)]">
              {question.supportingText}
            </p>
          </div>

          <QuestionInput
            question={question}
            isProcessingImages={isProcessingImages}
            onAnswer={onAnswer}
            onImages={onImages}
          />
          {error ? (
            <p
              role="alert"
              className="mt-[var(--space-stack)] rounded-[var(--radius-md)] border border-[var(--color-danger)] bg-[var(--color-danger-soft)] p-[var(--space-control)] text-sm text-[var(--color-danger-text)]"
            >
              {error}
            </p>
          ) : null}
        </div>
      ) : (
        <div
          role="alert"
          className="mt-[var(--space-card-lg)] rounded-[var(--radius-lg)] border border-[var(--color-danger)] p-[var(--space-card)]"
        >
          <p className="font-bold">Phiên tư vấn không thể tiếp tục.</p>
          <button type="button" onClick={onReset} className="mt-[var(--space-stack)] underline">
            Khởi tạo lại hồ sơ
          </button>
        </div>
      )}
    </div>
  );
}

function QuestionInput({
  question,
  isProcessingImages,
  onAnswer,
  onImages,
}: {
  question: ConversationQuestion;
  isProcessingImages: boolean;
  onAnswer: (value: string) => void;
  onImages: (files: FileList | null) => void;
}) {
  if (question.inputType === "choice") {
    return (
      <div className="mt-[var(--space-stack)] grid gap-[var(--space-control)] sm:grid-cols-2">
        {question.options?.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => onAnswer(item.value)}
            className="min-h-[var(--control-min-size)] rounded-[var(--radius-md)] border border-[var(--color-border-dark)] bg-[var(--color-surface-dark-soft)] px-[var(--space-stack)] py-[var(--space-control)] text-left font-semibold transition hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          >
            {item.label}
          </button>
        ))}
      </div>
    );
  }

  if (question.inputType === "file") {
    return (
      <label className="mt-[var(--space-stack)] flex min-h-[var(--control-min-size)] cursor-pointer items-center justify-center gap-[var(--space-inline)] rounded-[var(--radius-md)] border border-dashed border-[var(--color-primary)] bg-[var(--color-primary-soft)] px-[var(--space-stack)] py-[var(--space-card)] font-bold focus-within:ring-2 focus-within:ring-[var(--color-primary)]">
        <ImagePlus className="h-5 w-5" aria-hidden="true" />
        {isProcessingImages ? "Đang ghi nhận ảnh" : "Chọn ảnh hiện trạng"}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          required
          disabled={isProcessingImages}
          className="sr-only"
          onChange={(event) => onImages(event.target.files)}
        />
      </label>
    );
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onAnswer(String(form.get("answer") ?? ""));
  };

  return (
    <form onSubmit={handleSubmit} className="mt-[var(--space-stack)]">
      <label htmlFor={question.id} className="sr-only">
        {question.prompt}
      </label>
      <input
        key={question.id}
        id={question.id}
        name="answer"
        type={question.inputType}
        required={question.required}
        autoComplete={AUTO_COMPLETE_BY_FIELD[question.field] ?? "off"}
        className="min-h-[var(--control-min-size)] w-full rounded-[var(--radius-md)] border border-[var(--color-border-dark)] bg-[var(--color-surface-dark-muted)] px-[var(--space-stack)] text-[var(--color-text-inverse)] outline-none placeholder:text-[var(--color-text-dark-subtle)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)]"
        placeholder={question.field === "dimensions" ? "Ví dụ: rộng 4 m × cao 2,6 m" : "Nhập thông tin"}
      />
      <div className="mt-[var(--space-control)] grid gap-[var(--space-control)] sm:grid-cols-2">
        <button
          type="submit"
          className="min-h-[var(--control-min-size)] rounded-[var(--radius-md)] bg-[var(--color-primary)] px-[var(--space-stack)] font-bold transition hover:bg-[var(--color-primary-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-dark)]"
        >
          Ghi nhận dữ liệu
        </button>
        {question.allowAssistedMeasurement ? (
          <button
            type="button"
            onClick={() => onAnswer("Cần khảo sát đo đạc")}
            className="min-h-[var(--control-min-size)] rounded-[var(--radius-md)] border border-[var(--color-border-dark)] px-[var(--space-stack)] font-semibold"
          >
            Cần hỗ trợ đo
          </button>
        ) : !question.required ? (
          <button
            type="button"
            onClick={() => onAnswer("")}
            className="min-h-[var(--control-min-size)] rounded-[var(--radius-md)] border border-[var(--color-border-dark)] px-[var(--space-stack)] font-semibold"
          >
            Bỏ qua
          </button>
        ) : null}
      </div>
    </form>
  );
}

function CompletionState({ session }: { session: ConversationSession }) {
  return (
    <div className="mt-[var(--space-card-lg)] rounded-[var(--radius-lg)] bg-[var(--color-surface-dark-muted)] p-[var(--space-card)]">
      <ShieldCheck className="h-9 w-9 text-[var(--color-success)]" aria-hidden="true" />
      <h3 className="mt-[var(--space-stack)] text-xl font-bold">Hồ sơ khảo sát đã hoàn tất.</h3>
      <p className="mt-[var(--space-control)] leading-6 text-[var(--color-text-dark-muted)]">
        Hồ sơ của {session.memory.name} đã đạt {session.proposal.progress}% và sẵn sàng bàn
        giao cho kỹ sư. Báo giá chính thức được lập sau khi xác minh hiện trạng.
      </p>
    </div>
  );
}

function EngineeringWorkspace({ session }: { session: ConversationSession }) {
  const timeline = [
    { label: "Đã hiểu nhu cầu", complete: Boolean(session.memory.service) },
    { label: "Đang phân tích", complete: session.visitedStates.includes("ANALYSIS") },
    { label: "Đang tìm vật liệu", complete: Boolean(session.memory.material) },
    { label: "Đang tìm công trình", complete: session.visitedStates.includes("SIMILAR_PROJECT_SEARCH") },
    { label: "Đang tạo Proposal", complete: session.visitedStates.includes("PROPOSAL_BUILDING") },
  ];

  return (
    <aside className="grid content-start gap-[var(--space-stack)]" aria-label="Hồ sơ kỹ thuật đang lập">
      <StatusCard icon={ClipboardList} title="Working Timeline">
        <ol className="space-y-[var(--space-control)] text-sm">
          {timeline.map((item) => (
            <li
              key={item.label}
              className={item.complete ? "flex items-center gap-[var(--space-inline)] text-[var(--color-text-inverse)]" : "flex items-center gap-[var(--space-inline)] text-[var(--color-text-dark-subtle)]"}
            >
              <span className={item.complete ? "flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-success)]" : "flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-surface-dark-muted)]"}>
                {item.complete ? <Check className="h-4 w-4" aria-hidden="true" /> : "•"}
              </span>
              {item.label}
            </li>
          ))}
        </ol>
      </StatusCard>

      <div className="grid gap-[var(--space-stack)] sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <StatusCard icon={MemoryStick} title="Memory">
          <MemorySummary session={session} />
        </StatusCard>
        <StatusCard icon={Gauge} title="Confidence">
          <p className="text-2xl font-black text-[var(--color-primary)]">{session.confidence}%</p>
          <p className="text-xs text-[var(--color-text-dark-muted)]">Độ đầy đủ dữ liệu hồ sơ</p>
          <p className="mt-[var(--space-control)] text-xs text-[var(--color-text-dark-subtle)]">
            {session.proposal.missing.length
              ? `Còn thiếu: ${session.proposal.missing.join(", ")}.`
              : "Đã đủ dữ liệu khách hàng; cần khảo sát để xác minh kỹ thuật."}
          </p>
        </StatusCard>
      </div>

      <StatusCard icon={ClipboardList} title={`Proposal ${session.proposal.progress}%`}>
        <div
          className="h-2 overflow-hidden rounded-full bg-[var(--color-surface-dark-muted)]"
          role="progressbar"
          aria-label="Tiến độ Proposal"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={session.proposal.progress}
        >
          <div
            className="h-full rounded-full bg-[var(--color-primary)] transition-[width] duration-300"
            style={{ width: `${session.proposal.progress}%` }}
          />
        </div>
        <p className="mt-[var(--space-stack)] text-sm leading-6 text-[var(--color-text-dark-muted)]">
          {session.proposal.summary}
        </p>
        {session.proposal.facts.length ? (
          <ul className="mt-[var(--space-control)] space-y-1 text-xs text-[var(--color-text-dark-muted)]">
            {session.proposal.facts.slice(-4).map((fact) => <li key={fact}>✓ {fact}</li>)}
          </ul>
        ) : null}
        <p className="mt-[var(--space-control)] text-xs text-[var(--color-text-dark-subtle)]">
          {session.proposal.verificationNote}
        </p>
      </StatusCard>
    </aside>
  );
}

function MemorySummary({ session }: { session: ConversationSession }) {
  const values = [
    session.memory.intent,
    session.memory.service,
    session.memory.projectType,
    session.memory.location,
    session.memory.material,
    session.memory.images.length ? `${session.memory.images.length} ảnh hiện trạng` : undefined,
  ].filter((value): value is string => Boolean(value));

  return values.length ? (
    <ul className="space-y-1 text-sm text-[var(--color-text-dark-muted)]">
      {values.map((value) => <li key={value}>{value}</li>)}
    </ul>
  ) : (
    <p className="text-sm text-[var(--color-text-dark-subtle)]">Chưa có dữ liệu hồ sơ.</p>
  );
}

function StatusCard({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[var(--radius-lg)] border border-[var(--color-border-dark)] bg-[var(--color-surface-dark-soft)] p-[var(--space-card)]">
      <h3 className="mb-[var(--space-stack)] flex items-center gap-[var(--space-control)] text-sm font-bold uppercase tracking-[0.14em] text-[var(--color-text-inverse)]">
        <Icon className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
        {title}
      </h3>
      {children}
    </section>
  );
}
