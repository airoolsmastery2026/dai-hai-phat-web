import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import type { ProjectItem } from "@/types/content";

export function ProjectHero({ project }: { project: ProjectItem }) {
  return (
    <section className="bg-slate-950 py-24 text-white">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-300">Dự án tiêu biểu</p>
            <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">{project.title}</h1>
            <p className="mt-4 text-lg text-slate-300">{project.category} • {project.location} • {project.year}</p>
            <p className="mt-6 text-base leading-8 text-slate-400">{project.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/contact">Yêu cầu tư vấn</Button>
              <Button href="#faq" variant="secondary">Xem FAQ</Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-white/10">
            <Image src={project.image} alt={project.title} width={900} height={600} className="h-[420px] w-full object-cover" loading="lazy" />
          </div>
        </div>
      </Container>
    </section>
  );
}
