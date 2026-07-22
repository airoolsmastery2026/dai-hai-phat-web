"use client";

import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useState } from "react";

import { Container } from "@/components/ui/Container";

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
    <section id="bao-gia" className="bg-slate-900 py-20 text-white">
      <Container>
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-700 bg-slate-800 p-8 shadow-2xl md:p-12">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-extrabold md:text-4xl">BÁO GIÁ NỘI THẤT & MÁI CHE COMPOSITE</h2>
            <p className="text-sm text-slate-300">Gửi yêu cầu để nhận bản vẽ 3D và báo giá chi tiết Gỗ MDF Melamine, Nhựa Composite & Cơ khí trong 2 giờ.</p>
          </div>

          {formSubmitted ? (
            <div className="py-12 text-center">
              <CheckCircle2 className="mx-auto mb-4 h-16 w-16 animate-bounce text-emerald-400" />
              <h3 className="mb-2 text-2xl font-bold text-white">Gửi Yêu Cầu Thành Công!</h3>
              <p className="text-sm text-slate-300">Cảm ơn Quý khách. Đội ngũ KTS & Kỹ sư sẽ liên hệ tư vấn ngay.</p>
            </div>
          ) : (
            <form onSubmit={handleQuoteSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="quote-name" className="mb-2 block text-xs font-semibold uppercase text-slate-300">Họ và Tên *</label>
                  <input id="quote-name" type="text" required placeholder="Nguyễn Văn A" className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-[#FF5722] focus:outline-none" />
                </div>
                <div>
                  <label htmlFor="quote-phone" className="mb-2 block text-xs font-semibold uppercase text-slate-300">Số Điện Thoại *</label>
                  <input id="quote-phone" type="tel" required placeholder="0785505518" className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-[#FF5722] focus:outline-none" />
                </div>
              </div>
              <div>
                <label htmlFor="quote-service" className="mb-2 block text-xs font-semibold uppercase text-slate-300">Hạng Mục Cần Báo Giá</label>
                <select id="quote-service" className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-[#FF5722] focus:outline-none">
                  <option>Giường, Tủ quần áo, Kệ Tivi bằng gỗ MDF Melamine</option>
                  <option>Vách tường Tivi, Vách ngăn nhựa Composite / CNC</option>
                  <option>Mái che bằng tấm lợp nhựa đặc Composite chịu lực</option>
                  <option>Kết cấu thép nhà xưởng & Gia công cơ khí CNC</option>
                </select>
              </div>
              <button type="submit" disabled={formLoading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#FF5722] px-4 py-4 font-bold text-white shadow-lg transition-all hover:bg-orange-600 disabled:cursor-not-allowed">
                {formLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Send className="h-5 w-5" /> Gửi Yêu Cầu Báo Giá Nhanh</>}
              </button>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
