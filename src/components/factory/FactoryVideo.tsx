import { Play } from "lucide-react";

export function FactoryVideo() {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-8 shadow-sm md:p-10 text-white">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-300">Video Ready</p>
      <h2 className="mt-4 text-3xl font-semibold">Nhà máy trong hành động</h2>
      <p className="mt-3 max-w-2xl text-base text-slate-300">Xem quy trình sản xuất, gia công CNC, hàn robot và kiểm tra chất lượng tại nhà máy Đại Hải Phát.</p>

      <div className="mt-10 overflow-hidden rounded-2xl bg-black/30 backdrop-blur-sm border border-white/10">
        <div className="aspect-video flex items-center justify-center bg-slate-950">
          <button className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FF5722] text-white transition hover:scale-110 hover:bg-orange-600 shadow-2xl">
            <Play className="h-8 w-8 fill-current" />
          </button>
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-400">Video tour nhà máy 5,000 m² - Từ thiết kế đến bàn giao sản phẩm</p>
    </section>
  );
}
