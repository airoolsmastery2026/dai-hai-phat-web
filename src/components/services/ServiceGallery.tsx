import Image from "next/image";

import { EmptyState } from "@/components/ui/EmptyState";

const INITIAL_IMAGE_COUNT = 4;

function GalleryImage({ image, title, index }: { image: string; title: string; index: number }) {
  return (
    <figure className="group overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={image}
          alt={`${title} — ảnh công trình ${index + 1}`}
          width={800}
          height={500}
          sizes="(max-width: 767px) 100vw, 50vw"
          className="h-full w-full object-cover transition-transform duration-[var(--duration-slow)] group-hover:scale-[1.02]"
        />
      </div>
    </figure>
  );
}

export function ServiceGallery({ images, title }: { images: string[]; title: string }) {
  if (!images.length) {
    return (
      <EmptyState
        title="Chưa có ảnh được xác minh"
        description="Thư viện chỉ hiển thị ảnh có nguồn và quyền sử dụng đã được xác minh."
      />
    );
  }

  const initialImages = images.slice(0, INITIAL_IMAGE_COUNT);
  const remainingImages = images.slice(INITIAL_IMAGE_COUNT);

  return (
    <div>
      <div className="grid gap-[var(--space-3)] md:grid-cols-2">
        {initialImages.map((image, index) => (
          <GalleryImage key={image} image={image} title={title} index={index} />
        ))}
      </div>

      {remainingImages.length ? (
        <details className="mt-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-3)]">
          <summary className="cursor-pointer text-sm font-bold text-[var(--color-primary)]">
            Xem thêm {remainingImages.length} ảnh
          </summary>
          <div className="mt-[var(--space-3)] grid gap-[var(--space-3)] md:grid-cols-2">
            {remainingImages.map((image, index) => (
              <GalleryImage
                key={image}
                image={image}
                title={title}
                index={index + INITIAL_IMAGE_COUNT}
              />
            ))}
          </div>
        </details>
      ) : null}
    </div>
  );
}
