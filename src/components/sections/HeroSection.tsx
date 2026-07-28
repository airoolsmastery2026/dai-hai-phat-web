import { ArrowRight, Bot, CheckCircle2 } from "lucide-react";

import { COMPANY_CONFIG } from "@/content/company";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950 pt-16 text-white lg:pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(249,115,22,0.18),transparent_38%)]" />
      <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:min-h-[calc(100svh-5rem)] lg:grid-cols-[1.15fr_0.85fr] lg:px-8">

        <div className="max-w-3xl">

          <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-400/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-orange-300">
            <Bot className="h-4 w-4" aria-hidden="true" /> AI Engineering Office 24/7
          </span>

          <h1 className="mt-6 text-4xl font-black leading-[1.08] text-white sm:text-5xl lg:text-7xl">
            Tư vấn cơ khí & nội thất
            <span className="block text-orange-400">từ nhu cầu đến phương án.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            Trả lời từng câu hỏi ngắn để hệ thống ghi nhận hạng mục, vật liệu,
            dữ liệu hiện trạng và chuẩn bị hồ sơ sơ bộ trước khi kỹ sư khảo sát.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">

            <a
              href="#ai-office"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
            >
              Bắt đầu tư vấn <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </a>

            <a
              href="#projects"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/30 px-6 py-3 font-bold text-white transition hover:bg-white hover:text-slate-950"
            >
              Xem công trình
            </a>

          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
            {["Một câu hỏi mỗi bước", "Không báo giá khi thiếu dữ liệu", "Kỹ sư xác nhận phương án"].map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-orange-400" aria-hidden="true" /> {item}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-300">Quy trình kỹ thuật số</p>
          <ol className="mt-5 space-y-4">
            {["Chọn hạng mục cần tư vấn", "Xác định vật liệu và dữ liệu hiện trạng", "Nhận proposal sơ bộ", "Chuyển hồ sơ cho kỹ sư khảo sát"].map((item, index) => (
              <li key={item} className="flex gap-4 rounded-2xl bg-slate-900/70 p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 font-black">{index + 1}</span>
                <span className="self-center font-semibold">{item}</span>
              </li>
            ))}
          </ol>
          <a href={`tel:${COMPANY_CONFIG.phones[0].raw}`} className="mt-5 block text-center text-sm font-semibold text-slate-300">
            Cần gấp? Gọi kỹ sư: <span className="text-white">{COMPANY_CONFIG.phones[0].display}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
