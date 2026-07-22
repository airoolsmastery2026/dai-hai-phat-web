import type { Metadata } from "next";
import { Mail, MapPin, PhoneCall } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { COMPANY_CONFIG } from "@/content/company";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Liên hệ Đại Hải Phát để nhận tư vấn báo giá và đặt lịch thi công.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Liên hệ Đại Hải Phát",
    description: "Liên hệ Đại Hải Phát để nhận tư vấn báo giá và đặt lịch thi công.",
    url: `${COMPANY_CONFIG.websiteUrl}/contact`,
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-slate-950 py-24 text-white">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-300">Liên hệ</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold sm:text-5xl">Đặt lịch tư vấn hoặc gửi yêu cầu báo giá</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Chúng tôi sẵn sàng phản hồi trong thời gian sớm nhất với thông tin thiết thực và bám sát nhu cầu của bạn.
          </p>
        </Container>
      </section>

      <section className="py-20">
        <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
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

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
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
                <label htmlFor="contact-project" className="mb-2 block text-sm font-semibold text-slate-700">Yêu cầu</label>
                <textarea id="contact-project" className="min-h-[140px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#FF5722]" placeholder="Mô tả nhu cầu của bạn..." />
              </div>
              <button type="button" className="w-full rounded-2xl bg-[#FF5722] px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                Gửi yêu cầu
              </button>
            </form>
          </div>
        </Container>
      </section>
    </main>
  );
}
