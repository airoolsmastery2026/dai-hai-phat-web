import Image from "next/image";
import Link from "next/link";

import { SERVICES } from "@/content/services";

export function ProjectsSection() {
  return (
    <section id="projects" className="scroll-mt-16 bg-slate-50 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#FF5722]">
            Thư viện giải pháp
          </p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Hình dung phương án trước khi khảo sát
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            Các hình ảnh hiện tại dùng để minh họa nhóm giải pháp. Hồ sơ công
            trình thực tế sẽ chỉ được công bố sau khi doanh nghiệp xác minh nội
            dung và quyền sử dụng.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-orange-300 hover:shadow-md"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-200">
                <Image
                  src={service.image}
                  alt={`Hình minh họa: ${service.title}`}
                  fill
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                  className="object-cover transition duration-300 group-hover:scale-[1.02]"
                />
                <span className="absolute left-3 top-3 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-semibold text-white">
                  Hình minh họa
                </span>
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FF5722]">
                  {service.subtitle}
                </p>
                <h3 className="mt-2 text-lg font-bold text-slate-900">
                  {service.title}
                </h3>
                <p className="mt-4 text-sm font-semibold text-[#FF5722]">
                  Xem giải pháp →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
