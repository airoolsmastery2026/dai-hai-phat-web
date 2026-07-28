import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { COMPANY_CONFIG } from "@/content/company";

export function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-16 bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 rounded-3xl bg-orange-500 p-6 text-white sm:p-10 lg:grid-cols-[1fr_0.9fr] lg:p-14">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-100">Bước tiếp theo</p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">Trao đổi trực tiếp với kỹ sư Đại Hải Phát</h2>
            <p className="mt-5 max-w-xl leading-7 text-orange-50">
              Gửi ảnh hiện trạng, kích thước dự kiến và vị trí công trình qua Zalo để đội ngũ chuẩn bị phương án trước khi khảo sát.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={COMPANY_CONFIG.socials.zalo1} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-orange-600 hover:bg-orange-50">
                <MessageCircle className="h-5 w-5" aria-hidden="true" /> Gửi thông tin qua Zalo
              </a>
              <a href={`tel:${COMPANY_CONFIG.phones[0].raw}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/50 px-5 py-3 font-bold text-white hover:bg-white/10">
                <Phone className="h-5 w-5" aria-hidden="true" /> {COMPANY_CONFIG.phones[0].display}
              </a>
            </div>
          </div>

          <address className="grid content-center gap-4 not-italic">
            <ContactItem icon={Phone} label="Hotline">
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
      </div>
    </section>
  );
}

function ContactItem({ icon: Icon, label, children }: { icon: typeof Phone; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-white/10 p-4">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-orange-100" aria-hidden="true" />
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-orange-100">{label}</p>
        <div className="mt-1 break-words font-semibold">{children}</div>
      </div>
    </div>
  );
}
