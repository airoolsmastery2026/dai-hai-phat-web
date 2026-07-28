import Link from "next/link";

export default function NotFound() {
  return (
    <main
      className="flex min-h-[60vh] flex-col items-center justify-center bg-[var(--color-background)] px-[var(--space-6)] py-[var(--space-section)] text-center"
      role="main"
    >
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
        Lỗi 404
      </p>
      <h1 className="mt-[var(--space-3)] text-4xl font-bold text-[var(--color-text)]">
        Không tìm thấy trang
      </h1>
      <p className="mt-[var(--space-3)] text-[var(--color-text-muted)]">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
      </p>
      <Link
        href="/"
        className="mt-[var(--space-6)] inline-flex min-h-[var(--control-min-size)] items-center rounded-[var(--radius-md)] bg-[var(--color-primary)] px-[var(--space-6)] py-[var(--space-3)] font-semibold text-white transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-primary-hover)]"
      >
        Quay về trang chủ
      </Link>
    </main>
  );
}
