import type { ProjectItem } from "@/types/content";

export function ProjectStats({ stats }: { stats: ProjectItem["statistics"] }) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
          <p className="mt-2 text-sm text-slate-600">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
