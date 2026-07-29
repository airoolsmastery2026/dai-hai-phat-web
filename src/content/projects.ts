import type { ProjectItem } from "@/types/content";

const projectDrafts: ProjectItem[] = [
  {
    id: 1,
    slug: "thi-cong-vach-ngan-composite-cao-cap",
    title: "Thi công vách ngăn composite cao cấp",
    category: "Composite",
    location: "Long An",
    year: "2024",
    client: "Công ty TNHH Tân Phúc",
    description: "Triển khai hệ thống vách ngăn và ốp composite cho không gian thương mại, giữ được sự đồng bộ về hình thức và độ bền trong sử dụng.",
    challenge: "Không gian có nhiều góc và cần xử lý khe hở, độ ẩm và màu sắc đồng bộ với kiến trúc hiện có.",
    solution: "Áp dụng tấm composite phù hợp, khung nhôm chính xác và quy trình lắp đặt chặt chẽ để hoàn thiện toàn bộ mặt dựng đúng tiến độ.",
    workflow: [
      { title: "Khảo sát và đo đạc", description: "Đo đạc thực tế, xác định kích thước và điều kiện môi trường thi công." },
      { title: "Gia công chi tiết", description: "Cắt, định hình và xử lý bề mặt theo bản vẽ kỹ thuật." },
      { title: "Lắp dựng và hoàn thiện", description: "Lắp đặt tấm composite, kiểm tra độ phẳng và hoàn tất lớp phủ." },
    ],
    materials: ["Composite chống ẩm", "Khung nhôm", "Keo chuyên dụng", "Phụ kiện inox"],
    technologies: ["Thiết kế bản vẽ 3D", "Gia công CNC", "Lắp dựng theo tiêu chuẩn", "Kiểm tra chất lượng 360°"],
    gallery: [
      "/images/interior/interior16.webp",
      "/images/interior/interior71.webp",
    ],
    beforeImages: [],
    afterImages: [],
    statistics: [
      { label: "Diện tích hoàn thiện", value: "280m²" },
      { label: "Thời gian thi công", value: "14 ngày" },
      { label: "Tỷ lệ đúng tiến độ", value: "100%" },
    ],
    testimonial: {
      quote: "Đội ngũ triển khai làm việc đúng tiến độ và tạo ra bề mặt hoàn thiện khá tốt.",
      author: "Ông Minh Đức",
      role: "Giám đốc vận hành",
    },
    faq: [
      { question: "Dự án có cần thiết kế riêng không?", answer: "Có, chúng tôi phối hợp đo đạc và tư vấn để tối ưu chi tiết phù hợp không gian thực tế." },
    ],
    seo: {
      title: "Thi công vách ngăn composite cao cấp",
      description: "Tư vấn và thi công vách ngăn composite, ốp tường và mặt dựng nội thất với kết quả đồng bộ và bền bỉ.",
      keywords: ["vách ngăn composite", "thi công nội thất", "ốp composite"],
      canonical: "/projects/thi-cong-vach-ngan-composite-cao-cap",
    },
    schema: {
      "@type": "CreativeWork",
      name: "Thi công vách ngăn composite cao cấp",
      description: "Dự án thi công vách ngăn composite cao cấp cho không gian thương mại.",
    },
    image: "/images/interior/interior16.webp",
    summary: "Dự án được triển khai theo phương án cụ thể, đúng kích thước và phù hợp với điều kiện thực tế của công trình.",
  },
  {
    id: 2,
    slug: "khung-thep-cua-cong-cong-nghiep",
    title: "Cửa cổng và hàng rào nhà ở",
    category: "Cơ khí dân dụng",
    location: "Bình Dương",
    year: "2023",
    client: "Hồ sơ chưa xác minh",
    description: "Thiết kế và lắp đặt cửa cổng, hàng rào theo kích thước thực tế của nhà ở.",
    challenge: "Cần hài hòa giữa an toàn, thao tác sử dụng, độ bền bề mặt và kiến trúc mặt tiền.",
    solution: "Khảo sát hiện trạng, chốt kiểu dáng và vật liệu trước khi gia công, sau đó lắp đặt và kiểm tra vận hành tại công trình.",
    workflow: [
      { title: "Khảo sát", description: "Đo kích thước, kiểm tra vị trí lắp đặt và nhu cầu sử dụng." },
      { title: "Gia công", description: "Cắt, hàn và xử lý bề mặt cho từng chi tiết." },
      { title: "Lắp đặt", description: "Lắp tại công trình và kiểm tra độ thẳng, chắc chắn, vận hành." },
    ],
    materials: ["Thép hộp", "Phụ kiện cửa cổng", "Sơn hoàn thiện", "Liên kết cơ khí"],
    technologies: ["Đo hiện trạng", "Gia công theo kích thước", "Hàn và xử lý bề mặt", "Kiểm tra vận hành"],
    gallery: [
      "/images/gates/gate01.webp",
      "/images/gates/gate03.webp",
    ],
    beforeImages: [],
    afterImages: [],
    statistics: [
      { label: "Kích thước", value: "Chưa xác minh" },
      { label: "Vật liệu", value: "Chưa xác minh" },
      { label: "Thời gian thi công", value: "Chưa xác minh" },
    ],
    testimonial: {
      quote: "Chưa có phản hồi khách hàng được xác minh để xuất bản.",
      author: "Chưa xác minh",
      role: "Khách hàng dân dụng",
    },
    faq: [
      { question: "Có hỗ trợ bảo trì sau thi công không?", answer: "Có, chúng tôi cung cấp hỗ trợ kiểm tra và bảo trì định kỳ sau khi bàn giao." },
    ],
    seo: {
      title: "Thi công cửa cổng và hàng rào nhà ở",
      description: "Thiết kế, gia công và lắp đặt cửa cổng, hàng rào theo hiện trạng nhà ở.",
      keywords: ["cửa cổng nhà ở", "hàng rào", "cơ khí dân dụng"],
      canonical: "/projects/khung-thep-cua-cong-cong-nghiep",
    },
    schema: {
      "@type": "CreativeWork",
      name: "Cửa cổng và hàng rào nhà ở",
      description: "Hồ sơ cửa cổng và hàng rào dân dụng chưa xác minh để xuất bản.",
    },
    image: "/images/gates/gate01.webp",
    summary: "Phù hợp cho nhà phố, biệt thự và các nhu cầu hoàn thiện mặt tiền theo kích thước thực tế.",
  },
  {
    id: 3,
    slug: "noi-that-phong-ngu-mdf-melamine",
    title: "Nội thất phòng ngủ MDF melamine",
    category: "Nội thất",
    location: "Đồng Nai",
    year: "2022",
    client: "Gia đình anh Thanh",
    description: "Thiết kế và triển khai nội thất phòng ngủ bằng MDF lõi xanh phủ melamine, tối ưu lưu trữ mà vẫn giữ vẻ hiện đại.",
    challenge: "Không gian nhỏ cần tối ưu lưu trữ nhưng vẫn giữ được vẻ ngoài nhẹ và sang trọng.",
    solution: "Tối ưu bố cục, gia công từng chi tiết theo kích thước thực tế và lựa chọn vật liệu bền, chống ẩm.",
    workflow: [
      { title: "Tư vấn thiết kế", description: "Lựa chọn phong cách, vật liệu và bố cục phù hợp với tiện ích sử dụng." },
      { title: "Gia công", description: "Cắt CNC, sơn phủ và lắp ráp chi tiết theo bản vẽ." },
      { title: "Hoàn thiện", description: "Lắp đặt nội thất và kiểm tra tính thẩm mỹ, sử dụng." },
    ],
    materials: ["MDF lõi xanh", "Melamine", "Phụ kiện bản lề", "Gỗ veneer"],
    technologies: ["Thiết kế tối ưu không gian", "Gia công CNC", "Phủ melamine cao cấp", "Lắp dựng tinh tế"],
    gallery: [
      "/images/interior/interior78.webp",
      "/images/interior/interior86.webp",
    ],
    beforeImages: [],
    afterImages: [],
    statistics: [
      { label: "Tổng chi tiết", value: "42 bộ" },
      { label: "Tủ lưu trữ", value: "10 đơn vị" },
      { label: "Hoàn thiện", value: "100%" },
    ],
    testimonial: {
      quote: "Không gian phòng ngủ trở nên gọn gàng, hiện đại và tối ưu sử dụng hơn rất nhiều.",
      author: "Chị Hạnh",
      role: "Khách hàng",
    },
    faq: [
      { question: "Có thể thay đổi màu sắc sau khi thi công không?", answer: "Có thể phối hợp đổi màu và bố cục trước khi sản xuất để phù hợp phong cách sử dụng." },
    ],
    seo: {
      title: "Thi công nội thất phòng ngủ MDF melamine",
      description: "Thiết kế và thi công nội thất phòng ngủ MDF melamine theo phong cách hiện đại và tối ưu không gian.",
      keywords: ["nội thất phòng ngủ", "MDF melamine", "tủ giường"],
      canonical: "/projects/noi-that-phong-ngu-mdf-melamine",
    },
    schema: {
      "@type": "CreativeWork",
      name: "Nội thất phòng ngủ MDF melamine",
      description: "Dự án thiết kế và thi công nội thất phòng ngủ MDF melamine.",
    },
    image: "/images/interior/interior78.webp",
    summary: "Kết hợp thiết kế thực tế, gia công cẩn thận và hoàn thiện bề mặt theo tiêu chuẩn rõ ràng.",
  },
];

export const UNVERIFIED_PROJECT_DRAFTS = {
  publicationStatus: "unverified" as const,
  items: projectDrafts,
};
export const PROJECTS: ProjectItem[] = [];
export const FEATURED_PROJECTS = PROJECTS;
