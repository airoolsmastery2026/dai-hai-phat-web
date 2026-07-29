import type { Metadata } from "next";

import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { COMPANY_CONFIG } from "@/content/company";
import { AI_DRAFT_RETENTION_DAYS } from "@/lib/ai/persistence";

export const metadata: Metadata = {
  title: "Quyền riêng tư",
  description:
    "Cách Đại Hải Phát lưu bản nháp tư vấn, tiếp nhận dữ liệu dự án và bảo vệ thông tin liên hệ của khách hàng.",
  alternates: { canonical: "/privacy" },
};

const dataGroups = [
  {
    title: "Dữ liệu anh/chị chủ động nhập",
    description:
      "Hạng mục, loại công trình, khu vực, kích thước dự kiến, vật liệu, ngân sách, thời gian, nhu cầu khảo sát và thông tin liên hệ.",
  },
  {
    title: "Ảnh hiện trạng",
    description:
      "Ảnh gốc được lưu cục bộ trên thiết bị để duy trì bản nháp. Khi bàn giao hồ sơ, hệ thống chỉ gửi số lượng ảnh, không gửi tệp ảnh gốc.",
  },
  {
    title: "Mục đích sử dụng",
    description:
      "Chuẩn bị tư vấn, xác nhận nhu cầu, sắp xếp khảo sát, lập phương án và quản lý việc tiếp nhận hồ sơ.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <PageHero
        eyebrow="Quyền riêng tư"
        title="Minh bạch dữ liệu trong hồ sơ tư vấn"
        description="Hồ sơ chỉ được bàn giao cho Đại Hải Phát sau khi anh/chị hoàn tất thông tin và đồng ý gửi."
      />

      <section className="py-[var(--space-section)] lg:py-[var(--space-section-lg)]">
        <Container>
          <div className="grid gap-[var(--space-6)] lg:grid-cols-3">
            {dataGroups.map((group) => (
              <Card key={group.title} className="p-[var(--space-6)]">
                <h2 className="text-xl font-bold text-[var(--color-text)]">
                  {group.title}
                </h2>
                <p className="mt-[var(--space-4)] text-sm leading-7 text-[var(--color-text-muted)]">
                  {group.description}
                </p>
              </Card>
            ))}
          </div>

          <div className="mt-[var(--space-10)] grid gap-[var(--space-6)] lg:grid-cols-2">
            <Card className="p-[var(--space-8)]">
              <h2 className="text-2xl font-bold text-[var(--color-text)]">
                Bản nháp trên thiết bị
              </h2>
              <p className="mt-[var(--space-4)] leading-7 text-[var(--color-text-muted)]">
                Bản nháp tư vấn được lưu trong trình duyệt tối đa{" "}
                {AI_DRAFT_RETENTION_DAYS} ngày để anh/chị có thể tiếp tục.
                Nút “xóa hồ sơ và bắt đầu lại” sẽ xóa dữ liệu của phiên trên
                thiết bị.
              </p>
              <p className="mt-[var(--space-4)] leading-7 text-[var(--color-text-muted)]">
                Nếu chưa đồng ý bàn giao, hệ thống không gửi hồ sơ liên hệ tới
                CRM của Đại Hải Phát.
              </p>
            </Card>

            <Card className="p-[var(--space-8)]">
              <h2 className="text-2xl font-bold text-[var(--color-text)]">
                Liên hệ về dữ liệu
              </h2>
              <p className="mt-[var(--space-4)] leading-7 text-[var(--color-text-muted)]">
                Để hỏi về hồ sơ đã gửi hoặc đề nghị kiểm tra thông tin liên hệ,
                hãy dùng email hay hotline chính thức dưới đây.
              </p>
              <div className="mt-[var(--space-6)] space-y-[var(--space-3)] text-sm font-semibold">
                <a
                  href={`mailto:${COMPANY_CONFIG.email}`}
                  className="block text-[var(--color-primary)] hover:underline"
                >
                  {COMPANY_CONFIG.email}
                </a>
                <a
                  href={`tel:${COMPANY_CONFIG.phones[0].raw}`}
                  className="block text-[var(--color-primary)] hover:underline"
                >
                  {COMPANY_CONFIG.phones[0].display}
                </a>
              </div>
            </Card>
          </div>
        </Container>
      </section>
    </main>
  );
}
