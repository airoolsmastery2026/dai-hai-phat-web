import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { FEATURED_PROJECTS } from "@/content/projects";

export function ProjectsSection() {
  return (
    <section id="projects" className="border-b border-slate-200 bg-slate-50 py-20 lg:py-24">
      <Container>
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#FF5722]">Dự án</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
            Các công trình đã được triển khai thực tế, đúng tiến độ và có thể kiểm chứng tại hiện trường.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {FEATURED_PROJECTS.slice(0, 6).map((project) => (
            <article key={project.slug} className="overflow-hidden rounded-[16px] border border-slate-200 bg-white">
              <div className="relative h-56">
                <Image src={project.image} alt={project.title} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" />
              </div>
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#FF5722]">{project.category}</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">{project.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {project.location} • {project.year}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
