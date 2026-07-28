import type { AssetMetadata } from "./types.js";

function sentence(label: string, value?: string): string | undefined {
  return value ? `${label}: ${value}.` : undefined;
}

export function generatePrompt(metadata: AssetMetadata): string {
  if (metadata.prompt) {
    return metadata.prompt;
  }

  return [
    sentence("Chủ thể", metadata.title),
    sentence("Mô tả đã xác minh", metadata.caption),
    sentence("Danh mục", metadata.category),
    sentence("Dịch vụ", metadata.service),
    sentence("Vật liệu", metadata.material),
    sentence("Phong cách", metadata.style),
    sentence("Loại công trình", metadata.projectType),
    "Giữ đúng thông tin đã xác minh; không thêm thương hiệu, vật liệu, kích thước hoặc chi tiết công trình chưa có trong metadata.",
    "Bố cục rõ chủ thể, ánh sáng tự nhiên, màu sắc trung thực, không chèn chữ hoặc watermark.",
  ]
    .filter((value): value is string => Boolean(value))
    .join(" ");
}

export function normalizeSeoKeywords(keywords: string[]): string[] {
  const normalized = keywords
    .map((keyword) => keyword.trim().toLocaleLowerCase("vi"))
    .filter(Boolean);

  return Array.from(new Set(normalized)).sort((left, right) =>
    left.localeCompare(right, "vi"),
  );
}
