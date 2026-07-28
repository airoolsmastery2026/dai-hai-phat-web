"use client";

import { Filter, RefreshCw, Search } from "lucide-react";
import Image from "next/image";
import {
  useCallback,
  useEffect,
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

export function VerifiedGallery({
  initialGallery,
}: {
  initialGallery: VerifiedGalleryResponse;
}) {
  const [gallery, setGallery] = useState(initialGallery);
  const [activeQuery, setActiveQuery] = useState("limit=12");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !gallery.nextCursor) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { rootMargin: "240px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [gallery.nextCursor, loadMore]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loadingRef.current) return;

    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams({ limit: "12" });

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
    const query = "limit=12";
    setActiveQuery(query);
    void loadGallery(query, false);
  };

  return (
    <>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-card)] shadow-[var(--shadow-sm)] sm:p-[var(--space-card-lg)]"
        aria-label="Bộ lọc thư viện công trình"
      >
        <div className="grid gap-[var(--space-stack)] lg:grid-cols-[2fr_1fr_1fr]">
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
                placeholder="Ví dụ: phòng ngủ, cửa cổng, mái che"
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

        <div className="mt-[var(--space-stack)] grid gap-[var(--space-stack)] sm:grid-cols-2 lg:grid-cols-3">
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

        <div className="mt-[var(--space-stack)] grid gap-[var(--space-control)] sm:grid-cols-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex min-h-[var(--control-min-size)] items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] bg-[var(--color-primary)] px-[var(--space-stack)] font-bold text-white transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-primary-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
          >
            <Filter className="h-4 w-4" aria-hidden="true" />
            {isLoading ? "Đang đối chiếu công trình…" : "Lọc công trình"}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={resetFilters}
            className="min-h-[var(--control-min-size)] rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-[var(--space-stack)] font-semibold text-[var(--color-text-muted)] transition-colors duration-[var(--duration-fast)] hover:border-[var(--color-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] disabled:cursor-wait disabled:opacity-70"
          >
            Xóa bộ lọc
          </button>
        </div>
      </form>

      <div className="mt-[var(--space-card-lg)] flex items-end justify-between gap-[var(--space-stack)]">
        <div aria-live="polite">
          <p className="text-sm font-semibold text-[var(--color-primary)]">
            {gallery.total} ảnh có metadata xác minh
          </p>
          <h2 className="mt-[var(--space-2)] text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
            Công trình phù hợp
          </h2>
        </div>
        <p className="hidden text-sm text-[var(--color-text-subtle)] sm:block">
          Đang hiển thị {gallery.items.length}/{gallery.total}
        </p>
      </div>

      {isLoading ? (
        <p
          role="status"
          className="mt-[var(--space-control)] text-sm font-semibold text-[var(--color-text-muted)]"
        >
          Đang đối chiếu metadata và tải ảnh phù hợp…
        </p>
      ) : null}

      {error ? (
        <Alert
          tone="error"
          title="Không thể cập nhật thư viện"
          className="mt-[var(--space-stack)]"
        >
          <p>{error}</p>
          <button
            type="button"
            onClick={() => void loadGallery(activeQuery, false)}
            className="mt-[var(--space-stack)] flex min-h-[var(--control-min-size)] items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--color-danger)] px-[var(--space-stack)] font-semibold"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Tải lại
          </button>
        </Alert>
      ) : null}

      {gallery.items.length ? (
        <div className="mt-[var(--space-stack)] grid gap-[var(--space-stack)] sm:grid-cols-2 lg:grid-cols-3">
          {gallery.items.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-surface-muted)]">
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
              <div className="p-[var(--space-card)]">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-primary)]">
                  {item.service || item.category}
                </p>
                <h3 className="mt-[var(--space-2)] text-lg font-bold text-[var(--color-text)]">
                  {item.title}
                </h3>
                <p className="mt-[var(--space-2)] line-clamp-2 text-sm leading-6 text-[var(--color-text-muted)]">
                  {item.caption}
                </p>
                <dl className="mt-[var(--space-control)] grid gap-[var(--space-1)] text-xs text-[var(--color-text-subtle)]">
                  {item.material ? (
                    <div>
                      <dt className="inline font-semibold text-[var(--color-text)]">Vật liệu: </dt>
                      <dd className="inline">{item.material}</dd>
                    </div>
                  ) : null}
                  {item.style ? (
                    <div>
                      <dt className="inline font-semibold text-[var(--color-text)]">Phong cách: </dt>
                      <dd className="inline">{item.style}</dd>
                    </div>
                  ) : null}
                </dl>
              </div>
            </article>
          ))}
        </div>
      ) : !isLoading ? (
        <EmptyState
          className="mt-[var(--space-stack)]"
          title="Chưa có công trình phù hợp"
          description="Thay đổi bộ lọc để đối chiếu nhóm công trình khác."
        />
      ) : null}

      <div ref={sentinelRef} className="mt-[var(--space-card-lg)] text-center">
        {gallery.nextCursor ? (
          <button
            type="button"
            onClick={loadMore}
            disabled={isLoading}
            className="min-h-[var(--control-min-size)] rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-[var(--space-card-lg)] font-bold text-[var(--color-text)] transition-colors duration-[var(--duration-fast)] hover:border-[var(--color-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] disabled:cursor-wait disabled:opacity-70"
          >
            {isLoading ? "Đang nạp công trình đã xác minh…" : "Xem thêm công trình"}
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
