import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { COMPANY_CONFIG } from "@/content/company";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="scroll-mt-16 bg-[var(--color-surface)] py-[var(--space-section)] lg:py-[var(--space-section-lg)]"
    >
      <Container>
        <div className="grid gap-[var(--space-8)] rounded-[var(--radius-xl)] bg-[var(--color-surface-dark)] p-[var(--space-6)] text-white shadow-[var(--shadow-md)] sm:p-[var(--space-8)] lg:grid-cols-[1fr_0.9fr] lg:p-[var(--space-10)]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/80">
              Bước tiếp theo
            </p>
            <h2 className="mt-[var(--space-3)] text-[length:var(--font-h2)] font-bold leading-tight">
              Trao đổi trực tiếp với kỹ sư Đại Hải Phát
            </h2>
            <p className="mt-[var(--space-5)] max-w-xl leading-7 text-white/90">
              Gửi ảnh hiện trạng, kích thước dự kiến và vị trí công trình qua Zalo để đội ngũ chuẩn bị phương án trước khi khảo sát.
            </p>
            <div className="mt-[var(--space-8)] flex flex-col gap-[var(--space-3)] sm:flex-row">
              <a href={COMPANY_CONFIG.socials.zalo1} target="_blank" rel="noreferrer" className="inline-flex min-h-[var(--control-min-size)] items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] bg-white px-[var(--space-5)] py-[var(--space-3)] font-bold text-[var(--color-primary)] transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-primary-soft)]">
                <MessageCircle className="h-5 w-5" aria-hidden="true" /> Gửi thông tin qua Zalo
              </a>
              <a href={`tel:${COMPANY_CONFIG.phones[0].raw}`} className="inline-flex min-h-[var(--control-min-size)] items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-white/50 px-[var(--space-5)] py-[var(--space-3)] font-bold text-white transition-colors duration-[var(--duration-fast)] hover:bg-white/10">
                <Phone className="h-5 w-5" aria-hidden="true" /> {COMPANY_CONFIG.phones[0].display}
              </a>
            </div>
          </div>

          <address className="grid content-center gap-[var(--space-4)] not-italic">
            <ContactItem icon={Phone} label="Hotline chính">
              <a href={`tel:${COMPANY_CONFIG.phones[0].raw}`}>{COMPANY_CONFIG.phones[0].display}</a>
            </ContactItem>
            <ContactItem icon={Phone} label="Hotline hỗ trợ">
              <a href={`tel:${COMPANY_CONFIG.phones[1].raw}`}>{COMPANY_CONFIG.phones[1].display}</a>
            </ContactItem>
            <ContactItem icon={Mail} label="Email">
              <a href={`mailto:${COMPANY_CONFIG.email}`}>{COMPANY_CONFIG.email}</a>
            </ContactItem>
            <ContactItem icon={MapPin} label="Địa chỉ">
              <a href={COMPANY_CONFIG.googleMapsUrl} target="_blank" rel="noreferrer">{COMPANY_CONFIG.address}</a>
            </ContactItem>
          </address>
        </div>
      </Container>
    </section>
  );
}

function ContactItem({ icon: Icon, label, children }: { icon: typeof Phone; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-[var(--space-3)] rounded-[var(--radius-lg)] bg-white/10 p-[var(--space-4)]">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-white/80" aria-hidden="true" />
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/80">{label}</p>
        <div className="mt-[var(--space-1)] break-words font-semibold">{children}</div>
      </div>
    </div>
  );
}
