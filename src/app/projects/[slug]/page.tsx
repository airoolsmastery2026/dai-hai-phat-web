import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TopBar } from "@/components/layout/TopBar";
import { SiteNavigation } from "@/components/layout/SiteNavigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { FloatingCta } from "@/components/layout/FloatingCta";
import { BackToTop } from "@/components/layout/BackToTop";
import { Container } from "@/components/ui/Container";
import { ProjectHero } from "@/components/projects/ProjectHero";
import { ProjectBreadcrumb } from "@/components/projects/ProjectBreadcrumb";
import { ProjectChallenge } from "@/components/projects/ProjectChallenge";
import { ProjectSolution } from "@/components/projects/ProjectSolution";
import { ProjectTimeline } from "@/components/projects/ProjectTimeline";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { ProjectBeforeAfter } from "@/components/projects/ProjectBeforeAfter";
import { ProjectStats } from "@/components/projects/ProjectStats";
import { ProjectResult } from "@/components/projects/ProjectResult";
import { RelatedProjects } from "@/components/projects/RelatedProjects";
import { RelatedServices } from "@/components/projects/RelatedServices";
import { ProjectFAQ } from "@/components/projects/ProjectFAQ";
import { ProjectCTA } from "@/components/projects/ProjectCTA";
import { ProjectTechStack } from "@/components/projects/ProjectTechStack";
import { ProjectMaterials } from "@/components/projects/ProjectMaterials";
import { COMPANY_CONFIG } from "@/content/company";
import { PROJECTS } from "@/content/projects";
import { ServiceCTA } from "@/components/services/ServiceCTA";

export async function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((item) => item.slug === slug);

  if (!project) {
    return {};
  }

  return {
    title: project.title,
    description: project.seo?.description ?? project.summary,
    keywords: project.seo?.keywords,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.seo?.description ?? project.summary,
      url: `${COMPANY_CONFIG.websiteUrl}/projects/${project.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.seo?.description ?? project.summary,
    },
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = PROJECTS.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar />
      <SiteNavigation />
      <main>
      <ProjectHero project={project} />

      <section className="py-10">
        <Container>
          <ProjectBreadcrumb currentLabel={project.title} />
        </Container>
      </section>

      <section className="py-10">
        <Container>
          <div className="grid gap-10 xl:grid-cols-[1.4fr_0.8fr]">
            <div className="space-y-16">
              <div className="grid gap-10 lg:grid-cols-2">
                <ProjectChallenge project={project} />
                <ProjectSolution project={project} />
              </div>

              <div>
                <div className="mb-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#FF5722]">Project timeline</p>
                  <h2 className="mt-3 text-3xl font-semibold text-slate-900">Các giai đoạn thực hiện dự án</h2>
                </div>
                <ProjectTimeline workflow={project.workflow} />
              </div>

              <div>
                <div className="mb-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#FF5722]">Large masonry gallery</p>
                  <h2 className="mt-3 text-3xl font-semibold text-slate-900">Bộ sưu tập ảnh thực tế</h2>
                </div>
                <ProjectGallery images={project.gallery} title={project.title} />
              </div>

              <div>
                <div className="mb-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#FF5722]">Before / After comparison</p>
                  <h2 className="mt-3 text-3xl font-semibold text-slate-900">So sánh chuyển đổi không gian</h2>
                </div>
                <ProjectBeforeAfter beforeImages={project.beforeImages} afterImages={project.afterImages} title={project.title} />
              </div>

              <div>
                <div className="mb-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#FF5722]">Project statistics</p>
                  <h2 className="mt-3 text-3xl font-semibold text-slate-900">Các chỉ số thể hiện hiệu quả thực hiện</h2>
                </div>
                <ProjectStats stats={project.statistics} />
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <ProjectTechStack technologies={project.technologies} />
                <ProjectMaterials materials={project.materials} />
              </div>

              <ProjectResult project={project} />

              <div>
                <div className="mb-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#FF5722]">Related projects</p>
                  <h2 className="mt-3 text-3xl font-semibold text-slate-900">Một số công trình tương tự</h2>
                </div>
                <RelatedProjects currentSlug={project.slug} />
              </div>

              <div>
                <div className="mb-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#FF5722]">Dịch vụ liên quan</p>
                  <h2 className="mt-3 text-3xl font-semibold text-slate-900">Các dịch vụ có thể đi kèm</h2>
                </div>
                <RelatedServices />
              </div>

              <div id="faq">
                <div className="mb-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#FF5722]">FAQ</p>
                  <h2 className="mt-3 text-3xl font-semibold text-slate-900">Những câu hỏi thường gặp</h2>
                </div>
                <ProjectFAQ items={project.faq} />
              </div>
            </div>

            <aside className="self-start xl:sticky xl:top-24">
              <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-7 shadow-sm">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#FF5722]">Thông tin dự án</p>
                  <ul className="mt-4 space-y-3 text-sm text-slate-600">
                    <li><span className="font-semibold text-slate-900">Khách hàng:</span> {project.client}</li>
                    <li><span className="font-semibold text-slate-900">Địa điểm:</span> {project.location}</li>
                    <li><span className="font-semibold text-slate-900">Năm thực hiện:</span> {project.year}</li>
                    <li><span className="font-semibold text-slate-900">Loại hình:</span> {project.category}</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#FF5722]">Nhận xét</p>
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm leading-7 text-slate-600">“{project.testimonial.quote}”</p>
                    <p className="mt-4 font-semibold text-slate-900">{project.testimonial.author}</p>
                    <p className="text-sm text-slate-500">{project.testimonial.role}</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <ServiceCTA />
      <ProjectCTA />
      </main>
      <SiteFooter />
      <FloatingCta />
      <BackToTop />
    </div>
  );
}
