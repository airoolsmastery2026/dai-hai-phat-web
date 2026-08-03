import type { Metadata } from "next";

import { ProtectedConceptStudio } from "@/components/ai/ProtectedConceptStudio";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";

const PAGE_TITLE = "Phối cảnh ý tưởng theo hiện trạng";
const PAGE_DESCRIPTION =
  "Tải ảnh hiện trạng và ảnh mẫu để Đại Hải Phát dựng bốn góc phối cảnh đồng bộ, hỗ trợ trao đổi phương án trước khi kỹ sư khảo sát và tư vấn chi tiết.";

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
        description="Hệ thống dựng hình để trao đổi ý tưởng; kỹ sư Đại Hải Phát là người khảo sát và xác nhận phương án kỹ thuật. Bản xem trước được bảo vệ và chỉ mở quyền nhận ảnh sau khi hồ sơ được kiểm tra."
      />

      <section
        className="py-[var(--space-section)] lg:py-[var(--space-section-lg)]"
        aria-label="Tham khảo ý tưởng; kỹ sư Đại Hải Phát xác nhận phương án kỹ thuật"
      >
        <Container>
          <ProtectedConceptStudio enabled={enabled} />
        </Container>
      </section>
    </main>
  );
}
