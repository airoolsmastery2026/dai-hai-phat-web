import type { Metadata } from "next";

import { Container } from "@/components/ui/Container";
import { COMPANY_CONFIG, COMPANY_STATS } from "@/content/company";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description: "Thông tin về Đại Hải Phát, đội ngũ chuyên môn và năng lực thi công trong lĩnh vực nội thất, composite và kết cấu thép.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Giới thiệu Đại Hải Phát",
    description: "Thông tin về Đại Hải Phát, đội ngũ chuyên môn và năng lực thi công.",
    url: `${COMPANY_CONFIG.websiteUrl}/about`,
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-slate-950 py-24 text-white">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-300">Về Đại Hải Phát</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold sm:text-5xl">Đối tác thi công đáng tin cậy cho doanh nghiệp và hộ gia đình</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Chúng tôi tập trung cung cấp giải pháp nội thất, vật liệu composite và kết cấu thép với sự kết hợp giữa thiết kế, sản xuất, thi công và bảo trì.
          </p>
        </Container>
      </section>

      <section className="py-20">
        <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Sứ mệnh và năng lực</h2>
            <p className="mt-4 text-sm leading-8 text-slate-700">
              Đại Hải Phát xây dựng hệ thống sản xuất và thi công theo quy trình kiểm soát chất lượng chặt chẽ, từ khảo sát, thiết kế, gia công đến vận hành và bảo trì. Mỗi công trình đều được tối ưu cho độ bền, thẩm mỹ và hiệu quả chi phí.
            </p>
            <p className="mt-4 text-sm leading-8 text-slate-700">
              Với kinh nghiệm triển khai nhiều dự án từ nội thất đến kết cấu thép, công ty luôn hướng tới giá trị lâu dài cho khách hàng.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Chỉ số nổi bật</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {COMPANY_STATS.map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-2xl font-semibold text-[#FF5722]">{stat.value}</p>
                  <p className="mt-2 text-sm text-slate-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
