import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import React from "react";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const SITE_NAME =
  "CÔNG TY TNHH CƠ KHÍ XÂY DỰNG ĐẠI HẢI PHÁT";

const DESCRIPTION =
  "Đại Hải Phát chuyên thiết kế, gia công và thi công Nội thất - Cơ khí dân dụng: tủ bếp, phòng ngủ, tủ quần áo, kệ TV, mái che, cổng, lan can, cầu thang và các sản phẩm theo yêu cầu.";

export const metadata: Metadata = {
  metadataBase: new URL("https://daihaiphat.vn"),

  title: {
    default: SITE_NAME,
    template: "%s | Đại Hải Phát",
  },

  description: DESCRIPTION,

  keywords: [
    "Nội thất",
    "Nội thất gỗ",
    "Tủ bếp",
    "Tủ quần áo",
    "Phòng ngủ",
    "Kệ TV",
    "Mái che",
    "Lan can",
    "Cầu thang",
    "Cổng sắt",
    "Cơ khí dân dụng",
    "Gia công theo yêu cầu",
    "Đại Hải Phát",
  ],

  openGraph: {
    type: "website",
    locale: "vi_VN",

    title: SITE_NAME,

    description: DESCRIPTION,

    siteName: SITE_NAME,
  },

  twitter: {
    card: "summary_large_image",

    title: SITE_NAME,

    description: DESCRIPTION,
  },

  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#111827",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">

      <body className={inter.className}>

        {children}

      </body>

    </html>
  );
}
