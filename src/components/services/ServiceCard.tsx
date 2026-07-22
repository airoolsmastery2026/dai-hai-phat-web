import Image from "next/image";
import Link from "next/link";
import type { ServiceItem } from "@/types/content";

export function ServiceCard({ service }: { service: ServiceItem }) {
  return (
    <Link href={`/services/${service.slug}`} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-56 overflow-hidden">
        <Image src={service.image} alt={service.title} width={800} height={224} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#FF5722]">{service.subtitle}</p>
        <h3 className="mt-3 text-xl font-semibold text-slate-900">{service.title}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">{service.summary}</p>
      </div>
    </Link>
  );
}
