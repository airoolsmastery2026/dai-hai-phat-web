import type { Metadata } from "next";

import { AdminVideoManager } from "@/components/admin/AdminVideoManager";

export const metadata: Metadata = {
  title: "Quản lý video",
  robots: { index: false, follow: false, noarchive: true },
};

export default function AdminVideoPage() {
  return <AdminVideoManager />;
}
