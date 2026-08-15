export const AI_CONCEPT_MODEL = "gemini-3-pro-image";

export const AI_CONCEPT_PRESENTATION_TRANSFORM = {
  id: "technical-line-to-photoreal",
  durationSeconds: 5,
  cameraMotion: "slow-push-in",
  technicalDrawingPrompt:
    "Chuyển phối cảnh này thành bản vẽ trình bày kiến trúc chỉ dùng nét đen sạch trên nền sáng. Giữ nguyên góc máy, đường chân trời, điểm tụ, crop, tỷ lệ, hình học, vị trí tường, trần, sàn, cửa, đồ nội thất và các chi tiết chính. Không thêm chữ, kích thước, logo, watermark, người hoặc vật thể mới.",
  videoPrompt:
    "Tạo chuyển cảnh kiến trúc điện ảnh dài 5 giây từ bản vẽ nét kỹ thuật sang chính phối cảnh photorealistic tương ứng. Camera chỉ slow push-in nhẹ; giữ nguyên góc máy, đường chân trời, điểm tụ, crop, tỷ lệ và bố cục. Cho linework chuyển dần thành hình học 3D, vật liệu, ánh sáng tự nhiên, bóng đổ và phản xạ; không đổi thiết kế, không thêm vật thể, không làm camera drift hoặc biến dạng hình học.",
} as const;

export const AI_CONCEPT_VIEWS = [
  {
    id: "front",
    node: "C1 → D",
    title: "Tham khảo ý tưởng · Chính diện",
    description:
      "Góc nhìn tham khảo để trao đổi bố cục, tỷ lệ và màu sắc trước khi kỹ sư xác nhận.",
  },
  {
    id: "left",
    node: "C2 → E",
    title: "Tham khảo ý tưởng · Góc trái",
    description:
      "Góc nhìn tham khảo về chiều sâu, liên kết bên trái và độ dày kết cấu.",
  },
  {
    id: "right",
    node: "C3 → F",
    title: "Tham khảo ý tưởng · Góc phải",
    description:
      "Góc nhìn tham khảo về chiều sâu, phụ kiện và liên kết bên phải.",
  },
  {
    id: "detail",
    node: "C4 → G",
    title: "Tham khảo ý tưởng · Chi tiết",
    description:
      "Hình ảnh tham khảo về vật liệu, mối nối và cấu tạo cần kỹ sư kiểm tra.",
  },
] as const;

export type AIConceptView = (typeof AI_CONCEPT_VIEWS)[number]["id"];

export function isAIConceptView(value: string): value is AIConceptView {
  return AI_CONCEPT_VIEWS.some((view) => view.id === value);
}
