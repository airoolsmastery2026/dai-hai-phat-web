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
        <h3 className="mt-[var(--space-4)] text-lg font-black text-[var(--color-text)]">Video đang được cập nhật</h3>
        <p className="mt-[var(--space-2)] text-sm leading-6 text-[var(--color-text-muted)]">
          Nội dung được đăng tải khi đủ điều kiện chia sẻ. Bạn có thể xem thư viện hình ảnh trong thời gian này.
        </p>
        <Link href="/gallery" className="mt-[var(--space-4)] inline-flex min-h-11 w-fit items-center gap-2 rounded-[var(--radius-md)] text-sm font-bold text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]">
          Mở thư viện <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
      <div className="relative min-h-56 sm:min-h-72 lg:min-h-full">
        <Image src="/images/factory/factory01.webp" alt="Xưởng và quá trình chuẩn bị thi công Đại Hải Phát" fill sizes="(max-width: 1023px) 100vw, 55vw" className="object-cover" />
      </div>
    </div>
  );
}

export function VideoShowcaseSection() {
  const videos = getPublishedVideoShowcaseItems(4);

  return (
    <section id="videos" className="border-b border-[var(--color-border)] bg-[var(--color-background)] py-[var(--space-8)] sm:py-[var(--space-10)] lg:py-[var(--space-12)]">
      <div className="mx-auto w-full max-w-[var(--container-max)] px-[var(--space-container)] sm:px-[var(--space-container-sm)] lg:px-[var(--space-container-lg)]">
        <div className="flex flex-col gap-[var(--space-2)] sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-primary)]">Video công trình</p>
            <h2 className="mt-[var(--space-2)] text-[length:var(--font-h2)] font-bold leading-tight text-[var(--color-text)]">Từ khảo sát đến hoàn thiện</h2>
            <p className="mt-[var(--space-2)] text-sm leading-6 text-[var(--color-text-muted)] sm:text-base">
              Một góc nhìn trực quan về quy trình và các hạng mục của Đại Hải Phát.
            </p>
          </div>
          <Link href="/gallery" className="inline-flex min-h-11 w-fit items-center gap-2 rounded-[var(--radius-md)] px-3 text-sm font-bold text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]">
            Thư viện <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        {videos.length > 0 ? (
          <div className="mt-[var(--space-5)] grid gap-[var(--space-4)] md:grid-cols-2 xl:grid-cols-3">
            {videos.map((video) => <VideoCard key={video.id} video={video} />)}
          </div>
        ) : <EmptyVideoShowcase />}
      </div>
    </section>
  );
}
