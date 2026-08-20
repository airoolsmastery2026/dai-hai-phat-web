import type { Metadata } from "next";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Trung tâm quản trị | Đại Hải Phát AI OS",
  description: "Điểm vào thống nhất cho các công cụ quản trị nội bộ Đại Hải Phát.",
  robots: { index: false, follow: false, noarchive: true },
};

const ADMIN_SECTIONS = [
  {
    title: "Yêu cầu khách hàng",
    description: "Đọc hồ sơ tiếp nhận thật từ project_inquiries. Không tạo kho inquiry thứ hai.",
    href: "/admin/inquiries",
    status: "Nguồn dữ liệu thật",
    tone: "success" as const,
  },
  {
    title: "Dự án / Gallery",
    description: "Kiểm tra các hồ sơ dự án đang ở trạng thái chưa xác minh trước khi đưa vào quy trình xuất bản.",
    href: "/admin/projects",
    status: "Chỉ kiểm tra",
    tone: "warning" as const,
  },
  {
    title: "Bảng giá",
    description: "Cổng kiểm soát dữ liệu giá. Không cho phép xuất bản giá khi chưa có nguồn xác minh và ngày hiệu lực.",
    href: "/admin/pricing",
    status: "Khóa publish",
    tone: "warning" as const,
  },
  {
    title: "Đánh giá khách hàng",
    description: "Cổng kiểm soát consent và nguồn xác minh trước khi testimonial thật được phép xuất bản.",
    href: "/admin/reviews",
    status: "Khóa publish",
    tone: "warning" as const,
  },
  {
    title: "Hình ảnh & Video",
    description: "Tái sử dụng trình quản lý media/video hiện có thay vì tạo module Supabase song song.",
    href: "/admin/media",
    status: "Hoạt động",
    tone: "success" as const,
  },
  {
    title: "AI Control Plane",
    description: "Theo dõi và điều khiển năng lực AI nội bộ theo policy hiện hành của repo.",
    href: "/admin/ai",
    status: "Hoạt động",
    tone: "success" as const,
  },
  {
    title: "Publishing",
    description: "Quản lý hàng đợi và điều khiển xuất bản qua boundary đã có của hệ sinh thái.",
    href: "/admin/publishing",
    status: "Hoạt động",
    tone: "success" as const,
  },
  {
    title: "DHP Workspace",
    description: "Không gian tài liệu và tác vụ nội bộ dùng nguồn dữ liệu server-side hiện có.",
    href: "/admin/workspace",
    status: "Hoạt động",
    tone: "success" as const,
  },
] as const;

const STATUS_CLASS = {
  success:
    "bg-[var(--color-success-soft)] text-[var(--color-success)]",
  warning:
    "bg-[var(--color-warning-soft)] text-[var(--color-warning)]",
} as const;

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] px-[var(--space-container)] py-[var(--space-10)] sm:px-[var(--space-container-sm)] lg:px-[var(--space-container-lg)]">
      <div className="mx-auto max-w-[var(--container-max)]">
        <header className="mb-[var(--space-8)] max-w-[var(--content-max)]">
          <p className="mb-[var(--space-2)] text-sm font-bold uppercase tracking-[0.12em] text-[var(--color-metal-strong)]">
            Đại Hải Phát AI OS
          </p>
          <h1 className="text-[length:var(--font-h1)] font-extrabold leading-tight tracking-[-0.03em] text-[var(--color-text)]">
            Trung tâm quản trị
          </h1>
          <p className="mt-[var(--space-3)] text-[var(--color-text-muted)]">
            Scaffold admin đã được ghép vào kiến trúc hiện tại theo nguyên tắc một nguồn sự thật: giữ Basic Auth, Supabase server-only và các module quản trị đã có.
          </p>
        </header>

        <section aria-labelledby="admin-tools-title">
          <h2 id="admin-tools-title" className="sr-only">
            Công cụ quản trị
          </h2>
          <div className="grid gap-[var(--space-4)] md:grid-cols-2 xl:grid-cols-3">
            {ADMIN_SECTIONS.map((section) => (
              <Card key={section.href} className="flex h-full flex-col p-[var(--space-card-lg)]">
                <div className="mb-[var(--space-4)] flex items-start justify-between gap-[var(--space-3)]">
                  <h3 className="text-lg font-bold text-[var(--color-text)]">
                    {section.title}
                  </h3>
                  <span
                    className={`shrink-0 rounded-[var(--radius-full)] px-[var(--space-2)] py-[var(--space-1)] text-xs font-bold ${STATUS_CLASS[section.tone]}`}
                  >
                    {section.status}
                  </span>
                </div>
                <p className="mb-[var(--space-6)] flex-1 text-sm text-[var(--color-text-muted)]">
                  {section.description}
                </p>
                <Button href={section.href} variant="secondary" className="w-full sm:w-auto">
                  Mở module
                </Button>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
