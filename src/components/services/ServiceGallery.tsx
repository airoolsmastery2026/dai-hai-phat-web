import Image from "next/image";

import { EmptyState } from "@/components/ui/EmptyState";

export function ServiceGallery({ images, title }: { images: string[]; title: string }) {
  if (!images.length) {
    return (
      <EmptyState
        title="Chưa có ảnh được xác minh"
        description="Thư viện chỉ hiển thị ảnh có nguồn và quyền sử dụng đã được xác minh."
      />
    );
  }

  return (
    <div className="grid gap-[var(--space-6)] md:grid-cols-2">
      {images.map((image, index) => (
        <figure
          key={image}
          className="group overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]"
        >
          <div className="relative aspect-[5/3] overflow-hidden">
            <Image
              src={image}
              alt={`${title} — ảnh công trình ${index + 1}`}
              width={800}
              height={480}
              sizes="(max-width: 767px) 100vw, 50vw"
              className="h-full w-full object-cover transition-transform duration-[var(--duration-slow)] group-hover:scale-[1.03]"
            />
          </div>
        </figure>
      ))}
    </div>
  );
}
