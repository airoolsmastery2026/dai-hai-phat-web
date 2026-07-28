import type { Metadata } from "next";

import { Container } from "@/components/ui/Container";
import { COMPANY_CONFIG, COMPANY_STATS } from "@/content/company";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description:
    "Thông tin liên hệ, phạm vi dịch vụ và quy trình làm việc của Đại Hải Phát trong lĩnh vực nội thất và cơ khí xây dựng.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Giới thiệu Đại Hải Phát",
    description:
      "Thông tin liên hệ, phạm vi dịch vụ và quy trình làm việc của Đại Hải Phát.",
    url: `${COMPANY_CONFIG.websiteUrl}/about`,
    type: "website",
    images: ["/images/factory/factory01.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Giới thiệu Đại Hải Phát",
    description:
      "Thông tin liên hệ, phạm vi dịch vụ và quy trình làm việc của Đại Hải Phát.",
    images: ["/images/factory/factory01.webp"],
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-slate-950 py-24 text-white">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-300">Về Đại Hải Phát</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold sm:text-5xl">Nội thất và cơ khí xây dựng theo dữ liệu thực tế</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Đại Hải Phát tiếp nhận nhu cầu, khảo sát, thống nhất vật liệu và triển khai theo phạm vi đã xác nhận với khách hàng.
          </p>
        </Container>
      </section>

      <section className="py-20">
        <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Phạm vi làm việc</h2>
            <p className="mt-4 text-sm leading-8 text-slate-700">
              Đại Hải Phát tiếp nhận các hạng mục nội thất, cửa cổng, cầu thang, lan can, mái che và gia công cơ khí theo yêu cầu. Phương án chỉ được chốt sau khi có kích thước, vật liệu và điều kiện thi công cần thiết.
            </p>
            <p className="mt-4 text-sm leading-8 text-slate-700">
              Hình ảnh công trình được công bố qua thư viện có metadata và quyền sử dụng đã xác minh. Giá chính thức chỉ được lập sau bước khảo sát và xác nhận phạm vi.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Quy trình làm việc</h2>
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
