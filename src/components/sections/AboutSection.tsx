import { CheckCircle2 } from "lucide-react";

const features = [
  "Xưởng sản xuất trực tiếp - không qua trung gian",
  "Thiết kế theo yêu cầu, tối ưu công năng",
  "Vật liệu chính hãng, nguồn gốc rõ ràng",
  "Báo giá minh bạch trước khi thi công",
  "Đội ngũ thi công nhiều năm kinh nghiệm",
  "Bảo hành và hỗ trợ sau bàn giao",
];

export function AboutSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          <div>

            <span className="uppercase tracking-[4px] text-[var(--color-primary)] font-semibold">
              Về Đại Hải Phát
            </span>

            <h2 className="text-4xl font-bold mt-5 text-gray-900 leading-tight">
              Thiết kế • Sản xuất • Thi công
              <br />
              Nội thất & Cơ khí dân dụng
            </h2>

            <p className="mt-6 text-gray-600 leading-8">
              Đại Hải Phát chuyên thiết kế, sản xuất và thi công nội thất
              nhà phố, căn hộ, biệt thự, văn phòng, cửa hàng cùng các hạng
              mục cơ khí dân dụng như cửa sắt, mái che, lan can, cầu thang,
              hàng rào và các sản phẩm theo yêu cầu.
            </p>

            <p className="mt-6 text-gray-600 leading-8">
              Chúng tôi sở hữu xưởng sản xuất riêng, trực tiếp thi công,
              kiểm soát chất lượng từ bản vẽ đến khi hoàn thiện công trình.
            </p>

          </div>

          <div className="grid gap-5">

            {features.map((item) => (

              <div
                key={item}
                className="flex items-start gap-4 p-5 rounded-xl bg-gray-50 hover:bg-[var(--color-primary-soft)] transition"
              >

                <CheckCircle2
                  className="text-[var(--color-primary)] mt-1"
                  size={22}
                />

                <span className="text-gray-700 leading-7">
                  {item}
                </span>

              </div>

            ))}

          </div>

        </div>

      </div>
    </section>
  );
}
