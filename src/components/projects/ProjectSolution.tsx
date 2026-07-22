import type { ProjectItem } from "@/types/content";

export function ProjectSolution({ project }: { project: ProjectItem }) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#FF5722]">Giải pháp</p>
      <h2 className="mt-3 text-3xl font-semibold text-slate-900">Cách chúng tôi xử lý</h2>
      <p className="mt-5 text-base leading-8 text-slate-600">{project.solution}</p>
    </div>
  );
}
