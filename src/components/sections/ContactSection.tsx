export function ContactSection() {
  return (
    <section
      id="contact"
      className="bg-slate-900 py-24 text-white"
    >
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2">

        <div>

          <span className="text-sm font-semibold uppercase tracking-[4px] text-orange-400">
            Liên hệ
          </span>

          <h2 className="mt-5 text-4xl font-bold leading-tight">
            Nhận tư vấn và báo giá miễn phí
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-300">
            Đại Hải Phát nhận khảo sát tận nơi, tư vấn giải pháp,
            thiết kế và báo giá hoàn toàn miễn phí.
          </p>

          <div className="mt-10 space-y-6">

            <div>
              <div className="text-orange-400 font-semibold">
                Hotline
              </div>

              <div className="text-2xl font-bold">
                09xx xxx xxx
              </div>
            </div>

            <div>
              <div className="text-orange-400 font-semibold">
                Email
              </div>

              <div>
                contact@daihaiphat.vn
              </div>
            </div>

            <div>
              <div className="text-orange-400 font-semibold">
                Địa chỉ
              </div>

              <div>
                TP. Hồ Chí Minh
              </div>
            </div>

          </div>

        </div>

        <form className="rounded-2xl bg-white p-8 text-slate-900 shadow-2xl">

          <h3 className="text-2xl font-bold">
            Gửi yêu cầu
          </h3>

          <div className="mt-8 space-y-5">

            <input
              className="w-full rounded-xl border p-4"
              placeholder="Họ và tên"
            />

            <input
              className="w-full rounded-xl border p-4"
              placeholder="Số điện thoại"
            />

            <input
              className="w-full rounded-xl border p-4"
              placeholder="Email"
            />

            <textarea
              rows={5}
              className="w-full rounded-xl border p-4"
              placeholder="Nội dung cần tư vấn"
            />

            <button
              className="w-full rounded-xl bg-orange-500 py-4 font-bold text-white transition hover:bg-orange-600"
            >
              GỬI YÊU CẦU
            </button>

          </div>

        </form>

      </div>
    </section>
  );
}
