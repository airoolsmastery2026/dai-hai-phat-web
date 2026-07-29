import Image from "next/image";

const gallery = [
  { src: "/images/interior/interior78.webp", alt: "Phòng ngủ với tủ áo cánh kính" },
  { src: "/images/interior/interior07.webp", alt: "Giường ngủ tích hợp hệ tủ" },
  { src: "/images/interior/interior10.webp", alt: "Vách tivi ốp đá và lam gỗ" },
  { src: "/images/interior/interior16.webp", alt: "Vách ốp trang trí hành lang" },
  { src: "/images/canopies/canopy03.webp", alt: "Mái che khung kim loại dọc hành lang" },
  { src: "/images/gates/gate01.webp", alt: "Cổng hai cánh hoa văn CNC" },
  { src: "/images/stairs/stair01.webp", alt: "Cầu thang kính tay vịn gỗ" },
  { src: "/images/railings/railing01.webp", alt: "Lan can ban công hoa văn CNC" },
  { src: "/images/stairs/stair02.webp", alt: "Cầu thang dân dụng kết hợp kim loại và gỗ" },
  { src: "/images/interior/interior02.webp", alt: "Tủ bếp chữ L tông sáng" },
  { src: "/images/interior/interior03.webp", alt: "Tủ áo kết hợp kệ trưng bày" },
  { src: "/images/interior/interior71.webp", alt: "Vách lam gỗ trang trí" },
];

export default function GallerySection() {
  return (
    <section className="py-24 bg-[var(--color-surface-muted)]">

      <div className="container mx-auto px-6">

        <div className="text-center mb-16">

          <span className="uppercase tracking-[4px] text-[var(--color-primary)] font-semibold">
            Hình ảnh thực tế
          </span>

          <h2 className="text-4xl font-bold mt-4">
            Công trình đã bàn giao
          </h2>

          <p className="mt-5 text-gray-600 max-w-3xl mx-auto">
            Hình ảnh trong thư viện đã được kiểm tra nguồn và quyền sử dụng
            trước khi đưa vào nội dung tư vấn.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {gallery.map((image) => (

            <div
              key={image.src}
              className="overflow-hidden rounded-2xl shadow-lg group"
            >

              <div className="relative h-[320px]">

                <Image
                  src={image.src}
                  alt={image.alt}
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
