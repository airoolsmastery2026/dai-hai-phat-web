const title = "CÔNG TY TNHH CƠ KHÍ XÂY DỰNG ĐẠI HẢI PHÁT";
const description =
  "Đại Hải Phát chuyên thi công kết cấu thép, nhà xưởng, mái che và gia công cơ khí cho công trình dân dụng và công nghiệp.";

export const metadata: Metadata = {
  metadataBase: new URL(COMPANY_CONFIG.websiteUrl),
  title: {
    default: title,
    template: `%s | ${title}`,
  },
  description,
  keywords: [
    "cơ khí xây dựng",
    "kết cấu thép",
    "nhà xưởng",
    "mái che",
    "gia công cơ khí",
    "Đại Hải Phát",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    type: "website",
    locale: "vi_VN",
    url: COMPANY_CONFIG.websiteUrl,
    siteName: title,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
};
