import { ProjectCard } from "@/components/projects/ProjectCard";
import type { ProjectItem } from "@/types/content";

export function ProjectGrid({ projects }: { projects: ProjectItem[] }) {
  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  );
}
