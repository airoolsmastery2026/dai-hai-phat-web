import type { Metadata } from "next";
import { Bot, FileText, ImageIcon, MessageSquareText, Ruler, Sparkles } from "lucide-react";
import { Suspense } from "react";

import { AIOfficeRouteEntry } from "@/components/sections/AIOfficeRouteEntry";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "AI Tư Vấn 24/7",
  description:
    "Trợ lý AI Đại Hải Phát hỗ trợ làm rõ nhu cầu, đọc hình ảnh và hồ sơ, chuẩn bị phương án trước khảo sát và báo giá.",
  alternates: { canonical: "/ai-tu-van" },
};

const capabilities = [
  {
    icon: MessageSquareText,
    title: "Làm rõ nhu cầu",
    description:
      "Bắt đầu từ mô tả ngắn, AI gợi ý các thông tin cần bổ sung để kỹ sư hiểu đúng hạng mục.",
  },
  {
    icon: ImageIcon,
    title: "Phân tích hình ảnh",
    description:
      "Gửi ảnh hiện trạng, mẫu tham khảo hoặc chi tiết cần thi công để chuẩn bị phương án trao đổi.",
  },
  {
    icon: FileText,
    title: "Đọc hồ sơ",
    description:
      "Tổng hợp thông tin từ bản vẽ và tài liệu hỗ trợ để giảm thiếu sót trước bước khảo sát thực tế.",
  },
  {
    icon: Ruler,
    title: "Chuẩn bị dữ liệu báo giá",
    description:
      "Hướng dẫn tập hợp kích thước, vật liệu, vị trí và yêu cầu hoàn thiện trước khi kỹ sư xác nhận.",
  },
] as const;

export default function AITuVanPage() {
  const liveVoiceEnabled = Boolean(process.env.GEMINI_API_KEY?.trim());

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <PageHero
        eyebrow="AI Tư Vấn 24/7"
        title="Từ nhu cầu ban đầu đến hồ sơ sẵn sàng cho kỹ sư"
        description="Trợ lý AI Đại Hải Phát giúp bạn mô tả công việc rõ hơn, tập hợp hình ảnh và thông tin kỹ thuật, sau đó chuyển tiếp sang quy trình khảo sát và báo giá."
      />

      <section className="border-b border-[var(--color-border)] py-[var(--space-8)] sm:py-[var(--space-10)] lg:py-[var(--space-12)]">
        <Container>
          <div className="grid gap-[var(--space-4)] md:grid-cols-2 xl:grid-cols-4">
            {capabilities.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-5)] shadow-[var(--shadow-sm)]"
              >
                <div className="mb-[var(--space-4)] flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className="text-lg font-black text-[var(--color-text)]">{title}</h2>
                <p className="mt-[var(--space-2)] text-sm leading-6 text-[var(--color-text-muted)]">
                  {description}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-[var(--space-6)] flex flex-col gap-[var(--space-3)] sm:flex-row">
            <Button href="#ai-office">
              <Bot className="h-4 w-4" aria-hidden="true" />
              Bắt đầu tư vấn AI
            </Button>
            <Button href="/bao-gia" variant="secondary">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Chuẩn bị báo giá
            </Button>
          </div>

          <p className="mt-[var(--space-4)] max-w-3xl text-xs leading-5 text-[var(--color-text-muted)]">
            AI hỗ trợ thu thập và sắp xếp thông tin. Kích thước, vật liệu, biện pháp thi công và giá trị hợp đồng được kỹ sư Đại Hải Phát xác nhận trước khi chốt.
          </p>
        </Container>
      </section>

      <section id="ai-office" className="scroll-mt-20">
        <Suspense
          fallback={
            <div className="min-h-[720px] bg-[var(--color-background)]" aria-label="Đang chuẩn bị trợ lý AI" />
          }
        >
          <AIOfficeRouteEntry liveVoiceEnabled={liveVoiceEnabled} />
        </Suspense>
      </section>
    </main>
  );
}
