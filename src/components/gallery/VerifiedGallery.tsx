"use client";

import { Filter, RefreshCw, Search } from "lucide-react";
import Image from "next/image";
import {
  useCallback,
  useRef,
  useState,
  type FormEvent,
} from "react";

import { Alert } from "@/components/ui/Alert";
import { EmptyState } from "@/components/ui/EmptyState";
import type { VerifiedGalleryResponse } from "@/lib/ai/catalog";

interface GalleryApiResponse {
  gallery?: VerifiedGalleryResponse;
  error?: string;
}

const PAGE_SIZE = "6";

export function VerifiedGallery({
  initialGallery,
}: {
  initialGallery: VerifiedGalleryResponse;
}) {
  const [gallery, setGallery] = useState(initialGallery);
  const [activeQuery, setActiveQuery] = useState(`limit=${PAGE_SIZE}`);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const loadingRef = useRef(false);

  const loadGallery = useCallback(async (query: string, append: boolean) => {
    if (loadingRef.current) return;

    loadingRef.current = true;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/gallery?${query}`, {
        credentials: "same-origin",
        cache: "no-store",
      });
      const payload = (await response.json()) as GalleryApiResponse;
      if (!response.ok || !payload.gallery) {
        throw new Error(payload.error || "Không thể tải thư viện công trình.");
      }
      const nextGallery = payload.gallery;

      setGallery((current) =>
        append
          ? {
              ...nextGallery,
              items: [...current.items, ...nextGallery.items],
            }
          : nextGallery,
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Không thể tải thư viện công trình.",
      );
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (!gallery.nextCursor || isLoading) return;
    const params = new URLSearchParams(activeQuery);
    params.set("cursor", gallery.nextCursor);
    void loadGallery(params.toString(), true);
  }, [activeQuery, gallery.nextCursor, isLoading, loadGallery]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loadingRef.current) return;

    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams({ limit: PAGE_SIZE });

    ["search", "service", "category", "material", "style", "projectType"].forEach(
      (field) => {
        const value = String(form.get(field) ?? "").trim();
        if (value) params.set(field, value);
      },
    );

    const query = params.toString();
    setActiveQuery(query);
    void loadGallery(query, false);
  };

  const resetFilters = () => {
    formRef.current?.reset();
    const query = `limit=${PAGE_SIZE}`;
    setActiveQuery(query);
    void loadGallery(query, false);
  };

  return (
    <>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-4)] shadow-[var(--shadow-sm)] sm:p-[var(--space-5)]"
        aria-label="Bộ lọc thư viện công trình"
      >
        <div className="grid gap-[var(--space-3)] lg:grid-cols-[2fr_1fr_1fr]">
          <label className="grid gap-[var(--space-2)] text-sm font-semibold text-[var(--color-text)]">
            Tìm công trình
            <span className="relative">
              <Search
                className="pointer-events-none absolute left-[var(--space-4)] top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-text-subtle)]"
                aria-hidden="true"
              />
              <input
                name="search"
                type="search"
                maxLength={120}
                placeholder="Phòng ngủ, cửa cổng, mái che…"
                className="min-h-[var(--control-min-size)] w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] py-[var(--space-3)] pl-[var(--space-12)] pr-[var(--space-4)] font-normal text-[var(--color-text)] outline-none focus:border-[var(--color-focus)] focus:ring-2 focus:ring-[var(--color-primary-soft)]"
              />
            </span>
          </label>
          <GallerySelect
            name="service"
            label="Hạng mục"
            options={gallery.filters.services}
          />
          <GallerySelect
            name="category"
            label="Danh mục"
            options={gallery.filters.categories}
          />
        </div>

        <details className="mt-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] px-[var(--space-3)] py-[var(--space-2)]">
          <summary className="cursor-pointer text-sm font-bold text-[var(--color-primary)]">
            Bộ lọc nâng cao
          </summary>
          <div className="mt-[var(--space-3)] grid gap-[var(--space-3)] sm:grid-cols-2 lg:grid-cols-3">
            <GallerySelect
              name="material"
              label="Vật liệu"
              options={gallery.filters.materials}
            />
            <GallerySelect
              name="style"
              label="Phong cách"
              options={gallery.filters.styles}
            />
            <GallerySelect
              name="projectType"
              label="Loại công trình"
              options={gallery.filters.projectTypes}
            />
          </div>
        </details>

        <div className="mt-[var(--space-3)] grid gap-[var(--space-2)] sm:grid-cols-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex min-h-[var(--control-min-size)] items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] bg-[var(--color-primary)] px-[var(--space-4)] font-bold text-white transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-primary-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
          >
            <Filter className="h-4 w-4" aria-hidden="true" />
            {isLoading ? "Đang lọc…" : "Lọc công trình"}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={resetFilters}
            className="min-h-[var(--control-min-size)] rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-[var(--space-4)] font-semibold text-[var(--color-text-muted)] transition-colors duration-[var(--duration-fast)] hover:border-[var(--color-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] disabled:cursor-wait disabled:opacity-70"
          >
            Xóa bộ lọc
          </button>
        </div>
      </form>

      <div className="mt-[var(--space-5)] flex items-end justify-between gap-[var(--space-3)]">
        <div aria-live="polite">
          <p className="text-sm font-semibold text-[var(--color-primary)]">
            {gallery.total} ảnh đã xác minh
          </p>
          <h2 className="mt-[var(--space-1)] text-xl font-bold text-[var(--color-text)] sm:text-2xl">
            Công trình phù hợp
          </h2>
        </div>
        <p className="hidden text-sm text-[var(--color-text-subtle)] sm:block">
          {gallery.items.length}/{gallery.total} ảnh
        </p>
      </div>

      {isLoading ? (
        <p
          role="status"
          className="mt-[var(--space-3)] text-sm font-semibold text-[var(--color-text-muted)]"
        >
          Đang tải ảnh phù hợp…
        </p>
      ) : null}

      {error ? (
        <Alert
          tone="error"
          title="Không thể cập nhật thư viện"
          className="mt-[var(--space-3)]"
        >
          <p>{error}</p>
          <button
            type="button"
            onClick={() => void loadGallery(activeQuery, false)}
            className="mt-[var(--space-3)] flex min-h-[var(--control-min-size)] items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--color-danger)] px-[var(--space-4)] font-semibold"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Tải lại
          </button>
        </Alert>
      ) : null}

      {gallery.items.length ? (
        <div className="mt-[var(--space-3)] grid gap-[var(--space-3)] sm:grid-cols-2 lg:grid-cols-3">
          {gallery.items.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-surface-muted)]">
                <Image
                  src={item.thumbnail.url}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  placeholder="blur"
                  blurDataURL={item.blurDataUrl}
                  className="object-cover transition-transform duration-[var(--duration-slow)] hover:scale-[1.02]"
                />
              </div>
              <div className="p-[var(--space-4)]">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-primary)]">
                  {item.service || item.category}
                </p>
                <h3 className="mt-[var(--space-2)] text-base font-bold leading-6 text-[var(--color-text)]">
                  {item.title}
                </h3>
                <p className="mt-[var(--space-1)] line-clamp-2 text-sm leading-6 text-[var(--color-text-muted)]">
                  {item.caption}
                </p>
                {item.material || item.style ? (
                  <p className="mt-[var(--space-2)] line-clamp-1 text-xs text-[var(--color-text-subtle)]">
                    {[item.material, item.style].filter(Boolean).join(" · ")}
                  </p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      ) : !isLoading ? (
        <EmptyState
          className="mt-[var(--space-3)]"
          title="Chưa có công trình phù hợp"
          description="Thay đổi bộ lọc để đối chiếu nhóm công trình khác."
        />
      ) : null}

      <div className="mt-[var(--space-5)] text-center">
        {gallery.nextCursor ? (
          <button
            type="button"
            onClick={loadMore}
            disabled={isLoading}
            className="min-h-[var(--control-min-size)] rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-[var(--space-5)] font-bold text-[var(--color-text)] transition-colors duration-[var(--duration-fast)] hover:border-[var(--color-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] disabled:cursor-wait disabled:opacity-70"
          >
            {isLoading ? "Đang nạp…" : "Xem thêm công trình"}
          </button>
        ) : gallery.items.length ? (
          <p className="text-sm text-[var(--color-text-subtle)]">
            Đã hiển thị toàn bộ kết quả phù hợp.
          </p>
        ) : null}
      </div>
    </>
  );
}

function GallerySelect({
  name,
  label,
  options,
}: {
  name: string;
  label: string;
  options: string[];
}) {
  return (
    <label className="grid gap-[var(--space-2)] text-sm font-semibold text-[var(--color-text)]">
      {label}
      <select
        name={name}
        className="min-h-[var(--control-min-size)] rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-[var(--space-4)] font-normal text-[var(--color-text)] outline-none focus:border-[var(--color-focus)] focus:ring-2 focus:ring-[var(--color-primary-soft)]"
      >
        <option value="">Tất cả</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
