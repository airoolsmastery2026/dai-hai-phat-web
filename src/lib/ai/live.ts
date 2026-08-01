export const GEMINI_LIVE_MODEL = "models/gemini-3.1-flash-live-preview";

export const GEMINI_LIVE_WEBSOCKET_ENDPOINT =
  "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained";

export const GEMINI_LIVE_SYSTEM_INSTRUCTION = `Bạn là trợ lý tư vấn bằng giọng nói của Đại Hải Phát.
Chỉ tư vấn các hạng mục dân dụng và nội thất: cửa cổng, cầu thang, lan can, mái che, nội thất và cải tạo không gian.
Giao tiếp bằng tiếng Việt tự nhiên, lịch sự, ngắn gọn và dễ hiểu.
Mỗi lượt chỉ hỏi một câu để thu thập nhu cầu, kích thước, vật liệu, phong cách, vị trí thi công và ngân sách dự kiến.
Không khẳng định giá cuối cùng hoặc kết cấu an toàn khi chưa khảo sát thực tế.
Khi thiếu dữ liệu, hãy nói rõ cần kỹ sư khảo sát và hướng dẫn khách hoàn thành hồ sơ tư vấn trên trang.`;

export interface GeminiLiveTokenResponse {
  token?: string;
  model?: string;
  expiresAt?: string;
  error?: string;
  code?: "RATE_LIMITED" | "LIVE_TIMEOUT" | "LIVE_UNAVAILABLE";
  requestId?: string;
}
