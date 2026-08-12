import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { COMPANY_CONFIG } from "@/content/company";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="scroll-mt-16 bg-[var(--color-surface)] py-[var(--space-10)] lg:py-[var(--space-section)]"
    >
      <Container>
        <div className="grid gap-[var(--space-6)] rounded-[var(--radius-xl)] bg-[var(--color-surface-dark)] p-[var(--space-5)] text-white shadow-[var(--shadow-md)] sm:p-[var(--space-6)] lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:p-[var(--space-8)]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/75">
              Cần tư vấn?
            </p>
            <h2 className="mt-[var(--space-2)] text-[length:var(--font-h2)] font-bold leading-tight">
              Gửi hiện trạng, kỹ sư sẽ tiếp nhận
            </h2>
            <p className="mt-[var(--space-3)] max-w-xl text-sm leading-6 text-white/80 sm:text-base">
              Chỉ cần ảnh, kích thước dự kiến và vị trí công trình. Đội ngũ sẽ liên hệ để xác nhận trước khi khảo sát.
            </p>
            <div className="mt-[var(--space-5)] grid gap-[var(--space-2)] sm:flex">
              <a
                href={COMPANY_CONFIG.socials.zalo1}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] bg-white px-[var(--space-4)] py-[var(--space-2)] text-sm font-bold text-[var(--color-primary)] transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-primary-soft)]"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" /> Gửi qua Zalo
              </a>
              <a
                href={`tel:${COMPANY_CONFIG.phones[0].raw}`}
                className="inline-flex min-h-11 items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-white/40 px-[var(--space-4)] py-[var(--space-2)] text-sm font-bold text-white transition-colors duration-[var(--duration-fast)] hover:bg-white/10"
              >
                <Phone className="h-4 w-4" aria-hidden="true" /> Gọi {COMPANY_CONFIG.phones[0].display}
              </a>
            </div>
          </div>

          <address className="grid gap-[var(--space-2)] not-italic sm:grid-cols-2 lg:grid-cols-1">
            <ContactLine icon={Phone} label="Hotline" href={`tel:${COMPANY_CONFIG.phones[0].raw}`}>
              {COMPANY_CONFIG.phones[0].display}
            </ContactLine>
            <ContactLine icon={Mail} label="Email" href={`mailto:${COMPANY_CONFIG.email}`}>
              {COMPANY_CONFIG.email}
            </ContactLine>
            <ContactLine icon={MapPin} label="Địa chỉ" href={COMPANY_CONFIG.googleMapsUrl} external>
              {COMPANY_CONFIG.address}
            </ContactLine>
          </address>
        </div>
      </Container>
    </section>
  );
}

function ContactLine({
  icon: Icon,
  label,
  href,
  external = false,
  children,
}: {
  icon: typeof Phone;
  label: string;
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="flex min-h-11 items-center gap-[var(--space-3)] rounded-[var(--radius-md)] bg-white/8 px-[var(--space-3)] py-[var(--space-2)] transition hover:bg-white/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
    >
      <Icon className="h-4 w-4 shrink-0 text-white/70" aria-hidden="true" />
      <span className="min-w-0">
        <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-white/60">{label}</span>
        <span className="block break-words text-sm font-semibold text-white">{children}</span>
      </span>
    </a>
  );
}
