import Image from "next/image";
import Link from "next/link";

import type { ProjectItem } from "@/types/content";

export function ProjectCard({ project }: { project: ProjectItem }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-56 overflow-hidden">
        <Image src={project.image} alt={project.title} width={900} height={224} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
      </div>
      <div className="p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#FF5722]">{project.category}</p>
        <h3 className="mt-3 text-xl font-semibold text-slate-900">{project.title}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">{project.summary}</p>
      </div>
    </Link>
  );
}
