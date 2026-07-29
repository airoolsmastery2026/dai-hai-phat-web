import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { ARTICLES } from "@/content/blog";

export function ArticlesSection() {
  return (
    <section id="tin-tuc" className="border-y border-slate-200 bg-white py-20">
      <Container>
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-primary)]">Checklist kỹ thuật</span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">DỮ LIỆU CẦN CÓ TRƯỚC KHẢO SÁT</h2>
          </div>
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-primary)] hover:underline">
            Xem Tất Cả Bài Viết <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {ARTICLES.map((article) => (
            <article key={article.id} className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm transition-all hover:shadow-md">
              <div className="relative h-44 overflow-hidden">
                <Image src={article.image} alt={article.title} width={800} height={176} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                <span className="absolute left-3 top-3 rounded-full bg-[var(--color-primary)] px-2.5 py-1 text-[10px] font-bold text-white">
                  {article.category}
                </span>
              </div>
              <div className="flex flex-grow flex-col p-5">
                <div className="mb-2 flex items-center gap-3 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                    Dữ liệu cần xác nhận
                  </span>
                </div>
                <h3 className="mb-2 text-sm font-bold leading-snug text-slate-900 transition-colors hover:text-[var(--color-primary)]">{article.title}</h3>
                <p className="mb-4 flex-grow text-xs leading-relaxed text-slate-600 line-clamp-3">{article.excerpt}</p>
                <Link href={`/blog/${article.slug}`} className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 hover:text-[var(--color-primary)]">
                  Đọc Chi Tiết <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
