import type { ServiceFeature as ServiceFeatureType } from "@/types/content";

export function ServiceFeature({ feature }: { feature: ServiceFeatureType }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
    </div>
  );
}
