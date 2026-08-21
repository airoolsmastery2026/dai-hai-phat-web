import type { Metadata } from "next";
import { Bot, FileText, ImageIcon, MessageSquareText, Ruler, Sparkles } from "lucide-react";
import { Suspense } from "react";

import { AIOfficeLoadingState } from "@/components/sections/AIOfficeLoadingState";
import { AIOfficeRouteEntry } from "@/components/sections/AIOfficeRouteEntry";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Tư vấn trực tuyến 24/7",
  description:
    "Trợ lý tư vấn Đại Hải Phát hỗ trợ làm rõ nhu cầu, ghi nhận hình ảnh và hồ sơ, chuẩn bị phương án trước khảo sát và báo giá.",
  alternates: { canonical: "/ai-tu-van" },
};

const capabilities = [
  {
    icon: MessageSquareText,
    title: "Làm rõ nhu cầu",
    description:
      "Bắt đầu từ mô tả ngắn, trợ lý tư vấn gợi ý các thông tin cần bổ sung để kỹ sư hiểu đúng hạng mục.",
  },
  {
    icon: ImageIcon,
    title: "Ghi nhận hình ảnh",
    description:
      "Chọn ảnh hiện trạng hoặc mẫu tham khảo để lưu cùng bản nháp trên thiết bị; ảnh gốc được gửi riêng cho kỹ sư khi anh/chị chủ động chia sẻ.",
  },
  {
    icon: FileText,
    title: "Tổng hợp hồ sơ",
    description:
      "Sắp xếp thông tin dự án và tài liệu đã nhập để giảm thiếu sót trước bước khảo sát thực tế.",
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
        eyebrow="Tư vấn trực tuyến 24/7"
        title="Từ nhu cầu ban đầu đến hồ sơ sẵn sàng cho kỹ sư"
        description="Trợ lý tư vấn Đại Hải Phát giúp mô tả công việc rõ hơn, tập hợp hình ảnh và thông tin kỹ thuật, sau đó chuyển tiếp sang quy trình khảo sát và báo giá."
        imageSrc="/images/brand/hero-luxury-materials-v1.webp"
        imageAlt="Không gian vật liệu cao cấp đại diện cho kênh tư vấn trực tuyến Đại Hải Phát"
        imagePosition="72% center"
        highlights={["Tiếp nhận 24/7", "Ghi nhận ảnh & hồ sơ", "Chuyển kỹ sư xác nhận"]}
        actions={
          <>
            <Button href="#consultation">
              <Bot className="h-4 w-4" aria-hidden="true" />
              Bắt đầu tư vấn
            </Button>
            <Button href="/bao-gia" variant="secondary">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Chuẩn bị báo giá
            </Button>
          </>
        }
      />

      <section id="consultation" aria-label="Khu vực tư vấn trực tuyến" className="scroll-mt-20">
        <Suspense fallback={<AIOfficeLoadingState />}>
          <AIOfficeRouteEntry liveVoiceEnabled={liveVoiceEnabled} />
        </Suspense>
      </section>

      <section className="py-[var(--space-8)] sm:py-[var(--space-10)] lg:py-[var(--space-12)]">
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

          <div className="mt-[var(--space-6)] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-[var(--space-5)]">
            <p className="max-w-3xl text-sm leading-6 text-[var(--color-text-muted)]">
              Hệ thống hỗ trợ thu thập và sắp xếp thông tin. Kích thước, vật liệu, biện pháp thi công và giá trị hợp đồng vẫn được kỹ sư Đại Hải Phát xác nhận trước khi chốt.
            </p>
          </div>
        </Container>
      </section>
    </main>
  );
}
