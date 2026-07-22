import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { SERVICES } from "@/content/services";
import { ServiceCard } from "@/components/services/ServiceCard";

export default function ServicesPage() {
  return (
    <main>
      <section className="bg-slate-950 py-24 text-white">
        <Container>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-300">Dịch vụ chuyên nghiệp</p>
            <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Giải pháp công nghệ và vận hành cho doanh nghiệp đang mở rộng</h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Từ thiết kế hệ thống đến triển khai vận hành, chúng tôi xây dựng nền tảng giúp doanh nghiệp tăng hiệu quả và ra quyết định nhanh hơn.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {SERVICES.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/" className="text-sm font-semibold text-[#FF5722] hover:underline">
              Quay về trang chủ
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
