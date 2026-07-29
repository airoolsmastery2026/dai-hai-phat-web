import type {
  HomeAboutContent,
  HomeContactContent,
  HomeHeroContent,
  HomeSectionContent,
} from "@/types/content";

export const HOME_HERO_CONTENT: HomeHeroContent = {
  eyebrow: "Nội thất & cơ khí dân dụng",
  title: "Thiết kế và thi công không gian sống theo nhu cầu thực tế.",
  highlights: ["Thi công thực tế", "Tư vấn kỹ thuật", "Hỗ trợ sau bàn giao"],
  primaryCtaLabel: "Lập hồ sơ tư vấn",
  primaryCtaHref: "/#ai-office",
  secondaryCtaLabel: "Xem công trình",
  secondaryCtaHref: "/gallery",
  imageAlt: "Đội ngũ thi công thực hiện công việc tại công trình",
};

export const HOME_SERVICES_SECTION: HomeSectionContent = {
  eyebrow: "Dịch vụ",
  title: "Các hạng mục được triển khai rõ ràng, đúng tiến độ và phù hợp với điều kiện công trình.",
  intro: "Chúng tôi làm việc theo từng bước để khách hàng có thể theo dõi tiến độ và nắm được tình hình thực hiện từ đầu đến cuối.",
};

export const HOME_PROJECTS_SECTION: HomeSectionContent = {
  eyebrow: "Dự án",
  title: "Mỗi công trình phản ánh cách chúng tôi phối hợp kỹ thuật, thi công và bàn giao với cẩn trọng.",
  intro: "Các dự án được chọn lọc để thể hiện phương pháp làm việc thực tế, đúng chuẩn và phù hợp với nhu cầu sử dụng.",
  ctaLabel: "Xem toàn bộ dự án",
  ctaHref: "/projects",
};

export const HOME_ABOUT_CONTENT: HomeAboutContent = {
  eyebrow: "Về Đại Hải Phát",
  title: "Đồng hành từ khảo sát đến hoàn thiện không gian sống.",
  description:
    "Đại Hải Phát tập trung vào nội thất và các hạng mục cơ khí dân dụng, triển khai đúng phương án, đúng tiến độ và phù hợp với nhu cầu sử dụng của từng gia đình.",
  badge: "Khảo sát trước khi chốt phương án",
};

export const HOME_CONTACT_CONTENT: HomeContactContent = {
  eyebrow: "Liên hệ",
  title: "Chúng tôi sẵn sàng trao đổi về nhu cầu và phạm vi công trình của quý khách.",
  description: "Hãy gửi thông tin sơ bộ để chúng tôi có thể tư vấn hướng làm việc phù hợp nhất.",
  nameLabel: "Họ và tên",
  phoneLabel: "Số điện thoại",
  messageLabel: "Thông tin công trình",
  submitLabel: "Gửi yêu cầu",
  namePlaceholder: "Nhập họ và tên",
  phonePlaceholder: "Nhập số điện thoại",
  messagePlaceholder: "Mô tả nhu cầu và phạm vi công việc",
};
