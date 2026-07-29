import Image from "next/image";

export function ProjectBeforeAfter({ beforeImages, afterImages, title }: { beforeImages: string[]; afterImages: string[]; title: string }) {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--color-primary)]">Trước khi</p>
        <div className="mt-4 grid gap-4">
          {beforeImages.map((image) => (
            <div key={image} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <Image src={image} alt={`${title} trước khi`} width={900} height={420} className="h-64 w-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--color-primary)]">Sau khi</p>
        <div className="mt-4 grid gap-4">
          {afterImages.map((image) => (
            <div key={image} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <Image src={image} alt={`${title} sau khi`} width={900} height={420} className="h-64 w-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
