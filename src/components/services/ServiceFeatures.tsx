import { ServiceFeature } from "@/components/services/ServiceFeature";
import { EmptyState } from "@/components/ui/EmptyState";
import type { ServiceItem } from "@/types/content";

export function ServiceFeatures({ features }: { features: ServiceItem["features"] }) {
  if (!features.length) {
    return (
      <EmptyState
        title="Chưa có dữ liệu tính năng"
        description="Các tính năng của dịch vụ sẽ hiển thị sau khi được xác minh."
      />
    );
  }

  return (
    <div className="grid gap-[var(--space-6)] md:grid-cols-2 lg:grid-cols-3">
      {features.map((feature) => (
        <ServiceFeature key={feature.title} feature={feature} />
      ))}
    </div>
  );
}
