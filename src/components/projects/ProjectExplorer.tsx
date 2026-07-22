"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

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
      <div className="mb-8 grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-[1.3fr_0.8fr]">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          <span>Tìm kiếm dự án</span>
          <input
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Tên dự án, khách hàng, vị trí..."
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none ring-0 focus:border-[#FF5722]"
            aria-label="Tìm kiếm dự án"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          <span>Loại dự án</span>
          <select
            value={category}
            onChange={(event) => handleCategoryChange(event.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#FF5722]"
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

      {pagedProjects.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-slate-600">
          Không tìm thấy dự án phù hợp với bộ lọc hiện tại.
        </div>
      ) : (
        <motion.div layout className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {pagedProjects.map((project, index) => (
            <motion.div key={project.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: index * 0.05 }}>
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {totalPages > 1 ? (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-[#FF5722] hover:text-[#FF5722]"
            disabled={safePage === 1}
          >
            Trước
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => setPage(pageNumber)}
              className={`rounded-full px-4 py-2 text-sm font-medium ${safePage === pageNumber ? "bg-[#FF5722] text-white" : "border border-slate-200 text-slate-700 hover:border-[#FF5722] hover:text-[#FF5722]"}`}
            >
              {pageNumber}
            </button>
          ))}
          <button
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-[#FF5722] hover:text-[#FF5722]"
            disabled={safePage === totalPages}
          >
            Sau
          </button>
        </div>
      ) : null}
    </div>
  );
}
