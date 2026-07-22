"use client";

import { MapPin, Mail, PhoneCall } from "lucide-react";
import { motion } from "framer-motion";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { COMPANY_CONFIG } from "@/content/company";

const getMapEmbedUrl = ({ lat, lng }: { lat: number; lng: number }) =>
  `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;

export function ContactSection() {
  const mapEmbedUrl = getMapEmbedUrl(COMPANY_CONFIG.coordinates);

  return (
    <section id="contact" className="bg-slate-50 py-24">
      <Container>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.5 }}>
          <SectionHeading
            eyebrow="Liên hệ"
            title="Đặt lịch tư vấn hoặc gửi yêu cầu báo giá"
            description="Chúng tôi sẵn sàng phản hồi trong thời gian sớm nhất với thông tin thiết thực và bám sát nhu cầu của bạn."
          />
        </motion.div>

        <div className="mt-16 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="h-[320px] w-full">
              <iframe title="Vị trí Đại Hải Phát" src={mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" />
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
                  <p className="font-semibold text-slate-900">Hotline</p>
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
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <form className="space-y-5">
              <div>
                <label htmlFor="contact-name" className="mb-2 block text-sm font-semibold text-slate-700">Họ và tên</label>
                <input id="contact-name" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#FF5722]" placeholder="Nguyễn Văn A" />
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
                <input id="contact-email" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#FF5722]" placeholder="name@example.com" />
              </div>
              <div>
                <label htmlFor="contact-project" className="mb-2 block text-sm font-semibold text-slate-700">Dự án cần tư vấn</label>
                <textarea id="contact-project" className="min-h-[140px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#FF5722]" placeholder="Mô tả nhu cầu của bạn..." />
              </div>
              <button type="button" className="w-full rounded-2xl bg-[#FF5722] px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                Gửi yêu cầu
              </button>
            </form>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
