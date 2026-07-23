import Image from "next/image";

export function HeroSection() {}
  return (
    <section className="relative min-h-screen overflow-hidden">

      <Image
        src="/images/hero-factory.jpg"
        alt="Đại Hải Phát"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6">

        <div className="max-w-3xl">

          <span className="rounded-full bg-orange-500 px-4 py-2 text-sm font-bold uppercase tracking-[0.2em] text-white">
            Nội thất • Cơ khí dân dụng
          </span>

          <h1 className="mt-8 text-5xl font-black uppercase leading-tight text-white md:text-7xl">
            Đại Hải Phát
          </h1>

          <h2 className="mt-4 text-2xl font-semibold text-orange-400 md:text-3xl">
            Thiết kế • Gia công • Thi công trọn gói
          </h2>

          <p className="mt-8 max-w-2xl text-xl leading-9 text-gray-200">
            Chuyên thi công nội thất theo yêu cầu, tủ bếp,
            phòng ngủ, tủ quần áo, kệ TV cùng các hạng mục
            cơ khí dân dụng như mái che, cầu thang, lan can,
            cổng sắt và sản phẩm gia công theo yêu cầu.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">

            <a
              href="#contact"
              className="rounded-xl bg-orange-500 px-8 py-4 font-bold uppercase text-white transition hover:bg-orange-600"
            >
              Nhận báo giá
            </a>

            <a
              href="#projects"
              className="rounded-xl border border-white px-8 py-4 font-bold uppercase text-white transition hover:bg-white hover:text-black"
            >
              Xem công trình
            </a>

          </div>

          <div className="mt-20 grid grid-cols-3 gap-8">

            <div>
              <div className="text-5xl font-black text-orange-500">
                10+
              </div>

              <p className="mt-2 text-sm uppercase tracking-widest text-white">
                Năm kinh nghiệm
              </p>
            </div>

            <div>
              <div className="text-5xl font-black text-orange-500">
                300+
              </div>

              <p className="mt-2 text-sm uppercase tracking-widest text-white">
                Công trình
              </p>
            </div>

            <div>
              <div className="text-5xl font-black text-orange-500">
                100%
              </div>

              <p className="mt-2 text-sm uppercase tracking-widest text-white">
                Tận tâm
              </p>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
