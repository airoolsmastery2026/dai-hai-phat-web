import type { Metadata } from "next";

import { AdminPublishingManager } from "@/components/admin/AdminPublishingManager";
import { AdminTelegramControl } from "@/components/admin/AdminTelegramControl";

export const metadata: Metadata = {
  title: "Publishing Accounts | Đại Hải Phát",
  robots: { index: false, follow: false, noarchive: true },
};

export default function AdminPublishingPage() {
  return (
    <>
      <AdminPublishingManager />
      <div className="mx-auto -mt-2 max-w-7xl px-4 pb-8 md:px-8">
        <AdminTelegramControl />
      </div>
    </>
  );
}
