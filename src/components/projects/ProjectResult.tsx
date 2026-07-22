import type { ProjectItem } from "@/types/content";

export function ProjectResult({ project }: { project: ProjectItem }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#FF5722]">Kết quả</p>
      <h2 className="mt-3 text-3xl font-semibold text-slate-900">Lợi ích sau triển khai</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {project.materials.map((material) => (
          <div key={material} className="rounded-2xl bg-white p-4 text-sm font-medium text-slate-700 shadow-sm">
            {material}
          </div>
        ))}
      </div>
    </div>
  );
}
