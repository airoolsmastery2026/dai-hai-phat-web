import {
  Fence,
  Landmark,
  Package2,
  PanelTop,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import type { ServiceItem } from "@/types/content";

const serviceIcons: Record<number, LucideIcon> = {
  1: Package2,
  2: PanelTop,
  3: Wrench,
  4: Fence,
  5: Landmark,
};

export const SERVICES: ServiceItem[] = [
  {
    id: 1,
    slug: "noi-that-gỗ-mdf-melamine",
    aiService: "Nội thất",
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
    aiService: "Cải tạo không gian",
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
    aiService: "Mái che",
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
    slug: "cua-cong-co-khi-dan-dung",
    aiService: "Cửa cổng",
    title: "Cửa cổng và cơ khí dân dụng",
    subtitle: "Gia công theo hiện trạng",
    summary:
      "Đại Hải Phát thực hiện cửa cổng, hàng rào, khung bảo vệ và chi tiết cơ khí dân dụng theo kích thước, kiểu dáng và phương án xử lý bề mặt đã thống nhất.",
    fullDescription:
      "Phương án được lập từ hiện trạng nhà ở, nhu cầu sử dụng, kích thước, vật liệu và điều kiện lắp đặt. Các thông số chưa đo tại công trình không được dùng để kết luận.",
    desc: "Thiết kế, gia công và lắp đặt cửa cổng cùng các chi tiết cơ khí cho nhà ở theo kích thước thực tế.",
    features: [
      { title: "Chốt kích thước", description: "Kích thước và vị trí liên kết được xác nhận trước khi gia công." },
      { title: "Chọn xử lý bề mặt", description: "Hệ sơn hoặc lớp phủ được ghi rõ theo phạm vi sử dụng." },
      { title: "Lắp đặt tại nhà", description: "Sản phẩm được lắp và kiểm tra vận hành theo phương án đã duyệt." },
    ],
    benefits: ["Theo kích thước", "Liên kết xác nhận", "Bề mặt ghi rõ", "Có bước kiểm tra"],
    process: [
      { title: "Khảo sát và thiết kế", description: "Đo hiện trạng, chốt kiểu dáng và kích thước sản phẩm." },
      { title: "Gia công", description: "Cắt, hàn và xử lý bề mặt chi tiết." },
      { title: "Lắp dựng", description: "Lắp đặt tại công trình và kiểm tra độ thẳng, vững chắc." },
    ],
    gallery: [
      "/images/gates/gate01.webp",
      "/images/gates/gate03.webp",
    ],
    faq: [
      { question: "Bạn có nhận làm cửa cổng và khung thép theo kích thước riêng không?", answer: "Có, chúng tôi gia công theo bản vẽ và kích thước yêu cầu của khách hàng." },
    ],
    seo: {
      title: "Dịch vụ cửa cổng và cơ khí dân dụng",
      description: "Thiết kế, gia công và lắp đặt cửa cổng, hàng rào cùng chi tiết cơ khí cho nhà ở.",
      keywords: ["cửa cổng nhà ở", "cơ khí dân dụng", "gia công cửa cổng"],
      canonical: "/services/cua-cong-co-khi-dan-dung",
    },
    schema: {
      "@type": "Service",
      name: "Cửa cổng và cơ khí dân dụng",
      serviceType: "Residential gate and metalwork",
    },
    image: "/images/gates/gate01.webp",
    icon: serviceIcons[4],
  },
  {
    id: 5,
    slug: "cau-thang-lan-can",
    aiService: "Cầu thang và lan can",
    title: "Cầu thang và lan can",
    subtitle: "Thiết kế theo hiện trạng",
    summary:
      "Đại Hải Phát thiết kế, gia công và lắp đặt cầu thang, tay vịn, lan can ban công theo kích thước, cao độ và nhu cầu sử dụng của từng nhà ở.",
    fullDescription:
      "Phương án cầu thang và lan can được lập sau khi đo hiện trạng, kiểm tra vị trí liên kết, lối đi và lựa chọn vật liệu. Kích thước chi tiết, cấu tạo chịu lực và khoảng hở an toàn phải được kỹ sư xác nhận trước khi gia công.",
    desc: "Thi công cầu thang, tay vịn và lan can cho nhà phố, căn hộ, biệt thự theo dữ liệu hiện trạng.",
    features: [
      { title: "Đo hiện trạng", description: "Xác nhận cao độ, kích thước lối đi, vị trí liên kết và điều kiện lắp đặt." },
      { title: "Chốt vật liệu", description: "Kính, kim loại, gỗ, phụ kiện và bề mặt hoàn thiện được duyệt trước khi gia công." },
      { title: "Kiểm tra sử dụng", description: "Độ chắc chắn, tay vịn, khoảng hở và bề mặt được kiểm tra khi lắp đặt." },
    ],
    benefits: ["Theo hiện trạng", "Vật liệu xác nhận", "Liên kết rõ ràng", "Kiểm tra khi bàn giao"],
    process: [
      { title: "Khảo sát", description: "Đo cao độ, kích thước và kiểm tra vị trí liên kết tại công trình." },
      { title: "Thiết kế và gia công", description: "Chốt cấu tạo, vật liệu rồi gia công theo bản vẽ đã duyệt." },
      { title: "Lắp đặt", description: "Lắp tại công trình, căn chỉnh và kiểm tra trước khi bàn giao." },
    ],
    gallery: [
      "/images/stairs/stair01.webp",
      "/images/railings/railing01.webp",
    ],
    faq: [
      { question: "Có thể kết hợp kính, kim loại và gỗ không?", answer: "Có thể, nhưng cấu tạo liên kết và mã vật liệu cần được chốt sau khi đo hiện trạng và duyệt mẫu." },
      { question: "Khi nào có thể chốt kích thước gia công?", answer: "Kích thước chỉ được chốt sau khi khảo sát cao độ, lối đi và các điểm liên kết tại công trình." },
    ],
    seo: {
      title: "Dịch vụ cầu thang và lan can nhà ở",
      description: "Thiết kế, gia công và lắp đặt cầu thang, tay vịn, lan can ban công theo hiện trạng nhà ở.",
      keywords: ["cầu thang nhà ở", "lan can ban công", "tay vịn cầu thang"],
      canonical: "/services/cau-thang-lan-can",
    },
    schema: {
      "@type": "Service",
      name: "Cầu thang và lan can",
      serviceType: "Residential stairs and railings",
    },
    image: "/images/stairs/stair01.webp",
    icon: serviceIcons[5],
  },
];
