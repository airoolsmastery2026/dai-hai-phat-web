import type { Metadata } from "next";

import DhpWorkspaceDocumentInbox from "@/components/admin/DhpWorkspaceDocumentInbox";

export const metadata: Metadata = {
  title: "Document Inbox | DHP Workspace",
  description: "Kho tiếp nhận tài liệu có provenance cho Đại Hải Phát AI OS.",
  robots: { index: false, follow: false },
};

export default function WorkspaceDocumentsPage() {
  return <DhpWorkspaceDocumentInbox />;
}
