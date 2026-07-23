import type {
  HomeAboutContent,
  HomeContactContent,
  HomeHeroContent,
  HomeSectionContent,
} from "@/types/content";

export const HOME_HERO_CONTENT: HomeHeroContent = {
  eyebrow: "Đối tác thi công cơ khí",
  title: "Cung cấp giải pháp thi công cơ khí và xây dựng theo từng nhu cầu thực tế.",
  highlights: ["Thi công thực tế", "Tư vấn kỹ thuật", "Hỗ trợ sau bàn giao"],
  primaryCtaLabel: "Yêu cầu báo giá",
  primaryCtaHref: "#contact",
  secondaryCtaLabel: "Xem dự án",
  secondaryCtaHref: "/projects",
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
  title: "Một đơn vị thi công đáng tin cậy trong môi trường làm việc thực tế.",
  description:
    "Đại Hải Phát tập trung vào việc triển khai công trình đúng phương án, đúng tiến độ và đúng tiêu chuẩn vận hành, để khách hàng yên tâm trong suốt quá trình thực hiện.",
  badge: "Hơn 15 năm kinh nghiệm thực hiện công trình",
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
