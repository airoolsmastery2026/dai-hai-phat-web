import { Mail, MapPin, PhoneCall, MessageCircle } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { COMPANY_CONFIG } from "@/content/company";
import { HOME_CONTACT_CONTENT } from "@/content/home";

const getMapEmbedUrl = ({ lat, lng }: { lat: number; lng: number }) =>
  `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;

export function ContactSection() {
  const mapEmbedUrl = getMapEmbedUrl(COMPANY_CONFIG.coordinates);
  const { eyebrow, title, description, nameLabel, phoneLabel, messageLabel, submitLabel, namePlaceholder, phonePlaceholder, messagePlaceholder } = HOME_CONTACT_CONTENT;

  return (
    <section id="contact" className="bg-slate-50 py-20 lg:py-24">
      <Container className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-white">
          <div className="h-[300px] w-full">
            <iframe title="Đại Hải Phát location" src={mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" />
          </div>
          <div className="space-y-4 p-8">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 text-[#FF5722]" />
              <div>
                <p className="font-semibold text-slate-900">Địa chỉ</p>
                <a href={COMPANY_CONFIG.googleMapsUrl} target="_blank" rel="noreferrer" className="mt-1 block text-sm leading-7 text-slate-600 hover:text-[#FF5722]">
                  {COMPANY_CONFIG.address}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <PhoneCall className="mt-1 h-5 w-5 text-[#FF5722]" />
              <div>
                <p className="font-semibold text-slate-900">Điện thoại</p>
                <div className="mt-1 space-y-1 text-sm leading-7 text-slate-600">
                  {COMPANY_CONFIG.phones.map((phone) => (
                    <a key={phone.raw} href={`tel:${phone.raw}`} className="block hover:text-[#FF5722]">
                      {phone.display}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="mt-1 h-5 w-5 text-[#FF5722]" />
              <div>
                <p className="font-semibold text-slate-900">Email</p>
                <a href={`mailto:${COMPANY_CONFIG.email}`} className="mt-1 block text-sm leading-7 text-slate-600 hover:text-[#FF5722]">
                  {COMPANY_CONFIG.email}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MessageCircle className="mt-1 h-5 w-5 text-[#FF5722]" />
              <div>
                <p className="font-semibold text-slate-900">Zalo</p>
                <a href={COMPANY_CONFIG.socials.zalo1} target="_blank" rel="noreferrer" className="mt-1 block text-sm leading-7 text-slate-600 hover:text-[#FF5722]">
                  {COMPANY_CONFIG.phones[0].display}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[20px] border border-slate-200 bg-white p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#FF5722]">{eyebrow}</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            {description}
          </p>
          <form className="mt-8 space-y-4">
            <div>
              <label htmlFor="contact-name" className="mb-2 block text-sm font-semibold text-slate-700">{nameLabel}</label>
              <input id="contact-name" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#FF5722]" placeholder={namePlaceholder} />
            </div>
            <div>
              <label htmlFor="contact-phone" className="mb-2 block text-sm font-semibold text-slate-700">{phoneLabel}</label>
              <input id="contact-phone" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#FF5722]" placeholder={phonePlaceholder} />
            </div>
            <div>
              <label htmlFor="contact-message" className="mb-2 block text-sm font-semibold text-slate-700">{messageLabel}</label>
              <textarea id="contact-message" className="min-h-[140px] w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#FF5722]" placeholder={messagePlaceholder} />
            </div>
            <button type="button" className="w-full rounded-full bg-[#FF5722] px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">
              {submitLabel}
            </button>
          </form>
        </div>
      </Container>
    </section>
  );
}
