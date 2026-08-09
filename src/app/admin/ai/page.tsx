import type { Metadata } from 'next';
import AdminAiControlPlane from '@/components/admin/AdminAiControlPlane';

export const metadata: Metadata = {
  title: 'DHP AI Control Plane | Đại Hải Phát',
  robots: { index: false, follow: false },
};

export default function AdminAiPage() {
  return <AdminAiControlPlane />;
}
