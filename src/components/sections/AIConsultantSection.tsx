import { Bot, CheckCircle2, MessageSquareText, Ruler, Sparkles } from "lucide-react";

import { Container } from "@/components/ui/Container";

const capabilities = [
  {
    icon: Ruler,
    title: "Phân tích nhu cầu",
    description: "Tiếp nhận kích thước, công năng, vật liệu và ngân sách để định hướng giải pháp phù hợp.",
  },
  {
    icon: Sparkles,
    title: "Gợi ý phương án",
    description: "Đề xuất hạng mục nội thất hoặc cơ khí theo mục tiêu sử dụng và điều kiện công trình.",
  },
  {
    icon: MessageSquareText,
    title: "Chuyển chuyên gia",
    description: "Tổng hợp yêu cầu rõ ràng để đội ngũ Đại Hải Phát khảo sát và báo giá nhanh hơn.",
  },
];

const intakeItems = [
  "Loại công trình và hạng mục cần thực hiện",
  "Kích thước hoặc hình ảnh hiện trạng",
  "Vật liệu, phong cách và yêu cầu sử dụng",
  "Khu vực thi công và thời gian dự kiến",
];

export function AIConsultantSection() {
  return (
    <section id="ai-consultant" className="border-y border-slate-800 bg-slate-950 py-20 text-white lg:py-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-400/10 px-4 py-2 text-sm font-semibold text-orange-300">
              <Bot className="h-4 w-4" />
              AI tư vấn 24/7
            </div>
            <h2 className="mt-6 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Bắt đầu từ nhu cầu thực tế, không bắt đầu từ một mẫu có sẵn.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Trợ lý AI Đại Hải Phát giúp bạn mô tả công trình, xác định hạng mục và chuẩn bị thông tin trước khi đội ngũ kỹ thuật tiếp nhận.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {capabilities.map(({ icon: Icon, title, description }) => (
                <article key={title} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                  <Icon className="h-6 w-6 text-orange-400" />
                  <h3 className="mt-4 font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-700 bg-white p-6 text-slate-900 shadow-2xl sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Thông tin nên chuẩn bị</p>
            <h3 className="mt-3 text-2xl font-bold">Nhận định hướng nhanh hơn chỉ trong vài bước</h3>
            <ul className="mt-6 space-y-4">
              {intakeItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-7 text-slate-600 sm:text-base">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-orange-500" />
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
            >
              Bắt đầu yêu cầu tư vấn
            </a>
            <p className="mt-4 text-center text-xs leading-5 text-slate-500">
              AI hỗ trợ thu thập thông tin ban đầu. Phương án kỹ thuật và báo giá được xác nhận bởi đội ngũ Đại Hải Phát.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
