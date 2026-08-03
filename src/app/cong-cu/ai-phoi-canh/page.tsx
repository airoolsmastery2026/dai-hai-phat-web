import type { Metadata } from "next";

import { AIConceptStudio } from "@/components/ai/AIConceptStudio";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";

const PAGE_TITLE = "Phối cảnh ý tưởng theo hiện trạng";
const PAGE_DESCRIPTION =
  "Tải ảnh hiện trạng và ảnh mẫu để Đại Hải Phát dựng bốn góc phối cảnh tham khảo, hỗ trợ trao đổi phương án trước khi kỹ sư khảo sát và xác nhận chi tiết.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/cong-cu/ai-phoi-canh" },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "/cong-cu/ai-phoi-canh",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

export default function AIConceptStudioPage() {
  const enabled = Boolean(process.env.GEMINI_API_KEY?.trim());

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <PageHero
        eyebrow="Tham khảo ý tưởng · Kỹ sư xác nhận"
        title="Dựng phối cảnh trên chính ảnh công trình"
        description="Khách hàng cung cấp ảnh hiện trạng, mẫu tham khảo và yêu cầu mong muốn. Hệ thống dựng bốn góc để trao đổi ý tưởng; kích thước, vật liệu, kết cấu và báo giá chỉ có hiệu lực sau khi kỹ sư Đại Hải Phát khảo sát và xác nhận."
      />

      <section
        className="py-[var(--space-section)] lg:py-[var(--space-section-lg)]"
        aria-label="Khu vực tạo hình ảnh tham khảo, kỹ sư xác nhận phương án kỹ thuật"
      >
        <Container>
          <AIConceptStudio enabled={enabled} />
        </Container>
      </section>
    </main>
  );
}
