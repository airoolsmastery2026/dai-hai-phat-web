import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center" role="main">
      <h1 className="text-4xl font-semibold text-slate-900">Không tìm thấy trang</h1>
      <p className="mt-3 text-slate-600">Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.</p>
      <Link href="/" className="mt-6 rounded-lg bg-[#FF5722] px-6 py-3 font-semibold text-white">
        Quay về trang chủ
      </Link>
    </main>
  );
}
