import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { RelatedProjectRef } from "@/types/content";

export function RelatedProjects({ projects }: { projects: RelatedProjectRef[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {projects.map((project) => (
        <Link
          key={project.slug}
          href={`/projects/${project.slug}`}
          className="group flex flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
        >
          <div className="relative overflow-hidden h-56">
            <Image
              src={project.image}
              alt={project.title}
              width={800}
              height={320}
              className="h-full w-full object-cover transition group-hover:scale-105"
            />
          </div>
          <div className="flex flex-1 flex-col justify-between p-6">
            <div>
              <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#FF5722]">
                {project.category}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-slate-900 group-hover:text-[#FF5722] transition">{project.title}</h3>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#FF5722]">
              Xem chi tiết
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
