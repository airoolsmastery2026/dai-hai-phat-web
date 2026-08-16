import type { ConversationHistoryItem } from "@/lib/ai";
import {
  getContactVerificationAcknowledgement,
  type ContactVerificationReceipt,
} from "@/lib/ai/contact-verification";

export function buildConversationAcknowledgement(
  item: ConversationHistoryItem | undefined,
  receipt: ContactVerificationReceipt | null,
): string | null {
  if (!item) return null;

  if (
    receipt &&
    (item.field === "phone" || item.field === "email" || item.field === "zalo") &&
    receipt.field === item.field
  ) {
    return getContactVerificationAcknowledgement(receipt);
  }

  switch (item.field) {
    case "intentGroup":
      return "Tôi đã xác định đúng nhóm nhu cầu để không hỏi lan man. Tiếp theo chỉ lấy các dữ liệu cần cho hướng xử lý này.";
    case "intent":
      return `Mục tiêu hiện tại là ${item.value.toLowerCase()}. Tôi sẽ ưu tiên các câu hỏi có ảnh hưởng trực tiếp đến mục tiêu đó.`;
    case "service":
      return `Đã rõ hạng mục ${item.value.toLowerCase()}. Tôi sẽ hỏi tiếp các dữ liệu ảnh hưởng trực tiếp đến khảo sát và phương án.`;
    case "projectType":
      return `${item.value} đã được ghi vào loại công trình. Thông tin này ảnh hưởng cách khảo sát, cấu tạo và điều kiện thi công.`;
    case "location":
      return `Khu vực ${item.value} đã được ghi nhận để chuẩn bị phạm vi khảo sát và kế hoạch di chuyển; địa chỉ cụ thể sẽ được kiểm tra ở bước bàn giao.`;
    case "dimensions":
      return item.value === "Cần khảo sát đo đạc"
        ? "Chưa có kích thước là bình thường. Tôi đánh dấu bắt buộc đo lại tại hiện trường trước khi chốt cấu tạo hoặc báo giá."
        : "Kích thước này chỉ được coi là số liệu sơ bộ. Kỹ sư phải kiểm tra lại tại hiện trường trước khi chốt cấu tạo hoặc báo giá.";
    case "style":
      return `${item.value} được dùng làm định hướng thẩm mỹ, không phải ràng buộc kỹ thuật. Phương án cuối vẫn phải phù hợp hiện trạng và vật liệu.`;
    case "material":
      return `${item.value} đang là vật liệu ưu tiên, chưa phải vật liệu đã chốt. Kỹ sư sẽ đối chiếu độ bền, cấu tạo, môi trường sử dụng và ngân sách trước khi xác nhận.`;
    case "budget":
      return `${item.value} được dùng làm khoảng đầu tư định hướng, không phải báo giá. Chi phí chỉ được xác nhận sau khi đủ kích thước, vật liệu và điều kiện thi công.`;
    case "timeline":
      return `${item.value} là mốc lập kế hoạch ban đầu. Lịch thực tế còn phụ thuộc khảo sát, duyệt phương án, vật tư và năng lực thi công.`;
    case "priority":
      return `Ưu tiên chính là ${item.value.toLowerCase()}. Tôi sẽ dùng ưu tiên này để cân bằng vật liệu, cấu tạo, chi phí và tiến độ ở phần đề xuất.`;
    case "surveyWindow":
      return "Khung khảo sát đã được ghi nhận như một đề nghị thời gian. Kỹ sư vẫn cần xác nhận lịch cụ thể trước khi đến công trình.";
    case "quoteRequest":
      return `${item.value} là đầu ra anh/chị muốn nhận. Nếu là báo giá chính thức, hệ thống sẽ không coi dữ liệu sơ bộ là đủ nếu chưa được kỹ sư xác minh.`;
    case "name":
      return "Tên liên hệ đã qua kiểm tra chất lượng văn bản. Tôi chỉ dùng thông tin này để lập hồ sơ và xưng hô khi bàn giao.";
    case "phone":
    case "zalo":
      return "Số liên hệ đã qua kiểm tra định dạng ở thiết bị và server. Trạng thái mạng của lần kiểm tra gần nhất không còn trong bộ nhớ giao diện, vì vậy hệ thống không suy diễn là đã xác minh; quyền sở hữu vẫn cần OTP hoặc xác nhận thực tế.";
    case "email":
      return "Email đã qua kiểm tra định dạng ở thiết bị và server. Trạng thái DNS của lần kiểm tra gần nhất không còn trong bộ nhớ giao diện, vì vậy hệ thống không suy diễn hộp thư đã được xác minh.";
    case "surveyAddress":
      return "Địa chỉ đã đủ cấu trúc để lập yêu cầu khảo sát. Đội ngũ vẫn phải xác nhận lại vị trí trước khi di chuyển tới công trình.";
    default:
      return null;
  }
}
