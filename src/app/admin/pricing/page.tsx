import type { Metadata } from "next";
import Link from "next/link";

import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Kiểm soát bảng giá | Đại Hải Phát",
  robots: { index: false, follow: false, noarchive: true },
};

export default function AdminPricingPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] px-[var(--space-container)] py-[var(--space-10)] sm:px-[var(--space-container-sm)] lg:px-[var(--space-container-lg)]">
      <div className="mx-auto max-w-[var(--container-max)]">
        <div className="mb-[var(--space-6)]">
          <Link href="/admin" className="text-sm font-bold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">
            ← Trung tâm quản trị
          </Link>
        </div>

        <header className="mb-[var(--space-8)] max-w-[var(--content-max)]">
          <h1 className="text-[length:var(--font-h1)] font-extrabold leading-tight tracking-[-0.03em] text-[var(--color-text)]">
            Bảng giá tham khảo
          </h1>
          <p className="mt-[var(--space-3)] text-[var(--color-text-muted)]">
            Route tương thích từ scaffold đã được giữ lại, nhưng CRUD và nút “Hiện” chưa được kích hoạt để không tạo nguồn giá thứ hai ngoài contract giá đã xác minh của website.
          </p>
        </header>

        <Card className="p-[var(--space-card-lg)]">
          <span className="inline-flex rounded-[var(--radius-full)] bg-[var(--color-warning-soft)] px-[var(--space-2)] py-[var(--space-1)] text-xs font-bold text-[var(--color-warning)]">
            Khóa publish
          </span>
          <h2 className="mt-[var(--space-4)] text-lg font-bold text-[var(--color-text)]">
            Chưa mở CMS giá
          </h2>
          <p className="mt-[var(--space-2)] max-w-[var(--content-max)] text-sm text-[var(--color-text-muted)]">
            Trước khi bật chỉnh sửa cần có migration dữ liệu, nguồn ngày giá, đơn vị, phạm vi áp dụng, confidence và cờ yêu cầu khảo sát. Scaffold gốc chưa đáp ứng đầy đủ các điều kiện này.
          </p>
        </Card>
      </div>
    </main>
  );
}
