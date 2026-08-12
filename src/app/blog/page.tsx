import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/JsonLd";
import { AIConsultationCta } from "@/components/sections/AIConsultationCta";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
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
        description="Xem nhanh ảnh, kích thước và điều kiện hiện trạng cần chuẩn bị trước khi kỹ sư kiểm tra phương án."
      />

      <section className="py-[var(--space-8)] sm:py-[var(--space-10)] lg:py-[var(--space-12)]">
        <Container>
          <div className="grid gap-[var(--space-4)] md:grid-cols-2 xl:grid-cols-3">
            {ARTICLES.map((article) => (
              <article
                key={article.id}
                className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]"
              >
                <div className="relative h-40 sm:h-44">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 767px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-[var(--space-4)]">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-primary)]">
                    {article.category}
                  </p>
                  <h2 className="mt-[var(--space-2)] text-lg font-bold leading-6 text-[var(--color-text)]">
                    {article.title}
                  </h2>
                  <p className="mt-[var(--space-2)] line-clamp-2 text-sm leading-6 text-[var(--color-text-muted)]">
                    {article.excerpt}
                  </p>
                  <Link
                    href={`/blog/${article.slug}`}
                    className="mt-[var(--space-2)] inline-flex min-h-10 items-center text-sm font-bold text-[var(--color-primary)] hover:underline"
                  >
                    Xem checklist
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <AIConsultationCta
        eyebrow="Từ checklist đến khảo sát"
        title="Cần kỹ sư xem nhanh hiện trạng?"
        description="Gửi hạng mục, vị trí, kích thước dự kiến và ảnh hiện trạng để đội ngũ kiểm tra trước khi hẹn khảo sát."
        secondaryHref="/services"
        secondaryLabel="Xem dịch vụ"
      />
    </main>
  );
}
