import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-black text-white">

      <div className="mx-auto max-w-7xl px-6 py-20">

        <div className="grid gap-12 lg:grid-cols-4">

          <div>

            <h3 className="text-2xl font-black uppercase">
              ĐẠI HẢI PHÁT
            </h3>

            <p className="mt-6 leading-8 text-gray-400">
              Chuyên thiết kế, sản xuất và thi công
              Nội thất & Cơ khí dân dụng theo yêu cầu.
            </p>

          </div>

          <div>

            <h4 className="font-bold uppercase">
              Nội thất
            </h4>

            <ul className="mt-6 space-y-3 text-gray-400">

              <li>Tủ bếp</li>

              <li>Phòng ngủ</li>

              <li>Tủ quần áo</li>

              <li>Kệ TV</li>

            </ul>

          </div>

          <div>

            <h4 className="font-bold uppercase">
              Cơ khí dân dụng
            </h4>

            <ul className="mt-6 space-y-3 text-gray-400">

              <li>Mái che</li>

              <li>Cầu thang</li>

              <li>Lan can</li>

              <li>Cổng sắt</li>

            </ul>

          </div>

          <div>

            <h4 className="font-bold uppercase">
              Liên hệ
            </h4>

            <ul className="mt-6 space-y-4 text-gray-400">

              <li>📞 09xx xxx xxx</li>

              <li>✉ contact@daihaiphat.vn</li>

              <li>📍 TP Hồ Chí Minh</li>

            </ul>

          </div>

        </div>

        <div className="mt-16 border-t border-gray-800 pt-8 text-center text-gray-500">

          © 2026 Đại Hải Phát. All Rights Reserved.

        </div>

      </div>

    </footer>
  );
}
