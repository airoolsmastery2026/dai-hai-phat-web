import Image from "next/image";

const gallery = [
  "/images/placeholder.png",
  "/images/placeholder.png",
  "/images/placeholder.png",
  "/images/placeholder.png",
  "/images/placeholder.png",
  "/images/placeholder.png",
  "/images/placeholder.png",
  "/images/placeholder.png",
  "/images/placeholder.png",
  "/images/placeholder.png",
  "/images/placeholder.png",
  "/images/placeholder.png",
];

export default function GallerySection() {
  return (
    <section className="py-24 bg-[#fafafa]">

      <div className="container mx-auto px-6">

        <div className="text-center mb-16">

          <span className="uppercase tracking-[4px] text-[#d6a449] font-semibold">
            Hình ảnh thực tế
          </span>

          <h2 className="text-4xl font-bold mt-4">
            Công trình đã bàn giao
          </h2>

          <p className="mt-5 text-gray-600 max-w-3xl mx-auto">
            Toàn bộ hình ảnh là công trình thực tế do Đại Hải Phát trực tiếp
            thiết kế, sản xuất và thi công.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {gallery.map((img) => (

            <div
              key={img}
              className="overflow-hidden rounded-2xl shadow-lg group"
            >

              <div className="relative h-[320px]">

                <Image
                  src={img}
                  alt=""
                  fill
                  className="object-cover group-hover:scale-110 duration-500"
                />

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

