import type { Metadata } from "next";
import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { UNVERIFIED_PROJECT_DRAFTS } from "@/content/projects";

export const metadata: Metadata = {
  title: "Kiểm tra dự án | Đại Hải Phát",
  robots: { index: false, follow: false, noarchive: true },
};

export default function AdminProjectsPage() {
  const projects = UNVERIFIED_PROJECT_DRAFTS.items;

  return (
    <main className="min-h-screen bg-[var(--color-background)] px-[var(--space-container)] py-[var(--space-10)] sm:px-[var(--space-container-sm)] lg:px-[var(--space-container-lg)]">
      <div className="mx-auto max-w-[var(--container-max)]">
        <div className="mb-[var(--space-6)]">
          <Link
            href="/admin"
            className="text-sm font-bold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
          >
            ← Trung tâm quản trị
          </Link>
        </div>

        <header className="mb-[var(--space-8)] max-w-[var(--content-max)]">
          <h1 className="text-[length:var(--font-h1)] font-extrabold leading-tight tracking-[-0.03em] text-[var(--color-text)]">
            Dự án / Gallery
          </h1>
          <p className="mt-[var(--space-3)] text-[var(--color-text-muted)]">
            Đây là hàng chờ kiểm tra của các hồ sơ dự án chưa xác minh. Scaffold không được phép biến bản nháp thành nội dung công khai chỉ bằng một nút “Đăng”.
          </p>
        </header>

        <div
          role="status"
          className="mb-[var(--space-6)] rounded-[var(--radius-lg)] border border-[var(--color-warning)] bg-[var(--color-warning-soft)] p-[var(--space-card)] text-[var(--color-warning)]"
        >
          Xuất bản đang bị khóa cho đến khi hồ sơ có nguồn, quyền sử dụng media và thông tin dự án được xác minh theo truth gate của repo.
        </div>

        {projects.length === 0 ? (
          <Card className="p-[var(--space-card-lg)]">
            <h2 className="font-bold text-[var(--color-text)]">Không có bản nháp</h2>
            <p className="mt-[var(--space-2)] text-sm text-[var(--color-text-muted)]">
              Hiện không có hồ sơ dự án nào đang chờ xác minh.
            </p>
          </Card>
        ) : (
          <div className="grid gap-[var(--space-4)] md:grid-cols-2">
            {projects.map((project) => (
              <Card key={project.slug} className="p-[var(--space-card-lg)]">
                <div className="mb-[var(--space-3)] flex flex-wrap items-center gap-[var(--space-2)]">
                  <span className="rounded-[var(--radius-full)] bg-[var(--color-warning-soft)] px-[var(--space-2)] py-[var(--space-1)] text-xs font-bold text-[var(--color-warning)]">
                    Chưa xác minh
                  </span>
                  <span className="text-xs font-bold text-[var(--color-text-subtle)]">
                    {project.category}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-[var(--color-text)]">
                  {project.title}
                </h2>
                <p className="mt-[var(--space-2)] text-sm text-[var(--color-text-muted)]">
                  {project.location} · {project.year}
                </p>
                <p className="mt-[var(--space-4)] text-sm text-[var(--color-text-muted)]">
                  {project.summary}
                </p>
                <p className="mt-[var(--space-4)] text-xs font-bold text-[var(--color-text-subtle)]">
                  Slug: {project.slug}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
