"use client";

import { Bot, Phone, Send, X } from "lucide-react";
import { useEffect, useState } from "react";

import { COMPANY_CONFIG } from "@/content/company";
import { useMobileAIOfficeVisibility } from "@/hooks/useMobileAIOfficeVisibility";

const buttons = [
  {
    label: "Tư vấn AI 24/7",
    href: "/#ai-office",
    icon: Bot,
    tone: "bg-[var(--color-primary)]",
  },
  {
    label: "Gọi kỹ sư",
    href: `tel:${COMPANY_CONFIG.phones[0].raw}`,
    icon: Phone,
    tone: "bg-[var(--color-surface-dark)]",
  },
  {
    label: "Gửi Zalo",
    href: COMPANY_CONFIG.socials.zalo1,
    icon: Send,
    tone: "bg-[var(--color-channel-zalo)]",
  },
  {
    label: "Trang liên hệ",
    href: "/contact",
    icon: Send,
    tone: "bg-[var(--color-surface-dark)]",
  },
];

export function FloatingCta() {
  const [open, setOpen] = useState(false);
  const isMobileOfficeVisible = useMobileAIOfficeVisibility();

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  if (isMobileOfficeVisible) return null;

  return (
    <div className="fixed bottom-[max(var(--space-4),env(safe-area-inset-bottom))] right-[var(--space-4)] z-50 lg:right-[var(--space-8)]">
      {open ? (
        <div
          id="quick-contact-actions"
          className="mb-[var(--space-3)] flex flex-col gap-[var(--space-2)]"
        >
          {buttons.map((button) => {
            const Icon = button.icon;
            return (
              <a
                key={button.label}
                href={button.href}
                target={button.href.startsWith("http") ? "_blank" : undefined}
                rel={button.href.startsWith("http") ? "noreferrer" : undefined}
                onClick={() => setOpen(false)}
                className={`flex min-h-[var(--control-min-size)] items-center gap-[var(--space-3)] rounded-[var(--radius-full)] px-[var(--space-4)] py-[var(--space-3)] text-sm font-semibold text-white shadow-[var(--shadow-md)] transition-transform duration-[var(--duration-fast)] hover:-translate-y-0.5 ${button.tone}`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>{button.label}</span>
              </a>
            );
          })}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-primary)] text-[var(--color-text-inverse)] shadow-[var(--shadow-lg)] ring-2 ring-[var(--color-primary-soft)] transition-transform duration-[var(--duration-fast)] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-dark)] lg:bg-[var(--color-surface-dark)] lg:ring-0"
        aria-label={open ? "Đóng tư vấn và liên hệ nhanh" : "Mở tư vấn và liên hệ nhanh"}
        aria-expanded={open}
        aria-controls="quick-contact-actions"
      >
        {open ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <span className="mobile-ai-attention" aria-hidden="true">
            <Bot className="h-6 w-6" />
          </span>
        )}
      </button>
    </div>
  );
}
