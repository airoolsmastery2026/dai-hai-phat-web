import type { CompanyConfig, StatItem } from "@/types/content";

export const COMPANY_CONFIG: CompanyConfig = {
  name: "CÔNG TY TNHH CƠ KHÍ XÂY DỰNG ĐẠI HẢI PHÁT",
  shortName: "ĐẠI HẢI PHÁT",
  phones: [
    { display: "0785.505.518", raw: "0785505518" },
    { display: "0328.721.724", raw: "0328721724" },
  ],
  primaryPhone: "0785.505.518",
  email: "daihaiphat83@gmail.com",
  address: "DL12, Khu phố 3B, Thới Hòa, TP. Hồ Chí Minh 820000, Việt Nam",
  coordinates: { lat: 11.1042833, lng: 106.6294283 },
  googleMapsUrl:
    "https://www.google.com/maps/place/CTY+TNHH+C%C6%A0+KH%C3%8D+X%C3%82Y+D%E1%BB%B0NG+%C4%90%E1%BA%A0I+H%E1%BA%A2I+PH%C3%81T/@11.1042833,106.6294283,17z",
  websiteUrl: "https://dai-hai-phat-web.vercel.app",
  socials: {
    zalo1: "https://zalo.me/0785505518",
    whatsapp1: "https://wa.me/84785505518",
  },
};

export const COMPANY_STATS: StatItem[] = [
  { label: "Kinh nghiệm", value: "15+ năm" },
  { label: "Phạm vi", value: "Công trình dân dụng và công nghiệp" },
  { label: "Đối tác", value: "Tin cậy trong từng giai đoạn" },
  { label: "Hỗ trợ", value: "Bàn giao và kiểm tra sau thi công" },
];
