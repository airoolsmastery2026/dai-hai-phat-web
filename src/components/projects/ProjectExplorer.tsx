"use client";

import { useMemo, useState } from "react";

import { ProjectCard } from "@/components/projects/ProjectCard";
import type { ProjectItem } from "@/types/content";

const ITEMS_PER_PAGE = 6;

export function ProjectExplorer({ projects }: { projects: ProjectItem[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tất cả");
  const [page, setPage] = useState(1);

  const categories = useMemo(() => ["Tất cả", ...Array.from(new Set(projects.map((project) => project.category)))], [projects]);

  const filteredProjects = useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesCategory = category === "Tất cả" || project.category === category;
      const matchesSearch =
        normalizedQuery.length === 0 ||
        [project.title, project.category, project.location, project.client, project.description]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });
  }, [category, projects, search]);

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pagedProjects = filteredProjects.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div>
      <div className="mb-8 rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-xl md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-300">Portfolio layout</p>
            <h3 className="mt-3 text-3xl font-semibold">Lọc theo loại hình và khám phá từng công trình</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">Tập hợp các dự án nội thất, composite và kết cấu thép với bố cục hiện đại, tối ưu trải nghiệm trên mọi thiết bị.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-200">
              <span>Tìm kiếm dự án</span>
              <input
                value={search}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder="Tên dự án, khách hàng..."
                className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-[var(--color-primary)]"
                aria-label="Tìm kiếm dự án"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-200">
              <span>Loại dự án</span>
              <select
                value={category}
                onChange={(event) => handleCategoryChange(event.target.value)}
                className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none focus:border-[var(--color-primary)]"
                aria-label="Lọc theo loại dự án"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      {pagedProjects.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-slate-600">
          Không tìm thấy dự án phù hợp với bộ lọc hiện tại.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {pagedProjects.map((project) => (
            <div key={project.slug}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 ? (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            disabled={safePage === 1}
          >
            Trước
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => setPage(pageNumber)}
              className={`rounded-full px-4 py-2 text-sm font-medium ${safePage === pageNumber ? "bg-[var(--color-primary)] text-white" : "border border-slate-200 text-slate-700 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"}`}
            >
              {pageNumber}
            </button>
          ))}
          <button
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            disabled={safePage === totalPages}
          >
            Sau
          </button>
        </div>
      ) : null}
    </div>
  );
}
