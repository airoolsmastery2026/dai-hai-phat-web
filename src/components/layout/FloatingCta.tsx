"use client";

import { Bot, Phone, Send, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import { COMPANY_CONFIG } from "@/content/company";

const AIChatDrawerPanel = dynamic(
  () =>
    import("@/components/ai/AIChatDrawerPanel").then(
      (module) => module.AIChatDrawerPanel,
    ),
  {
    loading: () => (
      <div className="flex h-full min-w-0 items-center justify-center bg-[var(--color-background)] px-6 text-center text-sm text-[var(--color-text-muted)]">
        Đang mở kênh tư vấn…
      </div>
    ),
  },
);

export function FloatingCta() {
  const [open, setOpen] = useState(false);
  const [servicePreset, setServicePreset] = useState<string | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;

      const url = new URL(anchor.href, window.location.origin);
      if (
        url.origin === window.location.origin &&
        url.pathname === "/ai-tu-van" &&
        url.searchParams.get("ai") === "1"
      ) {
        event.preventDefault();
        previousFocusRef.current = document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
        setServicePreset(url.searchParams.get("service"));
        setOpen(true);
      }
    };

    document.addEventListener("click", handleDocumentClick, true);
    return () => document.removeEventListener("click", handleDocumentClick, true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const bodyOverflow = document.body.style.overflow;
    const htmlOverflow = document.documentElement.style.overflow;
    const bodyOverscroll = document.body.style.overscrollBehavior;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    closeButtonRef.current?.focus();

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = htmlOverflow;
      document.body.style.overscrollBehavior = bodyOverscroll;
      document.removeEventListener("keydown", handleEscape);
      previousFocusRef.current?.focus();
    };
  }, [open]);

  const openDrawer = () => {
    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    setServicePreset(null);
    setOpen(true);
  };

  return (
    <>
      {open ? (
        <div className="fixed inset-0 z-[90] h-[100dvh] max-h-[100dvh] w-full max-w-full overflow-x-hidden overflow-y-hidden overscroll-none bg-black/45 backdrop-blur-[2px]">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Đóng cửa sổ tư vấn"
            onClick={() => setOpen(false)}
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="ai-chat-drawer-title"
            className="absolute inset-x-0 bottom-0 z-10 box-border flex h-[min(88dvh,760px)] max-h-[100dvh] min-w-0 w-full max-w-[100vw] touch-pan-y flex-col overflow-x-hidden overflow-y-hidden rounded-t-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-lg)] sm:inset-y-0 sm:left-auto sm:right-0 sm:h-full sm:max-h-none sm:w-full sm:max-w-[28rem] sm:rounded-none sm:border-y-0 sm:border-r-0"
          >
            <header className="flex min-w-0 shrink-0 items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface-dark)] px-4 py-3 text-white">
              <div className="min-w-0 flex-1">
                <p className="flex min-w-0 items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-primary-soft-text)]">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-success)] motion-safe:animate-pulse" aria-hidden="true" />
                  <span className="min-w-0 truncate">Sẵn sàng 24/7</span>
                </p>
                <h2 id="ai-chat-drawer-title" className="mt-1 break-words text-base font-black leading-5 [overflow-wrap:anywhere]">
                  Trợ lý tư vấn Đại Hải Phát
                </h2>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-white/15 text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Đóng cửa sổ tư vấn"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </header>

            <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
              <AIChatDrawerPanel servicePreset={servicePreset} />
            </div>

            <footer className="grid min-w-0 shrink-0 grid-cols-2 gap-2 border-t border-[var(--color-border)] bg-[var(--color-surface)] pl-[max(var(--space-3),env(safe-area-inset-left))] pr-[max(var(--space-3),env(safe-area-inset-right))] pt-3 pb-[max(var(--space-3),env(safe-area-inset-bottom))]">
              <a
                href={`tel:${COMPANY_CONFIG.phones[0].raw}`}
                className="flex min-h-10 min-w-0 items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] px-2 text-xs font-bold text-[var(--color-text)]"
              >
                <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="truncate">Gọi kỹ sư</span>
              </a>
              <a
                href={COMPANY_CONFIG.socials.zalo1}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-10 min-w-0 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-channel-zalo)] px-2 text-xs font-bold text-white"
              >
                <Send className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="truncate">Zalo</span>
              </a>
            </footer>
          </aside>
        </div>
      ) : null}

      <button
        type="button"
        onClick={openDrawer}
        className="fixed bottom-[max(var(--space-4),env(safe-area-inset-bottom))] right-[max(var(--space-4),env(safe-area-inset-right))] z-50 flex min-h-12 items-center gap-2 rounded-full bg-[var(--color-primary)] px-4 text-sm font-black text-[var(--color-primary-contrast)] shadow-[var(--shadow-lg)] ring-2 ring-[var(--color-primary-soft)] transition-transform duration-[var(--duration-fast)] hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 sm:right-[var(--space-6)] lg:bottom-[var(--space-8)] lg:right-[var(--space-8)]"
        aria-label="Mở trợ lý tư vấn Đại Hải Phát"
      >
        <Bot className="h-5 w-5" aria-hidden="true" />
        <span>Tư vấn ngay</span>
        <span className="h-2 w-2 rounded-full bg-[var(--color-success)] motion-safe:animate-pulse" aria-hidden="true" />
      </button>
    </>
  );
}
