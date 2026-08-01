export function AIOfficeLoadingState() {
  return (
    <section
      id="ai-office"
      className="ai-office-light scroll-mt-16 border-y border-[var(--color-border)] bg-[var(--color-background)] py-[var(--space-section)] text-[var(--color-text-inverse)] lg:py-[var(--space-section-lg)]"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="mx-auto max-w-7xl px-[var(--space-container)] sm:px-[var(--space-container-sm)] lg:px-[var(--space-container-lg)]">
        <div className="max-w-3xl rounded-[var(--radius-xl)] border border-[var(--color-border-dark)] bg-[var(--color-surface-dark-soft)] p-[var(--space-card)] sm:p-[var(--space-card-lg)]">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
            Hồ sơ tư vấn kỹ thuật
          </p>
          <p className="mt-[var(--space-stack)] text-lg font-bold">
            Đang chuẩn bị trợ lý Đại Hải Phát…
          </p>
          <p className="mt-[var(--space-control)] text-sm leading-6 text-[var(--color-text-dark-muted)]">
            Khu vực tư vấn đang được tải riêng để trang chính hiển thị nhanh hơn.
          </p>
        </div>
      </div>
    </section>
  );
}
