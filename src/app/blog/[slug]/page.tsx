import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AIConsultationCta } from "@/components/sections/AIConsultationCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { ARTICLES } from "@/content/blog";
import { COMPANY_CONFIG } from "@/content/company";
import { normalizeRouteSlug } from "@/lib/routing";

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const normalizedSlug = normalizeRouteSlug(slug);
  const article = ARTICLES.find((item) => item.slug === normalizedSlug);

  if (!article) {
    return { title: "Bài viết không tồn tại" };
  }

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `${COMPANY_CONFIG.websiteUrl}/blog/${article.slug}`,
      type: "article",
      images: [article.image],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const normalizedSlug = normalizeRouteSlug(slug);
  const article = ARTICLES.find((item) => item.slug === normalizedSlug);

  if (!article) {
    notFound();
  }

  const canonicalUrl = `${COMPANY_CONFIG.websiteUrl}/blog/${article.slug}`;
  const structuredData: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${canonicalUrl}#article`,
      headline: article.title,
      description: article.excerpt,
      image: new URL(article.image, COMPANY_CONFIG.websiteUrl).toString(),
      mainEntityOfPage: canonicalUrl,
      publisher: {
        "@id": `${COMPANY_CONFIG.websiteUrl}/#organization`,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Trang chủ",
          item: COMPANY_CONFIG.websiteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: `${COMPANY_CONFIG.websiteUrl}/blog`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: article.title,
          item: canonicalUrl,
        },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <JsonLd id="dhp-blog-structured-data" data={structuredData} />
      <section className="bg-[var(--color-surface-dark)] py-[var(--space-section)] text-white lg:py-[var(--space-section-lg)]">
        <Container>
          <Link href="/blog" className="text-sm font-semibold text-[var(--color-primary-soft-text)] hover:underline">
            ← Quay lại blog
          </Link>
          <p className="mt-[var(--space-4)] text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-primary-soft-text)]">
            {article.category}
          </p>
          <h1 className="mt-[var(--space-4)] max-w-4xl text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl">
            {article.title}
          </h1>
          <p className="mt-[var(--space-6)] text-base text-[var(--color-text-dark-muted)]">
            Checklist dữ liệu trước khảo sát kỹ thuật
          </p>
        </Container>
      </section>

      <section className="py-[var(--space-section)] lg:py-[var(--space-section-lg)]">
        <Container className="space-y-[var(--space-10)]">
          <Breadcrumb items={[{ label: "Blog", href: "/blog" }, { label: article.title }]} />
          <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
            <div className="relative aspect-[16/7]">
              <Image
                src={article.image}
                alt={article.title}
                fill
                sizes="(max-width: 1023px) 100vw, 1200px"
                className="object-cover"
              />
            </div>
          </div>

          <div className="grid gap-[var(--space-10)] lg:grid-cols-[1.2fr_0.8fr]">
            <article className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-8)] shadow-[var(--shadow-sm)]">
              <p className="text-sm leading-8 text-[var(--color-text-muted)]">
                {article.content}
              </p>
              <ul className="mt-[var(--space-6)] space-y-[var(--space-3)]">
                {article.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-[var(--space-3)] text-sm text-[var(--color-text-muted)]">
                    <span className="mt-1 h-2.5 w-2.5 rounded-[var(--radius-full)] bg-[var(--color-primary)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <aside className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-8)] shadow-[var(--shadow-sm)]">
              <h2 className="text-xl font-bold text-[var(--color-text)]">
                Checklist liên quan
              </h2>
              <div className="mt-[var(--space-6)] space-y-[var(--space-4)]">
                {ARTICLES.filter((item) => item.slug !== article.slug).slice(0, 3).map((item) => (
                  <Link key={item.slug} href={`/blog/${item.slug}`} className="block rounded-[var(--radius-lg)] border border-[var(--color-border)] p-[var(--space-4)] transition-colors duration-[var(--duration-fast)] hover:border-[var(--color-primary)]">
                    <p className="text-sm font-semibold text-[var(--color-primary)]">{item.category}</p>
                    <p className="mt-[var(--space-2)] text-sm font-medium text-[var(--color-text)]">{item.title}</p>
                  </Link>
                ))}
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <AIConsultationCta
        eyebrow="Áp dụng checklist"
        title="Đưa dữ liệu này vào hồ sơ dự án"
        description="Trợ lý AI sẽ chọn trước đúng hạng mục và tiếp tục hỏi từng dữ liệu còn thiếu. Thông tin chỉ được bàn giao cho Đại Hải Phát sau khi anh/chị hoàn tất và đồng ý gửi hồ sơ."
        servicePreset={article.aiService}
        secondaryHref="/blog"
        secondaryLabel="Xem checklist khác"
      />
    </main>
  );
}
