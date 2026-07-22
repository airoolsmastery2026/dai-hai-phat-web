"use client";

import { MapPin, Mail, PhoneCall } from "lucide-react";
import { motion } from "framer-motion";

import { Container } from "@/components/ui/Container";
import { COMPANY_CONFIG } from "@/content/company";

const getMapEmbedUrl = ({ lat, lng }: { lat: number; lng: number }) =>
  `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;

export function ContactSection() {
  const mapEmbedUrl = getMapEmbedUrl(COMPANY_CONFIG.coordinates);

  return (
    <section id="contact" className="bg-[#f5f5f2] py-24">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }} className="overflow-hidden border border-slate-200 bg-white shadow-sm">
            <div className="h-[320px] w-full">
              <iframe title="Đại Hải Phát location" src={mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" />
            </div>
            <div className="space-y-4 p-8">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 text-[#FF5722]" />
                <div>
                  <p className="font-semibold text-slate-900">Address</p>
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

          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }} className="border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#FF5722]">Get in touch</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">Discuss your next industrial or commercial project.</h2>
            <p className="mt-4 text-lg leading-8 text-slate-700">Share the scope, timeline, and goals and we will respond with a practical path forward.</p>
            <form className="mt-8 space-y-5">
              <div>
                <label htmlFor="contact-name" className="mb-2 block text-sm font-semibold text-slate-700">Full name</label>
                <input id="contact-name" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#FF5722]" placeholder="Nguyễn Văn A" />
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
                <input id="contact-email" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#FF5722]" placeholder="name@example.com" />
              </div>
              <div>
                <label htmlFor="contact-project" className="mb-2 block text-sm font-semibold text-slate-700">Project needs</label>
                <textarea id="contact-project" className="min-h-[140px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#FF5722]" placeholder="Describe the project scope..." />
              </div>
              <button type="button" className="w-full rounded-2xl bg-[#FF5722] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90">
                Send request
              </button>
            </form>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
