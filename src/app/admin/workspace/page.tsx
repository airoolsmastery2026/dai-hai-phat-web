import type { Metadata } from "next";
import DhpWorkspace from "@/components/admin/DhpWorkspace";

export const metadata: Metadata = {
  title: "DHP Workspace | Đại Hải Phát AI OS",
  description: "Không gian làm việc nội bộ kết nối Đại Hải Phát AI OS và zero-cost model runtime.",
  robots: { index: false, follow: false },
};

export default function WorkspacePage() {
  return <DhpWorkspace />;
}
