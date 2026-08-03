import type { Metadata } from "next";

import { AdminMediaManager } from "@/components/admin/AdminMediaManager";

export const metadata: Metadata = {
  title: "Quản lý hình ảnh",
  robots: { index: false, follow: false, noarchive: true },
};

export default function AdminMediaPage() {
  return <AdminMediaManager />;
}
