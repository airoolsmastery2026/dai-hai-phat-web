import { ServiceFeature } from "@/components/services/ServiceFeature";
import type { ServiceItem } from "@/types/content";

export function ServiceFeatures({ features }: { features: ServiceItem["features"] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {features.map((feature) => (
        <ServiceFeature key={feature.title} feature={feature} />
      ))}
    </div>
  );
}
