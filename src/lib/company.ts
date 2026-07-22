import { Building2, Package2, PanelTop, Wrench, type LucideIcon } from "lucide-react";

import type { ArticleItem, CompanyConfig, ServiceItem, StatItem } from "@/types/company";

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
  { label: "Năm Kinh Nghiệm", value: "15+" },
  { label: "Dự Án Đã Thi Công", value: "850+" },
  { label: "Mẫu Thiết Kế 3D", value: "1,200+" },
  { label: "Mức Độ Hài Lòng", value: "99%" },
];

const serviceIcons: Record<number, LucideIcon> = {
  1: Package2,
  2: PanelTop,
  3: Wrench,
  4: Building2,
};

export const SERVICES: ServiceItem[] = [
  {
    id: 1,
    title: "Nội Thất Gỗ MDF Melamine & Cánh Kính Khung Nhôm",
    desc: "Sản xuất Giường ngủ thông minh, Tủ quần áo kịch trần, Kệ Tivi bằng gỗ MDF lõi xanh chống ẩm phủ Melamine cao cấp.",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
    icon: serviceIcons[1],
  },
  {
    id: 2,
    title: "Vách Tường Trang Trí, Lam Sóng & Tấm Ốp Composite",
    desc: "Thi công vách ngăn phòng, vách Tivi nhựa Composite vân đá/vân gỗ, tấm ốp tường Nano hiện đại chịu nước 100%.",
    image:
      "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80",
    icon: serviceIcons[2],
  },
  {
    id: 3,
    title: "Mái Che & Tấm Lợp Nhựa Đặc Composite Chịu Lực",
    desc: "Lắp đặt mái che lấy sáng, mái hiên sân thượng dùng tấm nhựa đặc Composite/Polycarbonate chống tia UV, chịu lực đập mạnh.",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
    icon: serviceIcons[3],
  },
  {
    id: 4,
    title: "Kết Cấu Thép, Cửa Cổng & Gia Công Cơ Khí CNC",
    desc: "Thi công nhà xưởng, khung kèo thép tiền chế, cửa cổng kết cấu sắt sơn tĩnh điện & gia công cắt laser chính xác.",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
    icon: serviceIcons[4],
  },
];

export const ARTICLES: ArticleItem[] = [
  {
    id: 1,
    title: "Giải Pháp Thiết Kế Tủ Quần Áo Gỗ MDF Lõi Xanh Phủ Melamine Cánh Kính 2026",
    category: "Gỗ Công Nghiệp MDF",
    date: "22/07/2026",
    author: "Designer Đại Hải Phát",
    excerpt: "Ưu điểm chống cong vênh, chống mối mọt của ván MDF lõi xanh Melamine kết hợp khung nhôm định hình nhúng LED sang trọng.",
    image:
      "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Mẫu Giường Ngủ Khung Thép Kết Hợp Tab Đầu Giường Gỗ MDF Melamine Hiện Đại",
    category: "Nội Thất Phòng Ngủ",
    date: "21/07/2026",
    author: "KTS Nguyễn Văn Hùng",
    excerpt: "Kết hợp khung cơ khí chắc chắn chịu tải 500kg với bề mặt gỗ MDF phủ Melamine vân gỗ tự nhiên siêu thẩm mỹ.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Thi Công Mái Che Tấm Lợp Nhựa Đặc Composite Chịu Lực & Chống Tia UV",
    category: "Vật Liệu Composite",
    date: "19/07/2026",
    author: "Đội Thi Công Cơ Khí",
    excerpt: "Tấm lợp đặc nhựa Composite độ bền trên 20 năm, không mục nát, chịu mưa bão và cách nhiệt tối ưu cho giếng trời, mái hiên.",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "Trang Trí Vách Tường Tivi Với Tấm Ốp Nhựa Composite & Lam Sóng Cao Cấp",
    category: "Vách Tường Trang Trí",
    date: "17/07/2026",
    author: "Ban Thiết Kế ĐHP",
    excerpt: "Sự kết hợp giữa vách nhựa Composite giả đá, lam sóng PVC và kệ Tivi MDF treo tường nâng tầm không gian phòng khách.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  },
];

export const getMapEmbedUrl = ({ lat, lng }: CompanyConfig["coordinates"]) =>
  `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
