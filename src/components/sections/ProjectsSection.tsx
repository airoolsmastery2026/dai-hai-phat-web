import Image from "next/image";

const projects = [
  {
    title: "Tủ bếp Acrylic hiện đại",
    image: "/images/placeholder.png",
    category: "Nội thất",
  },
  {
    title: "Phòng ngủ MDF chống ẩm",
    image: "/images/placeholder.png",
    category: "Nội thất",
  },
  {
    title: "Tủ quần áo cánh kính",
    image: "/images/placeholder.png",
    category: "Nội thất",
  },
  {
    title: "Kệ TV phòng khách",
    image: "/images/placeholder.png",
    category: "Nội thất",
  },
  {
    title: "Mái che Polycarbonate",
    image: "/images/placeholder.png",
    category: "Cơ khí dân dụng",
  },
  {
    title: "Thi công cửa sắt",
    image: "/images/placeholder.png",
    category: "Cơ khí dân dụng",
  },
];

export function ProjectsSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">

        <div className="text-center mb-16">
          <span className="text-[#d6a449] font-semibold uppercase tracking-widest">
            Công trình tiêu biểu
          </span>

          <h2 className="text-4xl font-bold mt-4 text-gray-900">
            Dự án đã hoàn thành
          </h2>

          <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
            Hình ảnh thực tế các công trình nội thất và cơ khí dân dụng
            do Đại Hải Phát trực tiếp thiết kế, sản xuất và thi công.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {projects.map((item, index) => (

            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition"
            >

              <div className="relative h-72">

                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />

              </div>

              <div className="p-6">

                <span className="text-sm text-[#d6a449] font-semibold">
                  {item.category}
                </span>

                <h3 className="mt-2 text-xl font-bold">
                  {item.title}
                </h3>

              </div>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}

