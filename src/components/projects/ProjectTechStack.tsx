import { Cpu } from "lucide-react";

import type { ProjectItem } from "@/types/content";

export function ProjectTechStack({ technologies }: { technologies: ProjectItem["technologies"] }) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-[#FF5722]">
          <Cpu className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#FF5722]">Technology used</p>
          <h3 className="mt-1 text-2xl font-semibold text-slate-900">Công nghệ và quy trình triển khai</h3>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {technologies.map((item) => (
          <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
