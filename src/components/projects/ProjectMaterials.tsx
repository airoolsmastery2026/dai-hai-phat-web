import { PackageOpen } from "lucide-react";

import type { ProjectItem } from "@/types/content";

export function ProjectMaterials({ materials }: { materials: ProjectItem["materials"] }) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
          <PackageOpen className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#FF5722]">Materials</p>
          <h3 className="mt-1 text-2xl font-semibold text-slate-900">Vật liệu sử dụng</h3>
        </div>
      </div>

      <div className="mt-8 grid gap-3 md:grid-cols-2">
        {materials.map((item) => (
          <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
