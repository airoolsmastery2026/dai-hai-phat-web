"use client";

import {
  Bot,
  Check,
  ClipboardList,
  Gauge,
  ImagePlus,
  MemoryStick,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import type { FormEvent, ReactNode } from "react";

import { useAI } from "@/hooks/useAI";
import { COMPANY_CONFIG } from "@/content/company";
import { getStateLabel, type ConversationQuestion, type ConversationSession } from "@/lib/ai";
import type { ProjectAnalysisResponse } from "@/lib/ai/analysis";
import type { ProposalEvidenceResponse } from "@/lib/ai/catalog";
import { AI_DRAFT_RETENTION_DAYS } from "@/lib/ai/persistence";

const AUTO_COMPLETE_BY_FIELD: Partial<Record<ConversationQuestion["field"], string>> = {
  name: "name",
  phone: "tel",
  surveyAddress: "street-address",
  email: "email",
  zalo: "tel",
};

export function AIOfficeSection() {
  const {
    session,
    question,
    error,
    isProcessingImages,
    evidence,
    evidenceError,
    evidenceStatus,
    analysis,
    analysisError,
    analysisStatus,
    answer,
    addImages,
    retryEvidence,
    retryAnalysis,
    reset,
  } = useAI();

  return (
    <section
      id="ai-office"
      className="scroll-mt-16 bg-[var(--color-surface-dark)] py-[var(--space-section)] text-[var(--color-text-inverse)] lg:py-[var(--space-section-lg)]"
    >
      <div className="mx-auto max-w-7xl px-[var(--space-container)] sm:px-[var(--space-container-sm)] lg:px-[var(--space-container-lg)]">
        <header className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
            Hồ sơ tư vấn kỹ thuật
          </p>
          <h2 className="mt-[var(--space-inline)] text-3xl font-bold sm:text-4xl">
            Chuẩn bị dữ liệu khảo sát theo từng bước
          </h2>
          <p className="mt-[var(--space-stack)] leading-7 text-[var(--color-text-dark-muted)]">
            Mỗi bước thu thập đúng một dữ liệu. Khoảng chi phí và phương án kỹ thuật
            chỉ được xác nhận khi đủ dữ liệu và hoàn tất khảo sát.
          </p>
          <p className="mt-[var(--space-control)] text-sm leading-6 text-[var(--color-text-dark-subtle)]">
            Bản nháp tự lưu tối đa {AI_DRAFT_RETENTION_DAYS} ngày trên thiết bị này.
            Thông tin chưa tự động gửi tới kỹ sư hoặc CRM.
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
        <ProjectAnalysisPanel
          analysis={analysis}
          error={analysisError}
          status={analysisStatus}
          onRetry={retryAnalysis}
        />
        <ProposalEvidencePanel
          evidence={evidence}
          error={evidenceError}
          status={evidenceStatus}
          onRetry={retryEvidence}
        />
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
            <p className="font-bold">Trợ lý lập hồ sơ Đại Hải Phát</p>
            <p className="text-sm text-[var(--color-primary-soft-text)]">
              {getStateLabel(session.state)}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border-dark)] text-[var(--color-text-dark-muted)] transition hover:text-[var(--color-text-inverse)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          aria-label="Xóa hồ sơ đã lưu và bắt đầu lại"
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
      <h3 className="mt-[var(--space-stack)] text-xl font-bold">
        Hồ sơ trên thiết bị đã hoàn tất.
      </h3>
      <p className="mt-[var(--space-control)] leading-6 text-[var(--color-text-dark-muted)]">
        Hồ sơ của {session.memory.name} đã đạt {session.proposal.progress}%.
        Dữ liệu hiện chỉ được lưu trên trình duyệt này và chưa tự động gửi tới
        kỹ sư hoặc CRM. Báo giá chính thức được lập sau khi xác minh hiện trạng.
      </p>
      <p className="mt-[var(--space-control)] text-sm leading-6 text-[var(--color-text-dark-subtle)]">
        Bản nháp dự án tự hết hạn sau {AI_DRAFT_RETENTION_DAYS} ngày. Tên, số liên
        hệ, địa chỉ, email và Zalo không được lưu bền sau khi tải lại trang.
      </p>
      <a
        href={COMPANY_CONFIG.socials.zalo1}
        target="_blank"
        rel="noreferrer"
        className="mt-[var(--space-stack)] inline-flex min-h-[var(--control-min-size)] items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)] px-[var(--space-stack)] py-[var(--space-control)] font-bold text-white transition-colors hover:bg-[var(--color-primary-hover)]"
      >
        Gửi thông tin qua Zalo
      </a>
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

type AnalysisStatus = "idle" | "loading" | "ready" | "error";

function ProjectAnalysisPanel({
  analysis,
  error,
  status,
  onRetry,
}: {
  analysis: ProjectAnalysisResponse | null;
  error: string | null;
  status: AnalysisStatus;
  onRetry: () => void;
}) {
  if (status === "idle") return null;

  if (status === "loading") {
    return (
      <section
        className="mt-[var(--space-stack)] rounded-[var(--radius-xl)] border border-[var(--color-border-dark)] bg-[var(--color-surface-dark-soft)] p-[var(--space-card)] sm:p-[var(--space-card-lg)]"
        aria-live="polite"
        aria-busy="true"
      >
        <p className="font-bold text-[var(--color-primary-soft-text)]">
          Gemini đang phân tích dữ liệu hồ sơ đã xác nhận…
        </p>
        <p className="mt-[var(--space-control)] text-sm leading-6 text-[var(--color-text-dark-muted)]">
          Chỉ dữ liệu dự án phi nhạy cảm và bằng chứng trong Knowledge Base được
          gửi để tạo phân tích sơ bộ.
        </p>
      </section>
    );
  }

  if (status === "error" || !analysis) {
    return (
      <section
        className="mt-[var(--space-stack)] rounded-[var(--radius-xl)] border border-[var(--color-danger)] bg-[var(--color-danger-soft)] p-[var(--space-card)] text-[var(--color-danger-text)] sm:p-[var(--space-card-lg)]"
        role="alert"
      >
        <h3 className="font-bold">Phân tích AI chưa khả dụng.</h3>
        <p className="mt-[var(--space-control)] text-sm leading-6">
          {error || "Hồ sơ vẫn được giữ nguyên để tiếp tục quy trình khảo sát."}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-[var(--space-stack)] flex min-h-[var(--control-min-size)] items-center gap-[var(--space-control)] rounded-[var(--radius-md)] border border-[var(--color-danger)] px-[var(--space-stack)] font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Phân tích lại
        </button>
      </section>
    );
  }

  return (
    <section
      className="mt-[var(--space-stack)] rounded-[var(--radius-xl)] border border-[var(--color-border-dark)] bg-[var(--color-surface-dark-soft)] p-[var(--space-card)] sm:p-[var(--space-card-lg)]"
      aria-labelledby="project-analysis-title"
    >
      <div className="flex flex-col gap-[var(--space-control)] sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
            Gemini Project Analysis
          </p>
          <h3
            id="project-analysis-title"
            className="mt-[var(--space-control)] text-2xl font-bold"
          >
            Phân tích sơ bộ từ hồ sơ đã xác nhận
          </h3>
        </div>
        <p className="text-sm text-[var(--color-text-dark-muted)]">
          {analysis.model} · {analysis.evidenceCount} bằng chứng phù hợp
        </p>
      </div>

      <div className="mt-[var(--space-card-lg)] grid gap-[var(--space-stack)] lg:grid-cols-2">
        <article className="rounded-[var(--radius-lg)] bg-[var(--color-surface-dark-muted)] p-[var(--space-card)]">
          <h4 className="font-bold">Nhận định hồ sơ</h4>
          <p className="mt-[var(--space-control)] text-sm leading-6 text-[var(--color-text-dark-muted)]">
            {analysis.summary}
          </p>
        </article>
        <article className="rounded-[var(--radius-lg)] bg-[var(--color-surface-dark-muted)] p-[var(--space-card)]">
          <h4 className="font-bold">Hướng tiếp cận đề xuất</h4>
          <p className="mt-[var(--space-control)] text-sm leading-6 text-[var(--color-text-dark-muted)]">
            {analysis.recommendation}
          </p>
        </article>
      </div>

      <div className="mt-[var(--space-stack)] grid gap-[var(--space-stack)] md:grid-cols-2">
        {analysis.options.map((option) => (
          <article
            key={option.name}
            className="rounded-[var(--radius-lg)] border border-[var(--color-border-dark)] p-[var(--space-card)]"
          >
            <h4 className="font-bold">{option.name}</h4>
            <p className="mt-[var(--space-control)] text-sm leading-6 text-[var(--color-text-dark-muted)]">
              {option.suitableWhen}
            </p>
            <ul className="mt-[var(--space-control)] space-y-1 text-xs leading-5 text-[var(--color-text-dark-subtle)]">
              {option.tradeoffs.map((tradeoff) => (
                <li key={tradeoff}>• {tradeoff}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="mt-[var(--space-card-lg)] grid gap-[var(--space-stack)] lg:grid-cols-2">
        <div>
          <h4 className="font-bold">Kỹ sư cần xác minh tại công trình</h4>
          <ul className="mt-[var(--space-control)] space-y-2 text-sm leading-6 text-[var(--color-text-dark-muted)]">
            {analysis.surveyChecks.map((check) => (
              <li key={check}>• {check}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-bold">Giới hạn của phân tích</h4>
          <ul className="mt-[var(--space-control)] space-y-2 text-sm leading-6 text-[var(--color-text-dark-muted)]">
            {analysis.limitations.map((limitation) => (
              <li key={limitation}>• {limitation}</li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-[var(--space-card-lg)] border-t border-[var(--color-border-dark)] pt-[var(--space-stack)] text-xs leading-5 text-[var(--color-text-dark-subtle)]">
        Phân tích do Gemini tạo từ dữ liệu phi nhạy cảm, không phải kết luận kỹ
        thuật hoặc báo giá. Kỹ sư Đại Hải Phát phải khảo sát trước khi xác nhận
        phương án.
      </p>
    </section>
  );
}

type EvidenceStatus = "idle" | "loading" | "ready" | "empty" | "error";

function ProposalEvidencePanel({
  evidence,
  error,
  status,
  onRetry,
}: {
  evidence: ProposalEvidenceResponse | null;
  error: string | null;
  status: EvidenceStatus;
  onRetry: () => void;
}) {
  if (status === "idle") return null;

  if (status === "loading") {
    return (
      <section
        className="mt-[var(--space-stack)] rounded-[var(--radius-xl)] border border-[var(--color-border-dark)] bg-[var(--color-surface-dark-soft)] p-[var(--space-card)] sm:p-[var(--space-card-lg)]"
        aria-live="polite"
        aria-busy="true"
      >
        <p className="font-bold text-[var(--color-primary-soft-text)]">
          Đang đối chiếu công trình và dữ liệu vật liệu đã xác minh…
        </p>
        <p className="mt-[var(--space-control)] text-sm text-[var(--color-text-dark-muted)]">
          Kết quả được lấy theo hạng mục, phong cách, vật liệu và loại công trình trong hồ sơ.
        </p>
      </section>
    );
  }

  if (status === "error") {
    return (
      <section
        className="mt-[var(--space-stack)] rounded-[var(--radius-xl)] border border-[var(--color-danger)] bg-[var(--color-danger-soft)] p-[var(--space-card)] sm:p-[var(--space-card-lg)]"
        role="alert"
      >
        <h3 className="font-bold">Chưa thể đối chiếu Knowledge Base.</h3>
        <p className="mt-[var(--space-control)] text-sm text-[var(--color-danger-text)]">
          {error || "Kết nối dữ liệu bị gián đoạn."}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-[var(--space-stack)] flex min-h-[var(--control-min-size)] items-center gap-[var(--space-control)] rounded-[var(--radius-md)] border border-[var(--color-danger)] px-[var(--space-stack)] font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Đối chiếu lại
        </button>
      </section>
    );
  }

  if (status === "empty" || !evidence) {
    return (
      <section
        className="mt-[var(--space-stack)] rounded-[var(--radius-xl)] border border-[var(--color-border-dark)] bg-[var(--color-surface-dark-soft)] p-[var(--space-card)] sm:p-[var(--space-card-lg)]"
        aria-live="polite"
      >
        <h3 className="font-bold">Chưa có công trình đã xác minh phù hợp.</h3>
        <p className="mt-[var(--space-control)] text-sm text-[var(--color-text-dark-muted)]">
          Hồ sơ vẫn được giữ nguyên để kỹ sư đối chiếu trực tiếp khi khảo sát.
        </p>
      </section>
    );
  }

  return (
    <section
      className="mt-[var(--space-stack)] rounded-[var(--radius-xl)] border border-[var(--color-border-dark)] bg-[var(--color-surface-dark-soft)] p-[var(--space-card)] sm:p-[var(--space-card-lg)]"
      aria-labelledby="proposal-evidence-title"
    >
      <div className="flex flex-col gap-[var(--space-control)] sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
            Proposal Evidence
          </p>
          <h3 id="proposal-evidence-title" className="mt-[var(--space-control)] text-2xl font-bold">
            {evidence.images.length} công trình phù hợp nhất
          </h3>
        </div>
        <p className="text-sm text-[var(--color-text-dark-muted)]">
          Chỉ dùng ảnh và metadata có nguồn đã xác minh
        </p>
      </div>

      <div className="mt-[var(--space-card-lg)] grid gap-[var(--space-stack)] sm:grid-cols-2 lg:grid-cols-3">
        {evidence.images.map((item) => (
          <article
            key={item.id}
            className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-dark)] bg-[var(--color-surface-dark-muted)]"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={item.thumbnail.url}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                placeholder="blur"
                blurDataURL={item.blurDataUrl}
                className="object-cover transition-transform duration-300 hover:scale-[1.02]"
              />
            </div>
            <div className="p-[var(--space-stack)]">
              <h4 className="font-bold">{item.title}</h4>
              <p className="mt-[var(--space-control)] line-clamp-2 text-sm leading-6 text-[var(--color-text-dark-muted)]">
                {item.caption}
              </p>
              {item.material ? (
                <p className="mt-[var(--space-control)] text-xs font-semibold text-[var(--color-primary-soft-text)]">
                  {item.material}
                </p>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      {evidence.materials.length ? (
        <div className="mt-[var(--space-card-lg)]">
          <h4 className="font-bold">Vật liệu đã đối chiếu</h4>
          <ul className="mt-[var(--space-control)] flex flex-wrap gap-[var(--space-control)]">
            {evidence.materials.map((material) => (
              <li
                key={material}
                className="rounded-full border border-[var(--color-border-dark)] px-[var(--space-stack)] py-2 text-sm text-[var(--color-text-dark-muted)]"
              >
                {material}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-[var(--space-card-lg)] border-t border-[var(--color-border-dark)] pt-[var(--space-card-lg)]">
        <h4 className="font-bold">Khoảng chi phí tham chiếu</h4>
        {evidence.canShowCostRange ? (
          <div className="mt-[var(--space-stack)] grid gap-[var(--space-stack)] md:grid-cols-2">
            {evidence.prices.map((price) => (
              <article
                key={price.id}
                className="rounded-[var(--radius-lg)] bg-[var(--color-surface-dark-muted)] p-[var(--space-card)]"
              >
                <p className="font-bold">{price.material}</p>
                <p className="mt-[var(--space-control)] text-xl font-black text-[var(--color-primary-soft-text)]">
                  {formatCurrency(price.min)} – {formatCurrency(price.max)}
                  <span className="ml-1 text-sm font-semibold text-[var(--color-text-dark-muted)]">
                    / {price.unit}
                  </span>
                </p>
                {price.conditions.length ? (
                  <ul className="mt-[var(--space-control)] space-y-1 text-xs text-[var(--color-text-dark-muted)]">
                    {price.conditions.map((condition) => (
                      <li key={condition}>• {condition}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-[var(--space-control)] text-sm leading-6 text-[var(--color-text-dark-muted)]">
            {evidence.pricingRule}
          </p>
        )}
        <p className="mt-[var(--space-control)] text-xs text-[var(--color-text-dark-subtle)]">
          Đây là khoảng tham chiếu từ dữ liệu đã xác minh, không phải báo giá chính thức.
        </p>
      </div>
    </section>
  );
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}
