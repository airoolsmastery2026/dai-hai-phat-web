import type { Metadata } from "next";

import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { COMPANY_CONFIG, COMPANY_STATS } from "@/content/company";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description:
    "Thông tin liên hệ, phạm vi dịch vụ và quy trình làm việc của Đại Hải Phát trong lĩnh vực nội thất và cơ khí xây dựng.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Giới thiệu Đại Hải Phát",
    description:
      "Thông tin liên hệ, phạm vi dịch vụ và quy trình làm việc của Đại Hải Phát.",
    url: `${COMPANY_CONFIG.websiteUrl}/about`,
    type: "website",
    images: ["/images/factory/factory01.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Giới thiệu Đại Hải Phát",
    description:
      "Thông tin liên hệ, phạm vi dịch vụ và quy trình làm việc của Đại Hải Phát.",
    images: ["/images/factory/factory01.webp"],
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <PageHero
        eyebrow="Về Đại Hải Phát"
        title="Nội thất và cơ khí xây dựng theo dữ liệu thực tế"
        description="Đại Hải Phát tiếp nhận nhu cầu, khảo sát, thống nhất vật liệu và triển khai theo phạm vi đã xác nhận với khách hàng."
      />

      <section className="py-[var(--space-section)] lg:py-[var(--space-section-lg)]">
        <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-[var(--space-8)]">
            <h2 className="text-2xl font-bold text-[var(--color-text)]">
              Phạm vi làm việc
            </h2>
            <p className="mt-[var(--space-4)] text-sm leading-8 text-[var(--color-text-muted)]">
              Đại Hải Phát tiếp nhận các hạng mục nội thất, cửa cổng, cầu
              thang, lan can, mái che và gia công cơ khí theo yêu cầu. Phương
              án chỉ được chốt sau khi có kích thước, vật liệu và điều kiện thi
              công cần thiết.
            </p>
            <p className="mt-[var(--space-4)] text-sm leading-8 text-[var(--color-text-muted)]">
              Hình ảnh công trình được công bố qua thư viện có metadata và
              quyền sử dụng đã xác minh. Giá chính thức chỉ được lập sau bước
              khảo sát và xác nhận phạm vi.
            </p>
          </Card>

          <Card className="p-[var(--space-8)]">
            <h2 className="text-2xl font-bold text-[var(--color-text)]">
              Dữ liệu vận hành
            </h2>
            <div className="mt-[var(--space-6)] grid gap-[var(--space-5)] sm:grid-cols-2">
              {COMPANY_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-[var(--space-5)]"
                >
                  <p className="text-2xl font-bold text-[var(--color-primary)]">
                    {stat.value}
                  </p>
                  <p className="mt-[var(--space-2)] text-sm text-[var(--color-text-muted)]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </Container>
      </section>
    </main>
  );
}
