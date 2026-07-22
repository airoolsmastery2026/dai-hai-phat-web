"use client";

import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useState } from "react";

import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";

export function QuoteFormSection() {
  const [formLoading, setFormLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setTimeout(() => {
      setFormLoading(false);
      setFormSubmitted(true);
    }, 1200);
  };

  return (
    <section id="bao-gia" className="bg-[var(--color-surface-dark)] py-24 text-white">
      <Container>
        <Card className="mx-auto max-w-4xl border-white/10 bg-white/10 p-8 shadow-[var(--shadow-lg)] backdrop-blur md:p-12" tone="default">
          <div className="mb-8 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#FF5722]">Request a quote</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl">Start a project with a technical consultation tailored to your scope.</h2>
            <p className="mt-4 text-lg leading-8 text-slate-300">Share the project type and contact details to receive a structured response for fabrication, installation, and engineering support.</p>
          </div>

          {formSubmitted ? (
            <div className="py-12 text-center">
              <CheckCircle2 className="mx-auto mb-4 h-16 w-16 animate-bounce text-emerald-400" />
              <h3 className="mb-2 text-2xl font-bold text-white">Request submitted successfully</h3>
              <p className="text-sm text-slate-300">Thank you. Our engineering team will contact you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleQuoteSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="quote-name" className="mb-2 block text-xs font-semibold uppercase text-slate-300">Full name *</label>
                  <input id="quote-name" type="text" required placeholder="Nguyễn Văn A" className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-[#FF5722] focus:outline-none" />
                </div>
                <div>
                  <label htmlFor="quote-phone" className="mb-2 block text-xs font-semibold uppercase text-slate-300">Phone number *</label>
                  <input id="quote-phone" type="tel" required placeholder="0785505518" className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-[#FF5722] focus:outline-none" />
                </div>
              </div>
              <div>
                <label htmlFor="quote-service" className="mb-2 block text-xs font-semibold uppercase text-slate-300">Project category</label>
                <select id="quote-service" className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-4 py-3 text-white focus:border-[#FF5722] focus:outline-none">
                  <option>Industrial interior and furniture systems</option>
                  <option>Composite wall and partition solutions</option>
                  <option>Composite canopy and roofing systems</option>
                  <option>Steel structure and mechanical fabrication</option>
                </select>
              </div>
              <button type="submit" disabled={formLoading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#FF5722] px-4 py-4 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed">
                {formLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Send className="h-5 w-5" /> Send inquiry</>}
              </button>
            </form>
          )}
        </Card>
      </Container>
    </section>
  );
}
