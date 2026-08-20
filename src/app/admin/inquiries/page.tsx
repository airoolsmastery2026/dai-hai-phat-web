import type { Metadata } from "next";
import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { listAdminProjectInquiries } from "@/lib/server/admin-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Yêu cầu khách hàng | Đại Hải Phát",
  robots: { index: false, follow: false, noarchive: true },
};

const STATUS_LABELS: Record<string, string> = {
  new: "Mới",
  contacted: "Đã liên hệ",
  qualified: "Đã xác định nhu cầu",
  closed: "Đã đóng",
};

export default async function AdminInquiriesPage() {
  const result = await listAdminProjectInquiries();

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
            Yêu cầu khách hàng
          </h1>
          <p className="mt-[var(--space-3)] text-[var(--color-text-muted)]">
            Dữ liệu được đọc từ kho project_inquiries hiện hữu. Trang này không tạo bảng inquiry mới và không ghi dữ liệu trực tiếp từ trình duyệt.
          </p>
        </header>

        {!result.ok ? (
          <div
            role="alert"
            className="rounded-[var(--radius-lg)] border border-[var(--color-danger)] bg-[var(--color-danger-soft)] p-[var(--space-card)] text-[var(--color-danger-text)]"
          >
            {result.message}
          </div>
        ) : result.inquiries.length === 0 ? (
          <Card className="p-[var(--space-card-lg)]">
            <h2 className="font-bold text-[var(--color-text)]">Chưa có hồ sơ</h2>
            <p className="mt-[var(--space-2)] text-sm text-[var(--color-text-muted)]">
              Không có yêu cầu khách hàng nào trong kho tiếp nhận hiện tại.
            </p>
          </Card>
        ) : (
          <div className="grid gap-[var(--space-4)]">
            {result.inquiries.map((inquiry) => (
              <Card key={inquiry.id} className="p-[var(--space-card-lg)]">
                <div className="flex flex-col gap-[var(--space-4)] lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-[var(--space-2)]">
                      <h2 className="font-bold text-[var(--color-text)]">
                        {inquiry.full_name}
                      </h2>
                      <span className="rounded-[var(--radius-full)] bg-[var(--color-primary-soft)] px-[var(--space-2)] py-[var(--space-1)] text-xs font-bold text-[var(--color-primary-soft-text)]">
                        {STATUS_LABELS[inquiry.status] ?? inquiry.status}
                      </span>
                    </div>
                    <p className="mt-[var(--space-2)] text-sm text-[var(--color-text-muted)]">
                      {inquiry.service} · {inquiry.project_area}
                    </p>
                    <dl className="mt-[var(--space-4)] grid gap-[var(--space-3)] text-sm sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <dt className="font-bold text-[var(--color-text-subtle)]">Điện thoại</dt>
                        <dd className="text-[var(--color-text)]">{inquiry.phone}</dd>
                      </div>
                      <div>
                        <dt className="font-bold text-[var(--color-text-subtle)]">Ngân sách</dt>
                        <dd className="text-[var(--color-text)]">{inquiry.budget || "Chưa có"}</dd>
                      </div>
                      <div>
                        <dt className="font-bold text-[var(--color-text-subtle)]">Tiến độ</dt>
                        <dd className="text-[var(--color-text)]">{inquiry.timeline || "Chưa có"}</dd>
                      </div>
                      <div>
                        <dt className="font-bold text-[var(--color-text-subtle)]">Tiếp nhận</dt>
                        <dd className="text-[var(--color-text)]">
                          {new Intl.DateTimeFormat("vi-VN", {
                            dateStyle: "short",
                            timeStyle: "short",
                            timeZone: "Asia/Ho_Chi_Minh",
                          }).format(new Date(inquiry.created_at))}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
