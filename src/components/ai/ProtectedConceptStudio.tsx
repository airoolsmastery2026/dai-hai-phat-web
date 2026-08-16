"use client";

import { ExternalLink, LockKeyhole, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState, type DragEvent, type MouseEvent } from "react";

import { AIConceptStudio } from "@/components/ai/AIConceptStudio";
import { ConceptReadinessGate } from "@/components/ai/ConceptReadinessGate";
import { RawFinishedRevealStudio } from "@/components/ai/RawFinishedRevealStudio";
import { Alert } from "@/components/ui/Alert";
import { COMPANY_CONFIG } from "@/content/company";

interface ProtectedConceptStudioProps {
  enabled: boolean;
}

function humanizeElement(root: HTMLElement) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();

  while (node) {
    if (node.textContent?.includes("AI")) {
      node.textContent = node.textContent.replace(/\bAI\b/g, "trợ lý");
    }
    node = walker.nextNode();
  }

  root.querySelectorAll<HTMLElement>("[aria-label], [title], [placeholder], img[alt]").forEach((element) => {
    for (const attribute of ["aria-label", "title", "placeholder", "alt"] as const) {
      const value = element.getAttribute(attribute);
      if (value?.includes("AI")) {
        element.setAttribute(attribute, value.replace(/\bAI\b/g, "trợ lý"));
      }
    }
  });
}

export function ProtectedConceptStudio({ enabled }: ProtectedConceptStudioProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [copyReady, setCopyReady] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    humanizeElement(root);
    setCopyReady(true);

    const observer = new MutationObserver(() => humanizeElement(root));
    observer.observe(root, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["aria-label", "title", "placeholder", "alt"],
    });

    return () => observer.disconnect();
  }, []);

  const blockImageAction = (
    event: DragEvent<HTMLDivElement> | MouseEvent<HTMLDivElement>,
  ) => {
    const target = event.target as HTMLElement;
    if (target.closest("img")) event.preventDefault();
  };

  return (
    <div
      ref={rootRef}
      className={`protected-concept-studio space-y-[var(--space-6)] transition-opacity duration-150 ${copyReady ? "opacity-100" : "opacity-0"}`}
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
              Hình ảnh trên website chỉ dùng để xem và trao đổi ý tưởng. Bản xem
              trước có watermark, không cung cấp quyền tải trực tiếp và chưa phải
              hồ sơ thiết kế hay phương án kỹ thuật đã được duyệt.
            </p>
          </div>
          <div className="flex gap-[var(--space-3)]">
            <LockKeyhole
              className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-primary)]"
              aria-hidden="true"
            />
            <p>
              Trước khi hệ thống dựng bản xem trước, khách hàng cần hoàn thiện hồ
              sơ nhu cầu. Hồ sơ chưa đủ điều kiện sẽ được chuyển để kỹ sư xem trước,
              giúp ưu tiên đúng công trình và hạn chế lượt tạo không phù hợp.
            </p>
          </div>
          <a
            href={COMPANY_CONFIG.socials.zalo1}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[var(--control-min-size)] items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] bg-[var(--color-primary)] px-[var(--space-5)] py-[var(--space-3)] text-sm font-bold text-[var(--color-primary-contrast)] transition-colors hover:bg-[var(--color-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2"
          >
            Gửi hồ sơ qua Zalo để được hỗ trợ
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </Alert>

      <ConceptReadinessGate>
        <div className="space-y-[var(--space-section)]">
          <AIConceptStudio enabled={enabled} />
          <RawFinishedRevealStudio enabled={enabled} />
        </div>
      </ConceptReadinessGate>

      <style jsx global>{`
        .protected-concept-studio button:has(.lucide-download) {
          display: none !important;
        }

        .protected-concept-studio img[src^="data:image"] {
          user-select: none;
          -webkit-user-drag: none;
          filter: saturate(0.92) contrast(0.96);
        }

        .protected-concept-studio div:has(> img[src^="data:image"])::after {
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
