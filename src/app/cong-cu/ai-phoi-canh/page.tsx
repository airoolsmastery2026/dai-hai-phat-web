import type { Metadata } from "next";

import { AIConceptStudio } from "@/components/ai/AIConceptStudio";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";

const PAGE_TITLE = "AI phối cảnh hiện trạng";
const PAGE_DESCRIPTION =
  "Tải ảnh hiện trạng và ảnh mẫu để Đại Hải Phát AI Studio tạo bốn góc phối cảnh đồng bộ ngay trên website.";

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
        eyebrow="Đại Hải Phát AI Concept Studio"
        title="Tạo phối cảnh trên chính ảnh công trình"
        description="Công cụ chạy trực tiếp trong website: nhận ảnh hiện trạng, ảnh mẫu và yêu cầu kỹ thuật; sau đó dựng chính diện, góc trái, góc phải và chi tiết vật liệu của cùng một phương án."
      />

      <section
        className="py-[var(--space-section)] lg:py-[var(--space-section-lg)]"
        aria-label="Công cụ tạo phối cảnh AI"
      >
        <Container>
          <AIConceptStudio enabled={enabled} />
        </Container>
      </section>
    </main>
  );
}
