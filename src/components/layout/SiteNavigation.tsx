"use client";

import { Bot, Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { COMPANY_CONFIG } from "@/content/company";
import { NAV_ITEMS } from "@/lib/theme";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function SiteNavigation() {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavigationRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback((restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) {
      requestAnimationFrame(() => menuButtonRef.current?.focus());
    }
  }, []);

  useEffect(() => {
    if (!open) return;

    const mobileNavigation = mobileNavigationRef.current;
    const firstMenuItem = mobileNavigation?.querySelector<HTMLElement>(
      FOCUSABLE_SELECTOR,
    );
    firstMenuItem?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu(true);
        return;
      }

      if (event.key !== "Tab" || !mobileNavigation) return;

      const focusableElements = [
        menuButtonRef.current,
        ...Array.from(
          mobileNavigation.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
        ),
      ].filter((element): element is HTMLElement => Boolean(element));

      if (!focusableElements.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    const desktopMediaQuery = window.matchMedia("(min-width: 1280px)");
    const handleDesktopChange = (event: MediaQueryListEvent) => {
      if (event.matches) closeMenu();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    desktopMediaQuery.addEventListener("change", handleDesktopChange);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
      desktopMediaQuery.removeEventListener("change", handleDesktopChange);
    };
  }, [closeMenu, open]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 text-[var(--color-text)] shadow-[var(--shadow-sm)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[var(--container-max)] items-center justify-between px-[var(--space-container)] sm:px-[var(--space-container-sm)] lg:h-16 lg:px-[var(--space-container-lg)]">
        <Link
          href="/"
          className="flex flex-col rounded-[var(--radius-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
          aria-label="Đại Hải Phát — Trang chủ"
        >
          <span className="text-base font-black uppercase tracking-[0.04em] text-[var(--color-text)] sm:text-lg">
            ĐẠI HẢI PHÁT
          </span>
          <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--color-metal-strong)] sm:text-[10px]">
            Văn phòng kỹ thuật số
          </span>
        </Link>

        <nav
          className="hidden items-center gap-[var(--space-6)] xl:flex"
          aria-label="Điều hướng chính"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[var(--radius-sm)] text-sm font-semibold text-[var(--color-text-muted)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-[var(--space-3)] xl:flex">
          <a
            href={`tel:${COMPANY_CONFIG.phones[0].raw}`}
            className="inline-flex min-h-11 items-center rounded-[var(--radius-md)] border border-[var(--color-border)] px-[var(--space-4)] py-[var(--space-2)] text-sm font-bold text-[var(--color-primary)] transition-colors duration-[var(--duration-fast)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)]"
          >
            {COMPANY_CONFIG.phones[0].display}
          </a>
          <Link
            href="/#ai-office"
            className="inline-flex min-h-11 items-center gap-[var(--space-2)] rounded-[var(--radius-md)] bg-[var(--color-primary)] px-[var(--space-4)] py-[var(--space-2)] text-sm font-bold text-[var(--color-primary-contrast)] transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-primary-hover)]"
          >
            <Bot className="h-4 w-4" aria-hidden="true" />
            Trợ lý AI 24/7
          </Link>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] xl:hidden"
          aria-label={open ? "Đóng menu" : "Mở menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      {open ? (
        <div
          ref={mobileNavigationRef}
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-navigation-title"
          className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-[var(--space-container)] pb-[var(--space-5)] shadow-[var(--shadow-md)] xl:hidden"
        >
          <h2 id="mobile-navigation-title" className="sr-only">
            Điều hướng chính
          </h2>
          <nav className="flex flex-col py-[var(--space-2)]" aria-label="Điều hướng di động">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => closeMenu()}
                className="flex min-h-11 items-center border-b border-[var(--color-border)] text-sm font-semibold text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-focus)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="grid grid-cols-2 gap-[var(--space-2)] pt-[var(--space-2)]">
            <Link
              href="/#ai-office"
              onClick={() => closeMenu()}
              className="flex min-h-11 items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] bg-[var(--color-primary)] px-[var(--space-3)] text-center text-sm font-bold text-[var(--color-primary-contrast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
            >
              <Bot className="h-4 w-4" aria-hidden="true" />
              Trợ lý AI
            </Link>
            <a
              href={`tel:${COMPANY_CONFIG.phones[0].raw}`}
              onClick={() => closeMenu()}
              className="flex min-h-11 items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--color-border)] px-[var(--space-3)] text-center text-sm font-bold text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Gọi ngay
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
