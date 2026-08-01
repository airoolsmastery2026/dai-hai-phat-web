import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

import { AIConsultationCta } from "@/components/sections/AIConsultationCta";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { ARTICLES } from "@/content/blog";
import { COMPANY_CONFIG } from "@/content/company";

export const metadata: Metadata = {
  title: "Checklist chuẩn bị khảo sát",
  description:
    "Checklist dữ liệu cần chuẩn bị trước khi khảo sát nội thất, mái che và cơ khí dân dụng tại Đại Hải Phát.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Checklist chuẩn bị khảo sát | Đại Hải Phát",
    description:
      "Thu thập đúng kích thước, vật liệu và điều kiện thi công trước khi lập phương án.",
    url: `${COMPANY_CONFIG.websiteUrl}/blog`,
    type: "website",
    images: [ARTICLES[0].image],
  },
  twitter: {
    card: "summary_large_image",
    title: "Checklist chuẩn bị khảo sát | Đại Hải Phát",
    description:
      "Thu thập đúng kích thước, vật liệu và điều kiện thi công trước khi lập phương án.",
    images: [ARTICLES[0].image],
  },
};

export default function BlogPage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Checklist chuẩn bị khảo sát Đại Hải Phát",
    url: `${COMPANY_CONFIG.websiteUrl}/blog`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: ARTICLES.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: article.title,
        url: `${COMPANY_CONFIG.websiteUrl}/blog/${article.slug}`,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <JsonLd data={collectionSchema} />
      <PageHero
        eyebrow="Checklist kỹ thuật"
        title="Chuẩn bị đúng dữ liệu trước khi khảo sát"
        description="Mỗi checklist tập trung vào dữ liệu giúp kỹ sư lập phương án chính xác hơn. Thông số vật liệu và tải trọng chỉ được kết luận sau khi đối chiếu hồ sơ kỹ thuật tương ứng."
      />

      <section className="py-[var(--space-section)] lg:py-[var(--space-section-lg)]">
        <Container>
          <div className="grid gap-[var(--space-5)] md:grid-cols-2 xl:grid-cols-3">
            {ARTICLES.map((article) => (
              <article
                key={article.id}
                className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 767px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-[var(--space-5)]">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                    {article.category}
                  </p>
                  <h2 className="mt-[var(--space-3)] text-xl font-bold leading-7 text-[var(--color-text)]">
                    {article.title}
                  </h2>
                  <p className="mt-[var(--space-3)] text-sm leading-6 text-[var(--color-text-muted)]">
                    {article.excerpt}
                  </p>
                  <Link
                    href={`/blog/${article.slug}`}
                    className="mt-[var(--space-4)] inline-flex min-h-11 items-center gap-[var(--space-2)] text-sm font-bold text-[var(--color-primary)] hover:underline"
                  >
                    Đọc thêm
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <AIConsultationCta
        eyebrow="Từ checklist đến hồ sơ"
        title="Ghi nhận dữ liệu dự án theo từng bước"
        description="Chọn hạng mục trong trợ lý AI để lưu kích thước, vật liệu, vị trí và nhu cầu sử dụng trước khi đội ngũ kỹ thuật xác nhận khảo sát."
        secondaryHref="/services"
        secondaryLabel="Xem dịch vụ"
      />
    </main>
  );
}
