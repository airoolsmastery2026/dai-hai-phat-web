import { Building2, Package2, PanelTop, Wrench, type LucideIcon } from "lucide-react";

import type { ServiceItem } from "@/types/content";

const serviceIcons: Record<number, LucideIcon> = {
  1: Package2,
  2: PanelTop,
  3: Wrench,
  4: Building2,
};

export const SERVICES: ServiceItem[] = [
  {
    id: 1,
    slug: "noi-that-gỗ-mdf-melamine",
    title: "Nội Thất Gỗ MDF Melamine & Cánh Kính Khung Nhôm",
    subtitle: "Thiết kế và sản xuất nội thất công nghiệp hiện đại",
    summary: "Giải pháp nội thất thông minh, bền bỉ và thẩm mỹ cho phòng ngủ, tủ quần áo, kệ tivi và không gian làm việc.",
    fullDescription: "Đại Hải Phát triển khai các hạng mục nội thất gỗ MDF lõi xanh phủ Melamine, cánh kính khung nhôm và hệ thống kệ tủ thông minh theo đúng bản vẽ kỹ thuật, tiêu chuẩn thi công và nhu cầu sử dụng thực tế.",
    desc: "Sản xuất Giường ngủ thông minh, Tủ quần áo kịch trần, Kệ Tivi bằng gỗ MDF lõi xanh chống ẩm phủ Melamine cao cấp.",
    features: [
      { title: "Mẫu thiết kế đa dạng", description: "Phù hợp cho phòng ngủ, phòng khách, văn phòng và không gian retail." },
      { title: "Vật liệu chống ẩm", description: "MDF lõi xanh và lớp phủ Melamine giúp tăng độ bền lâu dài." },
      { title: "Gia công chính xác", description: "Cắt CNC, lắp ghép và hoàn thiện theo tiêu chuẩn tối ưu." },
    ],
    benefits: ["Tăng tính thẩm mỹ", "Tối ưu không gian", "Độ bền cao", "Dễ bảo trì"],
    process: [
      { title: "Khảo sát", description: "Đo đạc thực tế và phân tích nhu cầu sử dụng." },
      { title: "Thiết kế", description: "Lập bản vẽ 3D và chọn vật liệu phù hợp." },
      { title: "Thi công", description: "Gia công và lắp đặt đúng tiến độ và tiêu chuẩn chất lượng." },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
    ],
    faq: [
      { question: "Có thể thiết kế theo phong cách riêng không?", answer: "Có, chúng tôi nhận thiết kế theo yêu cầu và tối ưu theo không gian." },
      { question: "Thời gian thực hiện khoảng bao lâu?", answer: "Tùy quy mô dự án, thường dao động từ vài ngày đến vài tuần." },
    ],
    seo: {
      title: "Dịch vụ nội thất gỗ MDF melamine tại Đại Hải Phát",
      description: "Thiết kế và thi công nội thất gỗ MDF melamine, cánh kính khung nhôm và kệ tủ hiện đại.",
      keywords: ["nội thất MDF", "tủ quần áo", "kệ tivi", "cánh kính nhôm"],
      canonical: "/services/noi-that-gỗ-mdf-melamine",
    },
    schema: {
      "@type": "Service",
      name: "Nội Thất Gỗ MDF Melamine & Cánh Kính Khung Nhôm",
      serviceType: "Interior furniture manufacturing",
    },
    relatedProjects: [
      { title: "Thi công vách ngăn composite cao cấp", slug: "vach-ngan-composite", category: "Composite", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80" },
    ],
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
    icon: serviceIcons[1],
  },
  {
    id: 2,
    slug: "vach-tuong-trang-tri-composite",
    title: "Vách Tường Trang Trí, Lam Sóng & Tấm Ốp Composite",
    subtitle: "Tạo điểm nhấn kiến trúc và chống thấm hiệu quả",
    summary: "Thi công vách ngăn, tấm ốp composite và lam sóng cho không gian nội thất và kiến trúc hiện đại.",
    fullDescription: "Chúng tôi cung cấp giải pháp ốp vách, vách ngăn phòng và tấm composite chuyên dụng với độ bền cao, khả năng chống ẩm và thẩm mỹ vượt trội.",
    desc: "Thi công vách ngăn phòng, vách Tivi nhựa Composite vân đá/vân gỗ, tấm ốp tường Nano hiện đại chịu nước 100%.",
    features: [
      { title: "Chống ẩm", description: "Phù hợp cho khu vực bếp, phòng tắm và không gian vệ sinh." },
      { title: "Mẫu vân đa dạng", description: "Đa dạng mẫu đá, gỗ và màu sắc hiện đại." },
      { title: "Dễ vệ sinh", description: "Bề mặt nhẵn, sạch và thân thiện với môi trường sử dụng." },
    ],
    benefits: ["Kháng nước", "Dễ dựng", "Thẩm mỹ cao", "Giữ màu lâu"],
    process: [
      { title: "Đo đạc", description: "Khảo sát vị trí lắp đặt và điều kiện môi trường." },
      { title: "Cắt ghép", description: "Cắt theo kích thước và hoàn thiện bề mặt." },
      { title: "Lắp đặt", description: "Gắn cố định và kiểm tra độ phẳng, hài hòa." },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    ],
    faq: [
      { question: "Có cần chuẩn bị mặt phẳng trước khi thi công không?", answer: "Nên có mặt phẳng và thông tin kích thước trước khi triển khai để đảm bảo độ chính xác." },
    ],
    seo: {
      title: "Dịch vụ ốp vách composite và lam sóng tại Đại Hải Phát",
      description: "Thi công vách tường trang trí, lam sóng và tấm ốp composite chất lượng cao.",
      keywords: ["ốp composite", "vách ngăn", "lam sóng"],
      canonical: "/services/vach-tuong-trang-tri-composite",
    },
    schema: {
      "@type": "Service",
      name: "Vách Tường Trang Trí, Lam Sóng & Tấm Ốp Composite",
      serviceType: "Composite wall systems",
    },
    relatedProjects: [
      { title: "Nội thất phòng ngủ MDF melamine", slug: "noi-that-gỗ-mdf-melamine", category: "Nội thất", image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80" },
    ],
    image:
      "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80",
    icon: serviceIcons[2],
  },
  {
    id: 3,
    slug: "mai-che-nhua-dac-composite",
    title: "Mái Che & Tấm Lợp Nhựa Đặc Composite Chịu Lực",
    subtitle: "Giải pháp mái che bền bỉ, sáng tạo và chịu lực",
    summary: "Lắp đặt mái che, mái hiên và tấm lợp composite đáp ứng nhu cầu chống nắng, chống mưa và cách nhiệt.",
    fullDescription: "Mái che và tấm lợp nhựa đặc composite được triển khai cho các công trình dân dụng, công nghiệp và sân vườn với độ bền cao và giá trị thẩm mỹ tối ưu.",
    desc: "Lắp đặt mái che lấy sáng, mái hiên sân thượng dùng tấm nhựa đặc Composite/Polycarbonate chống tia UV, chịu lực đập mạnh.",
    features: [
      { title: "Chống tia UV", description: "Bảo vệ khỏi ánh nắng gắt và giảm nhiệt độ dưới mái." },
      { title: "Chịu lực tốt", description: "Phù hợp với mái hiên, mái che và công trình có điều kiện thời tiết khắc nghiệt." },
      { title: "Thiết kế linh hoạt", description: "Dễ tích hợp với kết cấu sắt, thép hoặc khung nhôm." },
    ],
    benefits: ["Cách nhiệt", "Chống thấm", "Dễ bảo trì", "Thời gian thi công ngắn"],
    process: [
      { title: "Căn chỉnh", description: "Xác định góc nghiêng, tải trọng và chiều dài mái." },
      { title: "Sản xuất", description: "Gia công cấu kiện và tấm lợp theo bản vẽ." },
      { title: "Lắp đặt", description: "Đảm bảo kết nối chắc chắn, kín nước và thẩm mỹ." },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80",
    ],
    faq: [
      { question: "Mái che có phù hợp cho khu vực nắng gắt không?", answer: "Có, tấm composite chống tia UV giúp giảm nhiệt và bảo vệ không gian dưới mái." },
    ],
    seo: {
      title: "Dịch vụ mái che composite và tấm lợp chịu lực",
      description: "Thi công mái che và mặt lợp composite tối ưu cho không gian ngoài trời.",
      keywords: ["mái che composite", "tấm lợp", "chống tia UV"],
      canonical: "/services/mai-che-nhua-dac-composite",
    },
    schema: {
      "@type": "Service",
      name: "Mái Che & Tấm Lợp Nhựa Đặc Composite Chịu Lực",
      serviceType: "Roofing systems",
    },
    relatedProjects: [
      { title: "Khung thép và cửa cổng công nghiệp", slug: "khung-thep-cua-cong", category: "Kết cấu thép", image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80" },
    ],
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
    icon: serviceIcons[3],
  },
  {
    id: 4,
    slug: "ket-cau-thep-cua-cong",
    title: "Kết Cấu Thép, Cửa Cổng & Gia Công Cơ Khí CNC",
    subtitle: "Công trình thép chính xác, chắc chắn và bền lâu",
    summary: "Thi công khung thép tiền chế, cửa cổng kết cấu và gia công CNC cho công trình công nghiệp và dân dụng.",
    fullDescription: "Đại Hải Phát triển khai kết cấu thép, cửa cổng và các chi tiết gia công CNC đáp ứng các tiêu chuẩn kỹ thuật, độ bền và tiến độ thi công.",
    desc: "Thi công nhà xưởng, khung kèo thép tiền chế, cửa cổng kết cấu sắt sơn tĩnh điện & gia công cắt laser chính xác.",
    features: [
      { title: "Gia công CNC", description: "Đảm bảo độ chính xác cao cho các chi tiết kết cấu và cửa cổng." },
      { title: "Mạ sơn chống gỉ", description: "Tăng tuổi thọ và khả năng chống ăn mòn." },
      { title: "Thi công theo bản vẽ", description: "Triển khai đúng spec, đúng kích thước và đúng tiến độ." },
    ],
    benefits: ["Độ chắc chắn cao", "Tiến độ kiểm soát", "Tối ưu chi phí", "Dễ bảo trì"],
    process: [
      { title: "Thiết kế kết cấu", description: "Lập sơ đồ và kích thước cho hệ thống thép." },
      { title: "Gia công", description: "Cắt, hàn và xử lý bề mặt chi tiết." },
      { title: "Lắp dựng", description: "Lắp đặt tại công trình và kiểm tra độ thẳng, vững chắc." },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80",
    ],
    faq: [
      { question: "Bạn có nhận làm cửa cổng và khung thép theo kích thước riêng không?", answer: "Có, chúng tôi gia công theo bản vẽ và kích thước yêu cầu của khách hàng." },
    ],
    seo: {
      title: "Dịch vụ kết cấu thép và gia công cơ khí CNC",
      description: "Thi công kết cấu thép, cửa cổng và các chi tiết cơ khí CNC theo tiêu chuẩn kỹ thuật cao.",
      keywords: ["kết cấu thép", "cửa cổng", "gia công CNC"],
      canonical: "/services/ket-cau-thep-cua-cong",
    },
    schema: {
      "@type": "Service",
      name: "Kết Cấu Thép, Cửa Cổng & Gia Công Cơ Khí CNC",
      serviceType: "Steel structure fabrication",
    },
    relatedProjects: [
      { title: "Mái che composite chịu lực", slug: "mai-che-nhua-dac-composite", category: "Composite", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80" },
    ],
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
    icon: serviceIcons[4],
  },
];
