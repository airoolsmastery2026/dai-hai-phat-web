import type { Metadata } from "next";

import { AIConsultationCta } from "@/components/sections/AIConsultationCta";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { COMPANY_CONFIG, COMPANY_STATS } from "@/content/company";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description:
    "Phạm vi dịch vụ và quy trình làm việc của Đại Hải Phát trong lĩnh vực nội thất và cơ khí dân dụng cho nhà ở.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Giới thiệu Đại Hải Phát",
    description:
      "Thiết kế, gia công và thi công nội thất cùng cơ khí dân dụng theo hiện trạng nhà ở.",
    url: `${COMPANY_CONFIG.websiteUrl}/about`,
    type: "website",
    images: ["/images/interior/interior78.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Giới thiệu Đại Hải Phát",
    description:
      "Thiết kế, gia công và thi công nội thất cùng cơ khí dân dụng theo hiện trạng nhà ở.",
    images: ["/images/interior/interior78.webp"],
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <PageHero
        eyebrow="Về Đại Hải Phát"
        title="Nội thất và cơ khí dân dụng cho không gian sống"
        description="Từ tiếp nhận nhu cầu, khảo sát và chọn vật liệu đến gia công, lắp đặt cho nhà phố, căn hộ và biệt thự."
      />

      <section className="py-[var(--space-8)] sm:py-[var(--space-10)] lg:py-[var(--space-12)]">
        <Container className="grid gap-[var(--space-4)] lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-[var(--space-4)] sm:p-[var(--space-5)]">
            <h2 className="text-lg font-bold text-[var(--color-text)]">Phạm vi làm việc</h2>
            <p className="mt-[var(--space-2)] text-sm leading-6 text-[var(--color-text-muted)]">
              Nội thất, cửa cổng, cầu thang, lan can, mái che và gia công cơ khí theo yêu cầu. Phương án chỉ chốt sau khi kích thước, vật liệu và điều kiện thi công được xác nhận.
            </p>
            <p className="mt-[var(--space-2)] text-sm leading-6 text-[var(--color-text-muted)]">
              Báo giá chính thức được lập sau bước khảo sát và xác nhận phạm vi công việc.
            </p>
          </Card>

          <Card className="p-[var(--space-4)] sm:p-[var(--space-5)]">
            <h2 className="text-lg font-bold text-[var(--color-text)]">Dữ liệu vận hành</h2>
            <div className="mt-[var(--space-3)] grid grid-cols-2 gap-[var(--space-2)]">
              {COMPANY_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-[var(--space-3)]"
                >
                  <p className="text-lg font-bold text-[var(--color-primary)]">{stat.value}</p>
                  <p className="mt-[var(--space-1)] text-xs leading-5 text-[var(--color-text-muted)]">{stat.label}</p>
                </div>
              ))}
            </div>
          </Card>
        </Container>
      </section>

      <AIConsultationCta
        eyebrow="Bắt đầu từ hiện trạng"
        title="Chuẩn bị thông tin trước khi kỹ sư khảo sát"
        description="Gửi hạng mục, vị trí, kích thước dự kiến và ảnh hiện trạng. Đội ngũ Đại Hải Phát sẽ kiểm tra thông tin và liên hệ để xác nhận bước tiếp theo."
        secondaryHref="/gallery"
        secondaryLabel="Xem công trình"
      />
    </main>
  );
}
