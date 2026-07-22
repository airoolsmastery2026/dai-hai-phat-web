import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { TopBar } from "@/components/layout/TopBar";
import { SiteNavigation } from "@/components/layout/SiteNavigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { FloatingCta } from "@/components/layout/FloatingCta";
import { BackToTop } from "@/components/layout/BackToTop";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { ARTICLES } from "@/content/blog";
import { COMPANY_CONFIG } from "@/content/company";

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = ARTICLES.find((item) => item.slug === params.slug);

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
    },
  };
}

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const article = ARTICLES.find((item) => item.slug === params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar />
      <SiteNavigation />
      <main>
      <section className="bg-slate-950 py-24 text-white">
        <Container>
          <Link href="/blog" className="text-sm font-semibold text-orange-300 hover:underline">
            ← Quay lại blog
          </Link>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.35em] text-orange-300">{article.category}</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold sm:text-5xl">{article.title}</h1>
          <p className="mt-6 text-base text-slate-300">Tác giả {article.author} • {article.date}</p>
        </Container>
      </section>

      <section className="py-20">
        <Container className="space-y-10">
          <Breadcrumb items={[{ label: "Blog", href: "/blog" }, { label: article.title }]} />
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="relative h-80">
              <Image src={article.image} alt={article.title} fill className="object-cover" />
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-sm leading-8 text-slate-700">{article.content}</p>
              <ul className="mt-6 space-y-3">
                {article.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#FF5722]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Bạn có thể quan tâm</h2>
              <div className="mt-6 space-y-4">
                {ARTICLES.filter((item) => item.slug !== article.slug).slice(0, 3).map((item) => (
                  <Link key={item.slug} href={`/blog/${item.slug}`} className="block rounded-2xl border border-slate-200 p-4 transition-colors hover:border-[#FF5722]">
                    <p className="text-sm font-semibold text-[#FF5722]">{item.category}</p>
                    <p className="mt-2 text-sm font-medium text-slate-800">{item.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
      </main>
      <SiteFooter />
      <FloatingCta />
      <BackToTop />
    </div>
  );
}
