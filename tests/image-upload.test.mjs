import assert from "node:assert/strict";
import test from "node:test";

import {
  ImageUploadValidationError,
  MAX_IMAGE_BYTES,
  MAX_PROJECT_IMAGES,
  MAX_TOTAL_IMAGE_BYTES,
  validateProjectImageFiles,
} from "../src/lib/ai/image-upload.ts";

function image(name, type = "image/jpeg", size = 1024) {
  return { name, type, size };
}

function assertValidationError(files, expectedMessage) {
  assert.throws(
    () => validateProjectImageFiles(files),
    (error) => {
      assert.ok(error instanceof ImageUploadValidationError);
      assert.equal(error.message, expectedMessage);
      return true;
    },
  );
}

test("accepts supported image formats and returns a new array", () => {
  const files = [
    image("hien-trang.jpg", "image/jpeg"),
    image("mat-bang.png", "image/png"),
    image("phoi-canh.webp", "image/webp"),
  ];

  const result = validateProjectImageFiles(files);

  assert.deepEqual(result, files);
  assert.notStrictEqual(result, files);
});

test("rejects an empty selection", () => {
  assertValidationError([], "Vui lòng chọn ít nhất một ảnh hiện trạng.");
});

test("rejects more than the maximum number of images", () => {
  const files = Array.from({ length: MAX_PROJECT_IMAGES + 1 }, (_, index) =>
    image(`anh-${index + 1}.jpg`),
  );

  assertValidationError(
    files,
    `Chỉ chọn tối đa ${MAX_PROJECT_IMAGES} ảnh cho mỗi hồ sơ.`,
  );
});

test("rejects unsupported image formats", () => {
  assertValidationError(
    [image("ban-ve.gif", "image/gif")],
    "Ảnh “ban-ve.gif” không đúng định dạng JPG, PNG hoặc WebP.",
  );
});

test("rejects empty image files", () => {
  assertValidationError(
    [image("rong.jpg", "image/jpeg", 0)],
    "Ảnh “rong.jpg” đang trống.",
  );
});

test("accepts a file exactly at the per-image size limit", () => {
  assert.doesNotThrow(() =>
    validateProjectImageFiles([
      image("gioi-han.webp", "image/webp", MAX_IMAGE_BYTES),
    ]),
  );
});

test("rejects a file above the per-image size limit", () => {
  assertValidationError(
    [image("qua-lon.png", "image/png", MAX_IMAGE_BYTES + 1)],
    "Ảnh “qua-lon.png” vượt quá giới hạn 8 MB.",
  );
});

test("accepts files exactly at the total size limit", () => {
  const files = [
    image("anh-1.jpg", "image/jpeg", MAX_IMAGE_BYTES),
    image("anh-2.jpg", "image/jpeg", MAX_IMAGE_BYTES),
    image("anh-3.jpg", "image/jpeg", MAX_IMAGE_BYTES),
  ];

  assert.equal(
    files.reduce((total, file) => total + file.size, 0),
    MAX_TOTAL_IMAGE_BYTES,
  );
  assert.doesNotThrow(() => validateProjectImageFiles(files));
});

test("rejects files above the total size limit", () => {
  const files = [
    image("anh-1.jpg", "image/jpeg", MAX_IMAGE_BYTES),
    image("anh-2.jpg", "image/jpeg", MAX_IMAGE_BYTES),
    image("anh-3.jpg", "image/jpeg", MAX_IMAGE_BYTES),
    image("anh-4.jpg", "image/jpeg", 1),
  ];

  assertValidationError(
    files,
    "Tổng dung lượng ảnh vượt quá 24 MB. Vui lòng chọn ít ảnh hơn hoặc ảnh nhẹ hơn.",
  );
});
