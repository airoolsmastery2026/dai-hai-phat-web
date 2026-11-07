import { ArrowRight, MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { COMPANY_CONFIG } from "@/content/company";

export function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-16 bg-[var(--color-surface)] py-[var(--space-8)] sm:py-[var(--space-10)] lg:py-[var(--space-12)]">
      <Container>
        <div className="rounded-[var(--radius-lg)] bg-[var(--color-surface-dark)] p-[var(--space-4)] text-white shadow-[var(--shadow-md)] sm:p-[var(--space-5)] lg:p-[var(--space-6)]">
          <div className="flex flex-col gap-[var(--space-4)] lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/75">Liên hệ</p>
              <h2 className="mt-[var(--space-2)] text-[length:var(--font-h2)] font-bold leading-tight">Bắt đầu từ nhu cầu của bạn</h2>
              <p className="mt-[var(--space-2)] text-sm leading-6 text-white/80 sm:text-base">
                Kỹ sư sẽ tiếp nhận thông tin khi bạn gửi ảnh hiện trạng, kích thước dự kiến và vị trí công trình.
              </p>
            </div>
            <div className="grid gap-[var(--space-2)] sm:grid-cols-2 lg:flex lg:flex-shrink-0">
              <a href={COMPANY_CONFIG.socials.zalo1} target="_blank" rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] bg-white px-[var(--space-4)] py-[var(--space-2)] text-sm font-bold text-[var(--color-primary)] transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-primary-soft)]">
                <MessageCircle className="h-4 w-4" aria-hidden="true" /> Zalo
              </a>
              <a href={`tel:${COMPANY_CONFIG.phones[0].raw}`}
                className="inline-flex min-h-11 items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-white/40 px-[var(--space-4)] py-[var(--space-2)] text-sm font-bold text-white transition-colors duration-[var(--duration-fast)] hover:bg-white/10">
                <Phone className="h-4 w-4" aria-hidden="true" /> {COMPANY_CONFIG.phones[0].display}
              </a>
            </div>
          </div>
          <div className="mt-[var(--space-4)] flex flex-wrap items-center gap-x-[var(--space-4)] gap-y-[var(--space-2)] border-t border-white/15 pt-[var(--space-3)] text-sm text-white/70">
            <a href={COMPANY_CONFIG.googleMapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-[var(--space-2)] transition hover:text-white">
              <MapPin className="h-4 w-4" aria-hidden="true" /> Chỉ đường
            </a>
            <Link href="/contact" className="inline-flex items-center gap-[var(--space-2)] font-semibold text-white transition hover:text-[var(--color-primary-soft-text)]">
              Đầy đủ thông tin liên hệ <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
