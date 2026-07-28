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
      "Chúng tôi thiết kế và thi công nội thất theo kích thước thực tế, phù hợp với từng không gian sử dụng. Nội thất được gia công đúng tỷ lệ, bền với thời gian và dễ bảo trì. Mỗi hạng mục được lựa chọn vật liệu phù hợp, từ MDF lõi xanh đến cánh kính khung nhôm, nhằm tạo ra giải pháp vừa tiện dụng vừa có tính thẩm mỹ cao. Quy trình làm việc rõ ràng giúp khách hàng theo dõi tiến độ và kiểm tra chất lượng trước khi lắp đặt.",
    fullDescription:
      "Đại Hải Phát triển khai nội thất gỗ MDF, cánh kính khung nhôm và hệ thống tủ kệ theo bản vẽ kỹ thuật, tiêu chuẩn thi công và nhu cầu sử dụng thực tế. Mỗi chi tiết được gia công cẩn trọng để phù hợp với không gian, điều kiện sử dụng và phong cách làm việc của khách hàng.",
    desc: "Thiết kế và thi công nội thất phòng ngủ, tủ quần áo, kệ tivi và các hạng mục lưu trữ theo kích thước thực tế.",
    features: [
      { title: "Thiết kế phù hợp không gian", description: "Phù hợp cho phòng ngủ, phòng khách, văn phòng và không gian retail." },
      { title: "Vật liệu bền và dễ bảo trì", description: "MDF lõi xanh và lớp phủ melamine giúp tăng độ bền lâu dài." },
      { title: "Gia công chính xác", description: "Cắt CNC, lắp ghép và hoàn thiện theo tiêu chuẩn kỹ thuật." },
    ],
    benefits: ["Tiện dụng", "Tối ưu không gian", "Bền lâu", "Dễ bảo trì"],
    process: [
      { title: "Khảo sát", description: "Đo đạc thực tế và phân tích nhu cầu sử dụng." },
      { title: "Thiết kế", description: "Lập bản vẽ và lựa chọn vật liệu phù hợp." },
      { title: "Thi công", description: "Gia công và lắp đặt đúng tiến độ và tiêu chuẩn chất lượng." },
    ],
    gallery: [
      "/images/interior/interior78.webp",
      "/images/interior/interior86.webp",
    ],
    faq: [
      { question: "Có thể thiết kế theo phong cách riêng không?", answer: "Có, chúng tôi nhận thiết kế theo yêu cầu và tối ưu theo không gian sử dụng." },
      { question: "Thời gian thực hiện khoảng bao lâu?", answer: "Tùy quy mô dự án, thường dao động từ vài ngày đến vài tuần." },
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
    relatedProjects: [
      { title: "Thi công vách ngăn composite cao cấp", slug: "vach-ngan-composite", category: "Composite", image: "/images/interior/interior16.webp" },
    ],
    image: "/images/interior/interior78.webp",
    icon: serviceIcons[1],
  },
  {
    id: 2,
    slug: "vach-tuong-trang-tri-composite",
    title: "Vách ngăn và ốp composite",
    subtitle: "Giải pháp bề mặt thực tế",
    summary:
      "Chúng tôi thi công vách ngăn, tấm ốp và lam sóng cho không gian nội thất và kiến trúc với cách làm đơn giản, đúng kích thước và dễ duy trì. Bề mặt composite phù hợp cho những khu vực cần tính thẩm mỹ, độ bền và khả năng vệ sinh tốt. Mỗi hạng mục được lắp đặt cẩn trọng để hạn chế sai lệch, khe hở và ảnh hưởng đến tổng thể công trình.",
    fullDescription:
      "Giải pháp ốp vách và vách ngăn composite giúp nâng cao tính thẩm mỹ và đồng bộ cho không gian. Chúng tôi lựa chọn vật liệu phù hợp với môi trường sử dụng và triển khai thi công theo đúng phương án đã thống nhất.",
    desc: "Thi công vách ngăn phòng, ốp tường và lam sóng với bề mặt đồng bộ, ít bụi và dễ vệ sinh.",
    features: [
      { title: "Phù hợp môi trường ẩm", description: "Phù hợp cho khu vực bếp, phòng tắm và không gian vệ sinh." },
      { title: "Mẫu vân đa dạng", description: "Đa dạng mẫu đá, gỗ và màu sắc hiện đại." },
      { title: "Dễ vệ sinh", description: "Bề mặt nhẵn, sạch và thuận tiện cho việc bảo trì hàng ngày." },
    ],
    benefits: ["Kháng nước", "Dễ dựng", "Thẩm mỹ cao", "Giữ màu lâu"],
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
      { question: "Có cần chuẩn bị mặt phẳng trước khi thi công không?", answer: "Nên có mặt phẳng và thông tin kích thước trước khi triển khai để đảm bảo độ chính xác." },
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
    relatedProjects: [
      { title: "Nội thất phòng ngủ MDF melamine", slug: "noi-that-gỗ-mdf-melamine", category: "Nội thất", image: "/images/interior/interior78.webp" },
    ],
    image: "/images/interior/interior16.webp",
    icon: serviceIcons[2],
  },
  {
    id: 3,
    slug: "mai-che-nhua-dac-composite",
    title: "Mái che và tấm lợp composite",
    subtitle: "Lắp đặt đúng cấu kiện",
    summary:
      "Chúng tôi lắp đặt mái che, mái hiên và tấm lợp composite cho các công trình cần chống nắng, chống mưa và giảm nhiệt. Hệ thống được tính toán phù hợp với điều kiện thời tiết, góc nghiêng và tải trọng thực tế. Bên cạnh việc đảm bảo độ bền, chúng tôi cũng chú trọng đến cách phối hợp với kết cấu sẵn có để việc thi công diễn ra thuận lợi và an toàn.",
    fullDescription:
      "Mái che và tấm lợp composite được triển khai cho các công trình dân dụng và công nghiệp với phương án phù hợp từng khu vực. Chúng tôi ưu tiên độ kín nước, khả năng chịu lực và sự ổn định lâu dài trong điều kiện sử dụng thực tế.",
    desc: "Thi công mái che, mái hiên và tấm lợp composite với lớp bảo vệ chống tia UV và khả năng cách nhiệt tốt.",
    features: [
      { title: "Chống tia UV", description: "Bảo vệ khỏi ánh nắng gắt và giảm nhiệt độ dưới mái." },
      { title: "Chịu lực tốt", description: "Phù hợp với mái hiên, mái che và công trình có điều kiện thời tiết khắc nghiệt." },
      { title: "Thiết kế linh hoạt", description: "Dễ tích hợp với kết cấu sắt, thép hoặc khung nhôm." },
    ],
    benefits: ["Cách nhiệt", "Chống thấm", "Dễ bảo trì", "Thi công thuận tiện"],
    process: [
      { title: "Căn chỉnh", description: "Xác định góc nghiêng, tải trọng và chiều dài mái." },
      { title: "Sản xuất", description: "Gia công cấu kiện và tấm lợp theo bản vẽ." },
      { title: "Lắp đặt", description: "Đảm bảo kết nối chắc chắn, kín nước và thẩm mỹ." },
    ],
    gallery: [
      "/images/canopies/canopy03.webp",
      "/images/canopies/canopy08.webp",
    ],
    faq: [
      { question: "Mái che có phù hợp cho khu vực nắng gắt không?", answer: "Có, tấm composite chống tia UV giúp giảm nhiệt và bảo vệ không gian dưới mái." },
    ],
    seo: {
      title: "Dịch vụ mái che và tấm lợp composite",
      description: "Thi công mái che và tấm lợp composite phù hợp cho không gian ngoài trời và công trình dân dụng.",
      keywords: ["mái che composite", "tấm lợp", "chống tia UV"],
      canonical: "/services/mai-che-nhua-dac-composite",
    },
    schema: {
      "@type": "Service",
      name: "Mái che và tấm lợp composite",
      serviceType: "Roofing systems",
    },
    relatedProjects: [
      { title: "Khung thép và cửa cổng công nghiệp", slug: "khung-thep-cua-cong", category: "Kết cấu thép", image: "/images/gates/gate01.webp" },
    ],
    image: "/images/canopies/canopy03.webp",
    icon: serviceIcons[3],
  },
  {
    id: 4,
    slug: "ket-cau-thep-cua-cong",
    title: "Kết cấu thép và cửa cổng công nghiệp",
    subtitle: "Thi công theo bản vẽ",
    summary:
      "Chúng tôi thực hiện kết cấu thép, cửa cổng và các chi tiết gia công CNC theo bản vẽ và thông số kỹ thuật đã thống nhất. Mỗi cấu kiện được gia công cẩn trọng, xử lý bề mặt đúng quy trình và lắp dựng theo đúng vị trí. Phương pháp làm việc rõ ràng giúp giảm sai sót, kiểm soát tiến độ và đảm bảo công trình ổn định trong quá trình vận hành.",
    fullDescription:
      "Đại Hải Phát triển khai kết cấu thép, cửa cổng và chi tiết gia công CNC đáp ứng nhu cầu kỹ thuật, độ bền và tiến độ thi công. Chúng tôi phối hợp giữa thiết kế, gia công và lắp dựng để công trình vận hành ổn định lâu dài.",
    desc: "Thi công khung thép, cửa cổng và các chi tiết cơ khí theo kích thước và tải trọng thực tế.",
    features: [
      { title: "Gia công CNC", description: "Đảm bảo độ chính xác cao cho các chi tiết kết cấu và cửa cổng." },
      { title: "Mạ sơn chống gỉ", description: "Tăng tuổi thọ và khả năng chống ăn mòn." },
      { title: "Thi công theo bản vẽ", description: "Triển khai đúng kích thước, đúng tiến độ và đúng tiêu chuẩn kỹ thuật." },
    ],
    benefits: ["Độ chắc chắn cao", "Tiến độ kiểm soát", "Tối ưu chi phí", "Dễ bảo trì"],
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
      description: "Thi công kết cấu thép, cửa cổng và chi tiết cơ khí CNC theo tiêu chuẩn kỹ thuật và tiến độ rõ ràng.",
      keywords: ["kết cấu thép", "cửa cổng", "gia công CNC"],
      canonical: "/services/ket-cau-thep-cua-cong",
    },
    schema: {
      "@type": "Service",
      name: "Kết cấu thép và cửa cổng công nghiệp",
      serviceType: "Steel structure fabrication",
    },
    relatedProjects: [
      { title: "Mái che composite chịu lực", slug: "mai-che-nhua-dac-composite", category: "Composite", image: "/images/canopies/canopy03.webp" },
    ],
    image: "/images/gates/gate01.webp",
    icon: serviceIcons[4],
  },
];
