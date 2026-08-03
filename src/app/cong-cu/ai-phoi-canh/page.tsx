import type { Metadata } from "next";

import { AIConceptStudio } from "@/components/ai/AIConceptStudio";
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
        eyebrow="Công cụ hỗ trợ lên phương án"
        title="Dựng phối cảnh trên chính ảnh công trình"
        description="Gửi ảnh hiện trạng, mẫu tham khảo và yêu cầu mong muốn để xem trước chính diện, góc trái, góc phải và chi tiết vật liệu của cùng một phương án trước khi trao đổi cùng kỹ sư Đại Hải Phát."
      />

      <section
        className="py-[var(--space-section)] lg:py-[var(--space-section-lg)]"
        aria-label="Công cụ dựng phối cảnh ý tưởng"
      >
        <Container>
          <AIConceptStudio enabled={enabled} />
        </Container>
      </section>
    </main>
  );
}
