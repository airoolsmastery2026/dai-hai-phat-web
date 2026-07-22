"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Phone, Send, X } from "lucide-react";
import { useState } from "react";

import { COMPANY_CONFIG } from "@/content/company";

const buttons = [
  { label: "Call", href: `tel:${COMPANY_CONFIG.phones[0].raw}`, icon: Phone, tone: "bg-[#FF5722]" },
  { label: "Zalo", href: COMPANY_CONFIG.socials.zalo1, icon: Send, tone: "bg-blue-600" },
  { label: "Messenger", href: COMPANY_CONFIG.socials.whatsapp1, icon: MessageCircle, tone: "bg-emerald-600" },
  { label: "Quote", href: "#bao-gia", icon: Send, tone: "bg-slate-900" },
];

export function FloatingCta() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-4 z-50 lg:right-8">
      <AnimatePresence>
        {open ? (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} className="mb-4 flex flex-col gap-3">
            {buttons.map((button, index) => {
              const Icon = button.icon;
              return (
                <motion.a
                  key={button.label}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  href={button.href}
                  target={button.href.startsWith("http") ? "_blank" : undefined}
                  rel={button.href.startsWith("http") ? "noreferrer" : undefined}
                  className={`flex items-center gap-3 rounded-full px-4 py-3 text-sm font-semibold text-white shadow-lg ${button.tone}`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{button.label}</span>
                </motion.a>
              );
            })}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <button onClick={() => setOpen((prev) => !prev)} className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-2xl transition hover:scale-105">
        {open ? <X className="h-6 w-6" /> : <Phone className="h-6 w-6" />}
      </button>
    </div>
  );
}
