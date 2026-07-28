import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { ARTICLES } from "@/content/blog";
import { COMPANY_CONFIG } from "@/content/company";

export const metadata: Metadata = {
  title: "Checklist chuẩn bị khảo sát",
  description:
    "Checklist dữ liệu cần chuẩn bị trước khi khảo sát nội thất, mái che và cơ khí xây dựng tại Đại Hải Phát.",
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
    <main className="min-h-screen bg-slate-50">
      <JsonLd data={collectionSchema} />
      <section className="bg-slate-950 py-24 text-white">
        <Container>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-300">Checklist kỹ thuật</p>
            <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Chuẩn bị đúng dữ liệu trước khi khảo sát</h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Mỗi checklist tập trung vào dữ liệu giúp kỹ sư lập phương án chính xác hơn. Thông số vật liệu và tải trọng chỉ được kết luận sau khi đối chiếu hồ sơ kỹ thuật tương ứng.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            {ARTICLES.map((article) => (
              <article key={article.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="relative h-56">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 767px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#FF5722]">{article.category}</p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-900">{article.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{article.excerpt}</p>
                  <Link href={`/blog/${article.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#FF5722] hover:underline">
                    Đọc thêm
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
