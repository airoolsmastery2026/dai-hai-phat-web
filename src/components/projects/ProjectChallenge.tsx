import type { ProjectItem } from "@/types/content";

export function ProjectChallenge({ project }: { project: ProjectItem }) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--color-primary)]">Thách thức</p>
      <h2 className="mt-3 text-3xl font-semibold text-slate-900">Vấn đề cần giải quyết</h2>
      <p className="mt-5 text-base leading-8 text-slate-600">{project.challenge}</p>
    </div>
  );
}
