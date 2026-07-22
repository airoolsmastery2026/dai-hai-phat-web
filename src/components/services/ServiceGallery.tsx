import Image from "next/image";

export function ServiceGallery({ images, title }: { images: string[]; title: string }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {images.map((image) => (
        <div key={image} className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
          <div className="relative h-72 overflow-hidden">
            <Image
              src={image}
              alt={title}
              width={800}
              height={480}
              className="h-full w-full object-cover transition group-hover:scale-105 duration-500"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
