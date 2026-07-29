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
    title: "Nội thất gỗ MDF và cánh kính khung nhôm",
    subtitle: "Tư vấn thiết kế thực tế",
    summary:
      "Đại Hải Phát thiết kế và thi công nội thất theo kích thước thực tế và nhu cầu lưu trữ. Mã MDF, bề mặt, cánh kính và phụ kiện được xác nhận trước khi gia công. Khả năng chịu ẩm, bảo hành và các tính năng vật liệu chỉ được ghi nhận theo hồ sơ của đúng sản phẩm được chọn.",
    fullDescription:
      "Hệ tủ, kệ và cánh kính được triển khai theo bản vẽ đã duyệt. Kích thước, vị trí thiết bị, mẫu màu, phụ kiện và điều kiện lắp đặt là dữ liệu bắt buộc trước khi chốt phương án.",
    desc: "Thiết kế và thi công nội thất phòng ngủ, tủ quần áo, kệ tivi và các hạng mục lưu trữ theo kích thước thực tế.",
    features: [
      { title: "Bố trí theo hiện trạng", description: "Phương án dựa trên kích thước, thiết bị và nhu cầu lưu trữ đã xác nhận." },
      { title: "Mã vật liệu rõ ràng", description: "Cốt, bề mặt, kính và phụ kiện được chốt theo mẫu hoặc hồ sơ sản phẩm." },
      { title: "Gia công theo bản vẽ", description: "Kích thước chi tiết được kiểm tra trước bước lắp đặt." },
    ],
    benefits: ["Theo kích thước", "Mẫu vật liệu rõ ràng", "Phụ kiện xác nhận", "Có bước kiểm tra"],
    process: [
      { title: "Khảo sát", description: "Đo đạc thực tế và phân tích nhu cầu sử dụng." },
      { title: "Thiết kế", description: "Lập bản vẽ và lựa chọn vật liệu phù hợp." },
      { title: "Thi công", description: "Gia công, lắp đặt và kiểm tra theo phạm vi đã xác nhận." },
    ],
    gallery: [
      "/images/interior/interior78.webp",
      "/images/interior/interior86.webp",
    ],
    faq: [
      { question: "Có thể thiết kế theo phong cách riêng không?", answer: "Có, chúng tôi nhận thiết kế theo yêu cầu và tối ưu theo không gian sử dụng." },
      { question: "Khi nào xác định được thời gian thực hiện?", answer: "Tiến độ được xác định sau khi có kích thước, vật liệu, phụ kiện và phạm vi lắp đặt." },
    ],
    seo: {
      title: "Dịch vụ nội thất gỗ MDF và cánh kính khung nhôm",
      description: "Thiết kế và thi công nội thất gỗ MDF, cánh kính khung nhôm và các hạng mục lưu trữ theo nhu cầu thực tế.",
      keywords: ["nội thất MDF", "tủ quần áo", "kệ tivi", "cánh kính nhôm"],
      canonical: "/services/noi-that-gỗ-mdf-melamine",
    },
    schema: {
      "@type": "Service",
      name: "Nội thất gỗ MDF và cánh kính khung nhôm",
      serviceType: "Interior furniture manufacturing",
    },
    image: "/images/interior/interior78.webp",
    icon: serviceIcons[1],
  },
  {
    id: 2,
    slug: "vach-tuong-trang-tri-composite",
    title: "Vách ngăn và ốp composite",
    subtitle: "Giải pháp bề mặt thực tế",
    summary:
      "Đại Hải Phát thi công vách ngăn, tấm ốp và lam sóng theo kích thước hiện trạng. Loại tấm, mã bề mặt, nền lắp đặt và yêu cầu vệ sinh được đối chiếu trước khi chốt cấu tạo.",
    fullDescription:
      "Phương án ốp vách bắt đầu từ kiểm tra mặt nền, kích thước, vị trí thiết bị và mẫu vật liệu. Tính năng chịu nước, giới hạn sử dụng và bảo hành phải theo hồ sơ của mã tấm được duyệt.",
    desc: "Thi công vách ngăn, ốp tường và lam sóng theo hiện trạng và mẫu vật liệu đã xác nhận.",
    features: [
      { title: "Kiểm tra mặt nền", description: "Xác định độ phẳng, độ ẩm và vị trí cần xử lý trước khi lắp." },
      { title: "Duyệt mẫu bề mặt", description: "Màu, vân, kích thước tấm và phụ kiện được xác nhận trước khi gia công." },
      { title: "Chốt cấu tạo khe", description: "Mối nối, góc và vị trí thiết bị được thể hiện trong phương án." },
    ],
    benefits: ["Theo hiện trạng", "Mẫu được duyệt", "Khe ghép rõ ràng", "Có phương án bảo trì"],
    process: [
      { title: "Đo đạc", description: "Khảo sát vị trí lắp đặt và điều kiện môi trường." },
      { title: "Cắt ghép", description: "Cắt theo kích thước và hoàn thiện bề mặt." },
      { title: "Lắp đặt", description: "Gắn cố định và kiểm tra độ phẳng, hài hòa." },
    ],
    gallery: [
      "/images/interior/interior16.webp",
      "/images/interior/interior71.webp",
    ],
    faq: [
      { question: "Có cần kiểm tra mặt nền trước khi thi công không?", answer: "Có. Độ phẳng, độ ẩm và vị trí thiết bị phải được kiểm tra trước khi chốt cấu tạo lắp đặt." },
    ],
    seo: {
      title: "Dịch vụ vách ngăn và ốp composite",
      description: "Thi công vách ngăn, ốp composite và lam sóng phù hợp cho không gian nội thất và kiến trúc.",
      keywords: ["ốp composite", "vách ngăn", "lam sóng"],
      canonical: "/services/vach-tuong-trang-tri-composite",
    },
    schema: {
      "@type": "Service",
      name: "Vách ngăn và ốp composite",
      serviceType: "Composite wall systems",
    },
    image: "/images/interior/interior16.webp",
    icon: serviceIcons[2],
  },
  {
    id: 3,
    slug: "mai-che-nhua-dac-composite",
    title: "Mái che và tấm lấy sáng",
    subtitle: "Khảo sát trước khi chọn tấm",
    summary:
      "Đại Hải Phát khảo sát và lắp đặt mái che theo khẩu độ, điểm neo, cao độ và hướng thoát nước thực tế. Loại tấm chỉ được đề xuất sau khi đối chiếu điều kiện sử dụng với hồ sơ kỹ thuật của sản phẩm.",
    fullDescription:
      "Phương án mái che cần dữ liệu về kích thước, kết cấu đỡ, thoát nước, gió và khả năng bảo trì. Tính năng UV, giới hạn nhịp, tuổi thọ và bảo hành chỉ được đưa vào Proposal khi có tài liệu của đúng mã tấm.",
    desc: "Thi công mái che và tấm lấy sáng theo hiện trạng, bản vẽ và hồ sơ vật liệu đã xác nhận.",
    features: [
      { title: "Khảo sát điểm neo", description: "Kiểm tra vị trí liên kết và kết cấu hiện hữu trước khi thiết kế." },
      { title: "Đối chiếu hồ sơ tấm", description: "Giới hạn nhịp, tính năng và bảo hành theo đúng mã sản phẩm." },
      { title: "Lập hướng thoát nước", description: "Cao độ, độ dốc và vị trí thu nước được xác nhận trong phương án." },
    ],
    benefits: ["Theo khẩu độ", "Điểm neo xác nhận", "Thoát nước rõ ràng", "Hồ sơ tấm đối chiếu"],
    process: [
      { title: "Căn chỉnh", description: "Xác định góc nghiêng, tải trọng và chiều dài mái." },
      { title: "Sản xuất", description: "Gia công cấu kiện và tấm lợp theo bản vẽ." },
      { title: "Lắp đặt", description: "Lắp theo bản vẽ và kiểm tra các điểm liên kết, thoát nước." },
    ],
    gallery: [
      "/images/canopies/canopy03.webp",
      "/images/canopies/canopy08.webp",
    ],
    faq: [
      { question: "Khi nào xác định được loại tấm phù hợp?", answer: "Sau khảo sát và khi có hồ sơ kỹ thuật của mã tấm để đối chiếu với điều kiện sử dụng." },
    ],
    seo: {
      title: "Dịch vụ mái che và tấm lấy sáng",
      description: "Khảo sát và thi công mái che, tấm lấy sáng theo hiện trạng và hồ sơ vật liệu.",
      keywords: ["mái che", "tấm lấy sáng", "khảo sát mái che"],
      canonical: "/services/mai-che-nhua-dac-composite",
    },
    schema: {
      "@type": "Service",
      name: "Mái che và tấm lấy sáng",
      serviceType: "Roofing systems",
    },
    image: "/images/canopies/canopy03.webp",
    icon: serviceIcons[3],
  },
  {
    id: 4,
    slug: "ket-cau-thep-cua-cong",
    title: "Kết cấu thép và cửa cổng công nghiệp",
    subtitle: "Thi công theo bản vẽ",
    summary:
      "Đại Hải Phát thực hiện cửa cổng, khung thép và chi tiết cơ khí theo kích thước, cấu tạo và phương án xử lý bề mặt đã thống nhất. Tải trọng và liên kết phải được xác nhận trước khi gia công.",
    fullDescription:
      "Phương án cơ khí được lập từ hiện trạng, bản vẽ, vật liệu, tải trọng và điều kiện lắp dựng. Các thông số chưa có hồ sơ hoặc chưa đo tại công trình không được dùng để kết luận.",
    desc: "Thi công khung thép, cửa cổng và các chi tiết cơ khí theo kích thước và tải trọng thực tế.",
    features: [
      { title: "Chốt kích thước", description: "Kích thước và vị trí liên kết được xác nhận trước khi gia công." },
      { title: "Chọn xử lý bề mặt", description: "Hệ sơn hoặc lớp phủ được ghi rõ theo phạm vi sử dụng." },
      { title: "Thi công theo bản vẽ", description: "Cấu kiện được lắp và kiểm tra theo phương án đã duyệt." },
    ],
    benefits: ["Theo kích thước", "Liên kết xác nhận", "Bề mặt ghi rõ", "Có bước kiểm tra"],
    process: [
      { title: "Thiết kế kết cấu", description: "Lập sơ đồ và kích thước cho hệ thống thép." },
      { title: "Gia công", description: "Cắt, hàn và xử lý bề mặt chi tiết." },
      { title: "Lắp dựng", description: "Lắp đặt tại công trình và kiểm tra độ thẳng, vững chắc." },
    ],
    gallery: [
      "/images/gates/gate01.webp",
      "/images/factory/factory02.webp",
    ],
    faq: [
      { question: "Bạn có nhận làm cửa cổng và khung thép theo kích thước riêng không?", answer: "Có, chúng tôi gia công theo bản vẽ và kích thước yêu cầu của khách hàng." },
    ],
    seo: {
      title: "Dịch vụ kết cấu thép và cửa cổng công nghiệp",
      description: "Thi công kết cấu thép, cửa cổng và chi tiết cơ khí theo bản vẽ và thông số đã xác nhận.",
      keywords: ["kết cấu thép", "cửa cổng", "gia công cơ khí"],
      canonical: "/services/ket-cau-thep-cua-cong",
    },
    schema: {
      "@type": "Service",
      name: "Kết cấu thép và cửa cổng công nghiệp",
      serviceType: "Steel structure fabrication",
    },
    image: "/images/gates/gate01.webp",
    icon: serviceIcons[4],
  },
];
