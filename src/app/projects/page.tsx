import Link from "next/link";
import type { Metadata } from "next";

import { Container } from "@/components/ui/Container";
import { ProjectExplorer } from "@/components/projects/ProjectExplorer";
import { PROJECTS } from "@/content/projects";
import { COMPANY_CONFIG } from "@/content/company";

export const metadata: Metadata = {
  title: "Dự án đã triển khai",
  description: "Khám phá các dự án nội thất, composite và kết cấu thép đã được Đại Hải Phát triển khai chuyên nghiệp.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Dự án đã triển khai",
    description: "Khám phá các dự án nội thất, composite và kết cấu thép đã được Đại Hải Phát triển khai chuyên nghiệp.",
    url: `${COMPANY_CONFIG.websiteUrl}/projects`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dự án đã triển khai",
    description: "Khám phá các dự án nội thất, composite và kết cấu thép đã được Đại Hải Phát triển khai chuyên nghiệp.",
  },
};

export default function ProjectsPage() {
  return (
    <main>
      <section className="bg-slate-950 py-24 text-white">
        <Container>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-300">Projects Platform</p>
            <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Các dự án đã được thiết kế, sản xuất và thi công chuyên nghiệp</h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">Từ nội thất, vách ngăn composite đến kết cấu thép, mỗi dự án đều thể hiện sự kết hợp giữa kỹ thuật, thẩm mỹ và tiến độ.</p>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#FF5722]">Danh sách dự án</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">Khám phá các công trình đã triển khai</h2>
            </div>
            <Link href="/" className="text-sm font-semibold text-[#FF5722] hover:underline">Quay về trang chủ</Link>
          </div>
          <ProjectExplorer projects={PROJECTS} />
        </Container>
      </section>
    </main>
  );
}
