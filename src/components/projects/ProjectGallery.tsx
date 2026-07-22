import Image from "next/image";

export function ProjectGallery({ images, title }: { images: string[]; title: string }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {images.map((image) => (
        <div key={image} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <Image src={image} alt={title} width={900} height={480} className="h-72 w-full object-cover" loading="lazy" />
        </div>
      ))}
    </div>
  );
}
