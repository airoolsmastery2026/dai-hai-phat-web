import type { Metadata } from "next";
import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { COMPANY_CONFIG } from "@/content/company";
import { PROJECTS } from "@/content/projects";
import { SERVICES } from "@/content/services";

export const metadata: Metadata = {
  title: "Thư viện",
  description: "Thư viện hình ảnh dự án thực tế, vật liệu composite và nội thất của Đại Hải Phát.",
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Thư viện Đại Hải Phát",
    description: "Thư viện hình ảnh dự án thực tế, vật liệu composite và nội thất của Đại Hải Phát.",
    url: `${COMPANY_CONFIG.websiteUrl}/gallery`,
    type: "website",
  },
};

export default function GalleryPage() {
  const galleryImages = [...PROJECTS.flatMap((project) => project.gallery), ...SERVICES.flatMap((service) => service.gallery)];

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-slate-950 py-24 text-white">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-300">Gallery</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold sm:text-5xl">Thư viện hình ảnh dự án thực tế và giải pháp thi công</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Cập nhật các hình ảnh hoàn thiện, quy trình sản xuất và công trình thực tế của Đại Hải Phát.
          </p>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {galleryImages.slice(0, 12).map((image, index) => (
              <div key={`${image}-${index}`} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="relative h-64">
                  <Image src={image} alt={`Hình ảnh gallery ${index + 1}`} fill className="object-cover" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
