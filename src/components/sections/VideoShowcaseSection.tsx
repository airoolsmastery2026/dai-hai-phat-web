import { ArrowRight, Clapperboard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { VideoCard } from "@/components/video/VideoCard";
import { getPublishedVideoShowcaseItems } from "@/data/video-showcase";

function EmptyVideoShowcase() {
  return (
    <div className="mt-[var(--space-5)] grid overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] lg:grid-cols-[0.9fr_1.1fr]">
      <div className="flex flex-col justify-center p-[var(--space-5)] sm:p-[var(--space-6)]">
        <span className="flex size-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
          <Clapperboard className="size-5" aria-hidden="true" />
        </span>
        <h3 className="mt-[var(--space-4)] text-lg font-black text-[var(--color-text)]">
          Video thực tế sẽ được bổ sung theo từng công trình
        </h3>
        <p className="mt-[var(--space-2)] text-sm leading-6 text-[var(--color-text-muted)]">
          Chỉ nội dung đã được phép chia sẻ mới xuất hiện tại đây. Trong lúc cập nhật, bạn có thể xem thư viện công trình đã hoàn thiện.
        </p>
        <Link
          href="/gallery"
          className="mt-[var(--space-4)] inline-flex min-h-11 w-fit items-center gap-2 rounded-[var(--radius-md)] text-sm font-bold text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
        >
          Xem công trình <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
      <div className="relative min-h-56 sm:min-h-72 lg:min-h-full">
        <Image
          src="/images/factory/factory01.webp"
          alt="Xưởng và quá trình chuẩn bị thi công Đại Hải Phát"
          fill
          sizes="(max-width: 1023px) 100vw, 55vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,47,49,0.22),transparent_65%)]" aria-hidden="true" />
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
          {["Khảo sát", "Gia công", "Hoàn thiện"].map((label) => (
            <span key={label} className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-[var(--color-text)] shadow-[var(--shadow-sm)] backdrop-blur-sm">
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function VideoShowcaseSection() {
  const videos = getPublishedVideoShowcaseItems(4);

  return (
    <section id="videos" className="border-b border-[var(--color-border)] bg-[var(--color-background)] py-[var(--space-8)] sm:py-[var(--space-10)] lg:py-[var(--space-12)]">
      <div className="mx-auto w-full max-w-[var(--container-max)] px-[var(--space-container)] sm:px-[var(--space-container-sm)] lg:px-[var(--space-container-lg)]">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-primary)]">Video công trình</p>
          <h2 className="mt-[var(--space-2)] text-[length:var(--font-h2)] font-bold leading-tight text-[var(--color-text)]">
            Xem cách Đại Hải Phát thực hiện ngoài thực tế
          </h2>
          <p className="mt-[var(--space-2)] text-sm leading-6 text-[var(--color-text-muted)] sm:text-base">
            Video ngắn về khảo sát, gia công và hoàn thiện để bạn hình dung rõ quy trình trước khi trao đổi.
          </p>
        </div>

        {videos.length > 0 ? (
          <div className="mt-[var(--space-5)] grid gap-[var(--space-4)] md:grid-cols-2 xl:grid-cols-3">
            {videos.map((video) => <VideoCard key={video.id} video={video} />)}
          </div>
        ) : (
          <EmptyVideoShowcase />
        )}
      </div>
    </section>
  );
}
