import type { Metadata } from "next";
import Link from "next/link";

import { AdminMediaManager } from "@/components/admin/AdminMediaManager";

export const metadata: Metadata = {
  title: "Quản lý hình ảnh",
  robots: { index: false, follow: false, noarchive: true },
};

export default function AdminMediaPage() {
  return (
    <>
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <Link
          href="/admin/media/videos"
          className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-800 shadow-sm transition hover:border-slate-500"
        >
          Mở quản lý video
        </Link>
      </div>
      <AdminMediaManager />
    </>
  );
}
