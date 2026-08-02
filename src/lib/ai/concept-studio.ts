export const AI_CONCEPT_MODEL = "gemini-3-pro-image";

export const AI_CONCEPT_VIEWS = [
  {
    id: "front",
    node: "C1 → D",
    title: "Phối cảnh chính diện",
    description: "Góc nhìn tổng thể để kiểm tra bố cục, tỷ lệ và màu sắc.",
  },
  {
    id: "left",
    node: "C2 → E",
    title: "Phối cảnh góc trái",
    description: "Thể hiện chiều sâu, liên kết bên trái và độ dày kết cấu.",
  },
  {
    id: "right",
    node: "C3 → F",
    title: "Phối cảnh góc phải",
    description: "Thể hiện chiều sâu, phụ kiện và liên kết bên phải.",
  },
  {
    id: "detail",
    node: "C4 → G",
    title: "Chi tiết vật liệu",
    description: "Ảnh cận cảnh vật liệu, mối nối và cấu tạo quan trọng.",
  },
] as const;

export type AIConceptView = (typeof AI_CONCEPT_VIEWS)[number]["id"];

export function isAIConceptView(value: string): value is AIConceptView {
  return AI_CONCEPT_VIEWS.some((view) => view.id === value);
}
