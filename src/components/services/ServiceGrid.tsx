import { ServiceCard } from "@/components/services/ServiceCard";
import type { ServiceItem } from "@/types/content";

export function ServiceGrid({ services }: { services: ServiceItem[] }) {
  return (
    <div className="grid gap-[var(--space-8)] md:grid-cols-2">
      {services.map((service) => (
        <ServiceCard key={service.slug} service={service} />
      ))}
    </div>
  );
}
