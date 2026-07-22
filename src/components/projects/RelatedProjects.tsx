import Image from "next/image";
import Link from "next/link";

import { PROJECTS } from "@/content/projects";

export function RelatedProjects({ currentSlug }: { currentSlug: string }) {
  const related = PROJECTS.filter((project) => project.slug !== currentSlug).slice(0, 2);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {related.map((project) => (
        <Link key={project.slug} href={`/projects/${project.slug}`} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <Image src={project.image} alt={project.title} width={900} height={320} className="h-48 w-full object-cover" loading="lazy" />
          <div className="p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#FF5722]">{project.category}</p>
            <h3 className="mt-3 text-lg font-semibold text-slate-900">{project.title}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
}
