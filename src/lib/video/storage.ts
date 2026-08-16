export const VIDEO_LOCAL_PREVIEW_ALLOWED_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
] as const;

export const VIDEO_LOCAL_PREVIEW_MAX_BYTES = 200 * 1024 * 1024;

export const VIDEO_STORAGE_STATUS = {
  configured: false,
  provider: null,
  message:
    "Kho lưu trữ video chưa được kết nối. File từ thiết bị chỉ được xem thử trong phiên quản trị và chưa được tải lên máy chủ.",
} as const;

export function validateLocalVideoCandidate(file: Pick<File, "name" | "size" | "type">): string | null {
  if (!VIDEO_LOCAL_PREVIEW_ALLOWED_TYPES.includes(file.type as (typeof VIDEO_LOCAL_PREVIEW_ALLOWED_TYPES)[number])) {
    return "Chỉ hỗ trợ MP4, WebM hoặc MOV ở bước xem thử.";
  }
  if (file.size > VIDEO_LOCAL_PREVIEW_MAX_BYTES) {
    return "File xem thử không được vượt quá 200 MB.";
  }
  return null;
}
