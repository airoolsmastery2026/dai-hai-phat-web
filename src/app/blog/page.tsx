import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

import { Container } from "@/components/ui/Container";
import { ARTICLES } from "@/content/blog";
import { COMPANY_CONFIG } from "@/content/company";

export const metadata: Metadata = {
  title: "Blog",
  description: "Tổng hợp bài viết về thiết kế nội thất, vật liệu composite và giải pháp kết cấu thép tại Đại Hải Phát.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog Đại Hải Phát",
    description: "Tổng hợp bài viết về thiết kế nội thất, vật liệu composite và giải pháp kết cấu thép.",
    url: `${COMPANY_CONFIG.websiteUrl}/blog`,
    type: "website",
  },
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-slate-950 py-24 text-white">
        <Container>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-300">Blog & kiến thức</p>
            <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Bài viết chuyên sâu về nội thất, composite và công trình thép</h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Khám phá các bài viết được xây dựng từ kinh nghiệm thi công thực tế, giúp khách hàng hiểu rõ hơn về giải pháp thiết kế và sản xuất.
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
                  <Image src={article.image} alt={article.title} fill className="object-cover" />
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
