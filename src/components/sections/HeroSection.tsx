import Image from "next/image";

export function HeroSection() {
  return (
    <section className="overflow-hidden bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-8">
          <span className="inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            Nội thất & cơ khí dân dụng
          </span>

          <h1 className="max-w-3xl text-5xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-6xl">
            Thiết kế và thi công nội thất, mái che và kết cấu thép theo yêu cầu
          </h1>

          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            Đại Hải Phát cung cấp giải pháp trọn gói từ khảo sát, thiết kế, gia công đến lắp đặt, đảm bảo chất lượng bền vững và tiến độ chính xác.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-8 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Nhận báo giá
            </a>
            <a
              href="#projects"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-8 py-4 text-sm font-semibold text-slate-900 transition hover:border-slate-300"
            >
              Xem công trình
            </a>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg">
          <div className="relative aspect-[4/5] w-full sm:aspect-[16/12] lg:aspect-[4/5]">
            <Image
              src="/images/placeholder.png"
              alt="Xưởng sản xuất Đại Hải Phát"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl justify-center px-6 pb-12">
        <a href="#projects" className="inline-flex items-center gap-3 text-sm font-semibold text-slate-600 transition hover:text-slate-900">
          <span className="h-3 w-3 rounded-full bg-slate-900 animate-bounce" />
          Kéo xuống để khám phá
        </a>
      </div>
    </section>
  );
}

