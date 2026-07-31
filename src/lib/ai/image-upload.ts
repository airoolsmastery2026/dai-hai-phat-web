export const MAX_PROJECT_IMAGES = 5;
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
export const MAX_TOTAL_IMAGE_BYTES = 24 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export class ImageUploadValidationError extends Error {}

export function validateProjectImageFiles(files: readonly File[]): File[] {
  if (files.length === 0) {
    throw new ImageUploadValidationError("Vui lòng chọn ít nhất một ảnh hiện trạng.");
  }
  if (files.length > MAX_PROJECT_IMAGES) {
    throw new ImageUploadValidationError(
      `Chỉ chọn tối đa ${MAX_PROJECT_IMAGES} ảnh cho mỗi hồ sơ.`,
    );
  }

  let totalBytes = 0;
  for (const file of files) {
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      throw new ImageUploadValidationError(
        `Ảnh “${file.name}” không đúng định dạng JPG, PNG hoặc WebP.`,
      );
    }
    if (file.size <= 0) {
      throw new ImageUploadValidationError(`Ảnh “${file.name}” đang trống.`);
    }
    if (file.size > MAX_IMAGE_BYTES) {
      throw new ImageUploadValidationError(
        `Ảnh “${file.name}” vượt quá giới hạn 8 MB.`,
      );
    }
    totalBytes += file.size;
  }

  if (totalBytes > MAX_TOTAL_IMAGE_BYTES) {
    throw new ImageUploadValidationError(
      "Tổng dung lượng ảnh vượt quá 24 MB. Vui lòng chọn ít ảnh hơn hoặc ảnh nhẹ hơn.",
    );
  }

  return [...files];
}
