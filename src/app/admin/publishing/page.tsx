import type { Metadata } from "next";

import { AdminPublishingManager } from "@/components/admin/AdminPublishingManager";

export const metadata: Metadata = {
  title: "Publishing Accounts | Đại Hải Phát",
  robots: { index: false, follow: false, noarchive: true },
};

export default function AdminPublishingPage() {
  return <AdminPublishingManager />;
}
