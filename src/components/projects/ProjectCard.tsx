import Image from "next/image";
import Link from "next/link";

import type { ProjectItem } from "@/types/content";

export function ProjectCard({ project }: { project: ProjectItem }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-56 overflow-hidden">
        <Image src={project.image} alt={project.title} width={900} height={224} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-900">
          {project.category}
        </span>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-slate-900">{project.title}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">{project.summary}</p>
        <div className="mt-5 flex items-center justify-between text-sm font-semibold text-[#FF5722]">
          <span>Xem chi tiết</span>
          <span aria-hidden="true">→</span>
        </div>
      </div>
    </Link>
  );
}
