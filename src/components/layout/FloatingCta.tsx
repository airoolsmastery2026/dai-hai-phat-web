"use client";

import { MessageCircle, Phone, Send, X } from "lucide-react";
import { useState } from "react";

import { COMPANY_CONFIG } from "@/content/company";

const buttons = [
  {
    label: "Gọi kỹ sư",
    href: `tel:${COMPANY_CONFIG.phones[0].raw}`,
    icon: Phone,
    tone: "bg-[var(--color-primary)]",
  },
  {
    label: "Gửi Zalo",
    href: COMPANY_CONFIG.socials.zalo1,
    icon: Send,
    tone: "bg-[var(--color-channel-zalo)]",
  },
  {
    label: "WhatsApp",
    href: COMPANY_CONFIG.socials.whatsapp1,
    icon: MessageCircle,
    tone: "bg-[var(--color-channel-whatsapp)]",
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
                className={`flex min-h-[var(--control-min-size)] items-center gap-[var(--space-3)] rounded-[var(--radius-full)] px-[var(--space-4)] py-[var(--space-3)] text-sm font-semibold text-white shadow-[var(--shadow-md)] transition-transform duration-[var(--duration-fast)] hover:-translate-y-0.5 ${button.tone}`}
              >
                <Icon className="h-4 w-4" />
                <span>{button.label}</span>
              </a>
            );
          })}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-surface-dark)] text-white shadow-[var(--shadow-lg)] transition-transform duration-[var(--duration-fast)] hover:scale-105"
        aria-label={open ? "Đóng kênh liên hệ nhanh" : "Mở kênh liên hệ nhanh"}
        aria-expanded={open}
        aria-controls="quick-contact-actions"
      >
        {open ? <X className="h-6 w-6" /> : <Phone className="h-6 w-6" />}
      </button>
    </div>
  );
}
