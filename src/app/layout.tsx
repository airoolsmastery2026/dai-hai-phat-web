import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ĐẠI HẢI PHÁT | Cơ khí, xây dựng, nội thất',
  description: 'Website doanh nghiệp Đại Hải Phát: giới thiệu năng lực, dịch vụ, dự án và liên hệ báo giá.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='vi'>
      <body>{children}</body>
    </html>
  );
}
