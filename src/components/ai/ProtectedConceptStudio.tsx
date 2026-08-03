"use client";

import { ExternalLink, LockKeyhole, ShieldCheck } from "lucide-react";
import type { DragEvent, MouseEvent } from "react";

import { AIConceptStudio } from "@/components/ai/AIConceptStudio";
import { ConceptReadinessGate } from "@/components/ai/ConceptReadinessGate";
import { Alert } from "@/components/ui/Alert";
import { COMPANY_CONFIG } from "@/content/company";

interface ProtectedConceptStudioProps {
  enabled: boolean;
}

export function ProtectedConceptStudio({ enabled }: ProtectedConceptStudioProps) {
  const blockImageAction = (
    event: DragEvent<HTMLDivElement> | MouseEvent<HTMLDivElement>,
  ) => {
    const target = event.target as HTMLElement;
    if (target.closest("img")) event.preventDefault();
  };

  return (
    <div
      className="protected-concept-studio space-y-[var(--space-6)]"
      onContextMenu={blockImageAction}
      onDragStart={blockImageAction}
    >
      <Alert title="Bản xem trước được bảo vệ" tone="info">
        <div className="space-y-[var(--space-3)]">
          <div className="flex gap-[var(--space-3)]">
            <ShieldCheck
              className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-success)]"
              aria-hidden="true"
            />
            <p>
              Phối cảnh trên website chỉ dùng để xem và trao đổi ý tưởng. Bản xem
              trước có watermark, không cung cấp nút tải trực tiếp và chưa phải hồ
              sơ thiết kế hay phương án kỹ thuật đã được duyệt.
            </p>
          </div>
          <div className="flex gap-[var(--space-3)]">
            <LockKeyhole
              className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-primary)]"
              aria-hidden="true"
            />
            <p>
              Trước khi tạo hình, khách hàng cần hoàn thiện hồ sơ nhu cầu. Hồ sơ
              chưa đạt ngưỡng sẽ được chuyển sang kỹ sư xem trước để tránh sử dụng
              lượt tạo không đúng mục đích.
            </p>
          </div>
          <a
            href={COMPANY_CONFIG.socials.zalo1}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[var(--control-min-size)] items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] bg-[var(--color-primary)] px-[var(--space-5)] py-[var(--space-3)] text-sm font-bold text-[var(--color-primary-contrast)] transition-colors hover:bg-[var(--color-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2"
          >
            Liên hệ Zalo để được hỗ trợ
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </Alert>

      <ConceptReadinessGate>
        <AIConceptStudio enabled={enabled} />
      </ConceptReadinessGate>

      <style jsx global>{`
        .protected-concept-studio button:has(.lucide-download) {
          display: none !important;
        }

        .protected-concept-studio img[alt*="do AI tạo"] {
          user-select: none;
          -webkit-user-drag: none;
          filter: saturate(0.92) contrast(0.96);
        }

        .protected-concept-studio div:has(> img[alt*="do AI tạo"])::after {
          align-items: center;
          background: repeating-linear-gradient(
            -32deg,
            transparent 0,
            transparent 52px,
            rgb(255 255 255 / 0.12) 53px,
            rgb(255 255 255 / 0.12) 55px
          );
          color: rgb(255 255 255 / 0.82);
          content: "ĐẠI HẢI PHÁT · BẢN XEM TRƯỚC · CHƯA DUYỆT SỬ DỤNG";
          display: flex;
          font-size: clamp(0.65rem, 1.5vw, 0.9rem);
          font-weight: 800;
          inset: 0;
          justify-content: center;
          letter-spacing: 0.12em;
          padding: 1rem;
          pointer-events: none;
          position: absolute;
          text-align: center;
          text-shadow: 0 1px 3px rgb(0 0 0 / 0.75);
          z-index: 2;
        }
      `}</style>
    </div>
  );
}
