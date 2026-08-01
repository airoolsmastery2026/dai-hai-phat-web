import type { BlogPost } from "@/types/content";

export const ARTICLES: BlogPost[] = [
  {
    id: 1,
    slug: "giai-phap-thiet-ke-tu-quan-ao-go-mdf-melamine",
    aiService: "Nội thất",
    title: "Checklist thiết kế tủ quần áo MDF và cánh kính trước khảo sát",
    category: "Nội thất lưu trữ",
    excerpt:
      "Các dữ liệu cần xác nhận trước khi chọn cốt MDF, bề mặt hoàn thiện, cánh kính và phụ kiện cho tủ quần áo.",
    content:
      "Phương án tủ chỉ đủ cơ sở kỹ thuật khi có kích thước vị trí lắp đặt, điều kiện ẩm, nhu cầu lưu trữ, mẫu màu và mã vật liệu. Khả năng chịu ẩm, bảo hành và độ bền phải đối chiếu theo tài liệu của đúng sản phẩm được chọn; không suy rộng từ tên gọi chung.",
    highlights: [
      "Đo chiều rộng, chiều cao và chiều sâu khả dụng",
      "Xác nhận mã cốt, bề mặt và tài liệu nhà cung cấp",
      "Chốt loại cánh, ray, bản lề và nhu cầu chiếu sáng",
    ],
    image: "/images/reference/tu-ao-phong-ngu-go-canh-kinh-v1.webp",
  },
  {
    id: 2,
    slug: "mau-giuong-ngu-khung-thep-go-mdf-melamine",
    aiService: "Nội thất",
    title: "Dữ liệu cần có trước khi thiết kế giường khung thép kết hợp MDF",
    category: "Nội thất phòng ngủ",
    excerpt:
      "Kích thước nệm, tải trọng sử dụng, cấu tạo liên kết và yêu cầu lưu trữ cần được xác nhận trước khi tính kết cấu.",
    content:
      "Khả năng chịu tải của giường phụ thuộc tiết diện thép, độ dày, nhịp, mối nối và điều kiện kê đỡ. Không dùng một con số tải trọng chung khi chưa có bản vẽ và tính toán cho đúng cấu hình. Phần MDF, phụ kiện và bề mặt hoàn thiện cũng cần chốt theo mẫu vật liệu thực tế.",
    highlights: [
      "Xác nhận kích thước nệm và không gian lắp đặt",
      "Thu thập tải trọng và thói quen sử dụng",
      "Chốt tiết diện, liên kết và phương án lưu trữ",
    ],
    image: "/images/interior/interior07.webp",
  },
  {
    id: 3,
    slug: "thi-cong-mai-che-composite-chong-tia-uv",
    aiService: "Mái che",
    title: "Checklist khảo sát mái che và tấm lấy sáng trước khi chọn vật liệu",
    category: "Mái che",
    excerpt:
      "Vị trí, kích thước, thoát nước, tải gió và hồ sơ kỹ thuật của tấm lợp là dữ liệu bắt buộc trước khi lập phương án.",
    content:
      "Tấm lợp và hệ khung phải được lựa chọn theo điều kiện công trình thực tế. Tính năng chống tia UV, giới hạn nhịp, bảo hành và tuổi thọ chỉ được ghi vào Proposal khi có tài liệu của đúng mã sản phẩm. Khảo sát cũng cần xác định điểm neo, hướng thoát nước và khả năng tiếp cận để bảo trì.",
    highlights: [
      "Đo khẩu độ, cao độ và hướng thoát nước",
      "Xác nhận điểm neo và điều kiện gió tại vị trí",
      "Đối chiếu mã tấm với tài liệu kỹ thuật và bảo hành",
    ],
    image: "/images/reference/lap-dat-mai-che-khung-thep-v1.webp",
  },
  {
    id: 4,
    slug: "trang-tri-vach-tuong-tivi-composite-lam-song",
    aiService: "Cải tạo không gian",
    title: "Checklist bố trí vách tivi, tấm ốp và hệ dây trước thi công",
    category: "Vách trang trí",
    excerpt:
      "Kích thước tivi, nền tường, ổ điện, đường dây và mẫu vật liệu cần được chốt cùng một bản bố trí.",
    content:
      "Một phương án vách tivi cần bắt đầu từ hiện trạng tường và vị trí thiết bị. Kích thước tivi, cao độ xem, ổ điện, đường tín hiệu, tải của kệ và khe bảo trì phải được thể hiện trên bản vẽ. Màu sắc và bề mặt chỉ được duyệt theo mẫu vật liệu đã xác nhận.",
    highlights: [
      "Đo tường, tivi và khoảng nhìn sử dụng",
      "Lập sơ đồ ổ điện, đường dây và khe bảo trì",
      "Duyệt mẫu bề mặt trước khi gia công",
    ],
    image: "/images/reference/thi-cong-op-lam-noi-that-v1.webp",
  },
  {
    id: 5,
    slug: "checklist-cong-truot-nha-pho-truoc-gia-cong",
    aiService: "Cửa cổng",
    title: "Checklist cổng trượt nhà phố trước khi chốt bản vẽ gia công",
    category: "Cửa cổng",
    excerpt:
      "Khẩu độ, khoảng lùi cánh, ray dẫn hướng, nền sân và phương án vận hành cần được xác nhận cùng một bản vẽ.",
    content:
      "Cổng trượt chỉ có thể chốt phương án sau khi đo khẩu độ thông thủy, chiều dài khoảng lùi, cao độ nền và vị trí các điểm liên kết. Kiểu nan, vật liệu điểm nhấn, hệ sơn, bánh xe, ray và phương án vận hành phải được ghi rõ. Mẫu hình chỉ để định hướng thẩm mỹ; kích thước và cấu tạo cần kỹ sư xác nhận tại công trình.",
    highlights: [
      "Đo khẩu độ, khoảng lùi và độ phẳng của nền chạy ray",
      "Chốt kiểu nan, khung, bề mặt và vị trí tay nắm",
      "Xác nhận vận hành thủ công hay tự động trước khi gia công",
    ],
    image: "/images/reference/cong-truot-nha-pho-walnut-v1.webp",
  },
  {
    id: 6,
    slug: "duyet-du-lieu-noi-that-truoc-khi-vao-xuong",
    aiService: "Nội thất",
    title: "Dữ liệu cần duyệt trước khi nội thất vào xưởng gia công",
    category: "Quy trình nội thất",
    excerpt:
      "Bản vẽ kích thước, mã bề mặt, phụ kiện và vị trí thiết bị cần được khóa phiên bản trước khi cắt tấm.",
    content:
      "Trước khi vào xưởng, hồ sơ cần có bản vẽ đã duyệt, kích thước khảo sát cuối cùng, mã cốt và bề mặt, danh mục phụ kiện cùng vị trí điện nước liên quan. Bước lắp thử và kiểm tra đường chéo giúp phát hiện sai lệch sớm, nhưng không thay thế việc xác nhận hiện trạng tại công trình.",
    highlights: [
      "Khóa phiên bản bản vẽ và kích thước khảo sát cuối",
      "Đối chiếu mã vật liệu, phụ kiện và chiều mở cánh",
      "Kiểm tra lắp ráp, đường chéo và điểm liên kết trước giao hàng",
    ],
    image: "/images/reference/xuong-noi-that-kiem-tra-lap-rap-v1.webp",
  },
  {
    id: 7,
    slug: "checklist-cau-thang-lan-can-truoc-gia-cong",
    aiService: "Cầu thang và lan can",
    title: "Checklist cầu thang và lan can trước khi gia công",
    category: "Cầu thang và lan can",
    excerpt:
      "Cao độ, lối đi, vị trí liên kết, tay vịn và khoảng hở cần được đo trực tiếp trước khi chốt cấu tạo.",
    content:
      "Mẫu cầu thang giúp thống nhất ngôn ngữ vật liệu nhưng không quyết định kích thước gia công. Kỹ sư cần đo cao độ, bề rộng lối đi, vị trí dầm hoặc tường liên kết, bậc hoàn thiện và các khoảng hở. Loại đá, gỗ, kim loại, phụ kiện và bề mặt phải được duyệt theo mẫu thực tế.",
    highlights: [
      "Đo cao độ, chiều rộng lối đi và bậc hoàn thiện",
      "Xác nhận vị trí liên kết và cấu tạo tay vịn",
      "Duyệt mẫu đá, gỗ, kim loại và bề mặt trước gia công",
    ],
    image: "/images/reference/cau-thang-lan-can-walnut-champagne-v1.webp",
  },
];
