import type { ConversationQuestion } from "@/lib/ai";

export type CustomerInputVerification = "not_required" | "format_only";

export type CustomerInputValidation =
  | {
      ok: true;
      value: string;
      verification: CustomerInputVerification;
      note?: string;
    }
  | {
      ok: false;
      error: string;
    };

const OBVIOUS_PLACEHOLDERS = new Set([
  "a",
  "aa",
  "aaa",
  "abc",
  "abcd",
  "asdf",
  "asdfgh",
  "demo",
  "fake",
  "qwer",
  "qwerty",
  "test",
  "testing",
  "xxx",
  "xxxx",
]);

const ADDRESS_KEYWORDS = [
  "duong",
  "phuong",
  "xa",
  "quan",
  "huyen",
  "thanh pho",
  "tp",
  "tinh",
  "khu pho",
  "ap",
  "thon",
  "hem",
  "ngo",
  "lo",
  "to",
  "block",
  "chung cu",
  "du an",
];

function collapseWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function normalizeAscii(value: string): string {
  return collapseWhitespace(value)
    .toLocaleLowerCase("vi-VN")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function containsObviousPlaceholder(value: string): boolean {
  const normalized = normalizeAscii(value);
  if (!normalized) return true;
  if (OBVIOUS_PLACEHOLDERS.has(normalized)) return true;
  const tokens = normalized.split(" ");
  return tokens.length <= 2 && tokens.every((token) => OBVIOUS_PLACEHOLDERS.has(token));
}

function looksLikeKeyboardNoise(value: string): boolean {
  const normalized = normalizeAscii(value);
  if (!normalized) return true;
  if (/(.)\1{3,}/.test(normalized.replace(/\s/g, ""))) return true;

  const words = normalized.split(" ").filter((word) => word.length >= 4);
  return words.some((word) => {
    const consonantRuns = word.match(/[bcdfghjklmnpqrstvwxz]{4,}/g) ?? [];
    return consonantRuns.some(
      (run) => !/^(?:ngh|sch|chr|str|thr|ph|th|tr|kh|ng|nh|ch|gh|gi|qu)+$/.test(run),
    );
  });
}

function looksLikeSuspiciousSingleName(value: string): boolean {
  const normalized = normalizeAscii(value);
  if (!normalized || normalized.includes(" ")) return false;
  const runs = normalized.match(/[bcdfghjklmnpqrstvwxz]{3,}/g) ?? [];
  return runs.some((run) => !/^(?:ngh|sch|chr|str|thr)$/.test(run));
}

function validateName(value: string): CustomerInputValidation {
  const normalized = collapseWhitespace(value);
  if (normalized.length < 2 || normalized.length > 80) {
    return { ok: false, error: "Vui lòng nhập tên hoặc cách xưng hô thực tế (2–80 ký tự)." };
  }
  if (!/^[A-Za-zÀ-ỹĐđ][A-Za-zÀ-ỹĐđ\s'.-]*$/.test(normalized)) {
    return { ok: false, error: "Tên chỉ nên gồm chữ cái, khoảng trắng và dấu tên thông dụng." };
  }
  const ascii = normalizeAscii(normalized);
  if (
    containsObviousPlaceholder(normalized) ||
    !/[aeiouy]/.test(ascii) ||
    looksLikeKeyboardNoise(normalized) ||
    looksLikeSuspiciousSingleName(normalized)
  ) {
    return { ok: false, error: "Tên này có vẻ chưa phải thông tin liên hệ thực tế. Vui lòng kiểm tra và nhập lại." };
  }
  return { ok: true, value: normalized, verification: "not_required" };
}

export function normalizeVietnamPhone(value: string): string | null {
  const trimmed = collapseWhitespace(value);
  if (!/^\+?[\d .()-]+$/.test(trimmed)) return null;

  let digits = trimmed.replace(/\D/g, "");
  if (digits.startsWith("84") && digits.length === 11) {
    digits = `0${digits.slice(2)}`;
  }
  if (!/^0[35789]\d{8}$/.test(digits)) return null;
  if (/^(\d)\1+$/.test(digits)) return null;
  return digits;
}

function validatePhone(value: string, label = "Số điện thoại"): CustomerInputValidation {
  const normalized = normalizeVietnamPhone(value);
  if (!normalized) {
    return {
      ok: false,
      error: `${label} Việt Nam cần 10 chữ số, bắt đầu bằng 03, 05, 07, 08 hoặc 09 (hoặc +84).`,
    };
  }
  return {
    ok: true,
    value: normalized,
    verification: "format_only",
    note: "Số đã đúng định dạng. Quyền sở hữu chỉ được xác minh khi dịch vụ xác minh trả kết quả thành công.",
  };
}

function validateEmail(value: string): CustomerInputValidation {
  const normalized = collapseWhitespace(value).toLocaleLowerCase("en-US");
  if (normalized.length > 254 || normalized.includes("..")) {
    return { ok: false, error: "Email chưa đúng định dạng." };
  }

  const match = normalized.match(/^([a-z0-9.!#$%&'*+/=?^_`{|}~-]+)@([a-z0-9-]+(?:\.[a-z0-9-]+)+)$/i);
  if (!match) return { ok: false, error: "Email chưa đúng định dạng, ví dụ ten@domain.com." };

  const [, local, domain] = match;
  if (local.length > 64 || domain.length > 253) {
    return { ok: false, error: "Email vượt quá giới hạn hợp lệ." };
  }
  const labels = domain.split(".");
  if (
    labels.some((label) => !label || label.startsWith("-") || label.endsWith("-")) ||
    !/^[a-z]{2,24}$/i.test(labels[labels.length - 1] ?? "")
  ) {
    return { ok: false, error: "Tên miền email chưa hợp lệ." };
  }
  if (["example.com", "example.org", "example.net"].includes(domain)) {
    return { ok: false, error: "Vui lòng dùng email thực tế thay vì địa chỉ minh họa." };
  }

  return {
    ok: true,
    value: normalized,
    verification: "format_only",
    note: "Email đã đúng định dạng. Quyền sở hữu chưa được xác minh nếu chưa có bước xác nhận riêng.",
  };
}

function validateAddress(value: string): CustomerInputValidation {
  const normalized = collapseWhitespace(value);
  if (normalized.length < 12 || normalized.length > 300) {
    return {
      ok: false,
      error: "Địa chỉ khảo sát cần đủ số nhà/lô, đường hoặc khu vực và tỉnh/thành.",
    };
  }
  if (!/\d/.test(normalized)) {
    return { ok: false, error: "Địa chỉ khảo sát cần có số nhà, số lô hoặc mã vị trí cụ thể." };
  }
  const ascii = normalizeAscii(normalized);
  const wordCount = ascii.split(" ").filter(Boolean).length;
  const hasAddressKeyword = ADDRESS_KEYWORDS.some((keyword) =>
    new RegExp(`(?:^| )${keyword.replace(/ /g, "\\s+")}(?: |$)`).test(ascii),
  );
  if (wordCount < 4 || !hasAddressKeyword || looksLikeKeyboardNoise(normalized)) {
    return {
      ok: false,
      error: "Địa chỉ này chưa đủ rõ để khảo sát. Hãy nhập số nhà/lô, đường hoặc khu phố, phường/xã và tỉnh/thành.",
    };
  }
  return { ok: true, value: normalized, verification: "not_required" };
}

function validateDimensions(value: string): CustomerInputValidation {
  const normalized = collapseWhitespace(value);
  const ascii = normalizeAscii(normalized);
  if (
    /^(?:chua do|chua co kich thuoc|can do|can khao sat|khong biet kich thuoc|nho ky su do)$/.test(ascii)
  ) {
    return { ok: true, value: "Cần khảo sát đo đạc", verification: "not_required" };
  }

  const hasNumber = /\d/.test(normalized);
  const hasUnit = /(?:^|\s|\d)(?:mm|cm|m|met|mét)\b/i.test(normalized);
  const hasDimensionSeparator = /\d\s*(?:x|×)\s*\d/i.test(normalized);
  if (
    normalized.length < 3 ||
    containsObviousPlaceholder(normalized) ||
    looksLikeKeyboardNoise(normalized) ||
    !hasNumber ||
    (!hasUnit && !hasDimensionSeparator)
  ) {
    return {
      ok: false,
      error: "Kích thước chưa rõ. Ví dụ: rộng 4 m × cao 2,6 m; nếu chưa đo, nhập “chưa đo”.",
    };
  }
  return { ok: true, value: normalized, verification: "not_required" };
}

function validateGenericText(value: string): CustomerInputValidation {
  const normalized = collapseWhitespace(value);
  if (normalized.length > 500) return { ok: false, error: "Nội dung không được vượt quá 500 ký tự." };
  if (containsObviousPlaceholder(normalized) || looksLikeKeyboardNoise(normalized)) {
    return { ok: false, error: "Nội dung có vẻ chưa có nghĩa rõ ràng. Vui lòng mô tả lại bằng một câu ngắn." };
  }
  return { ok: true, value: normalized, verification: "not_required" };
}

export function validateCustomerAnswer(
  question: ConversationQuestion,
  rawValue: string,
): CustomerInputValidation {
  const normalized = collapseWhitespace(rawValue);
  if (!normalized) {
    return question.required
      ? { ok: false, error: "Vui lòng bổ sung thông tin trước khi tiếp tục." }
      : { ok: true, value: "", verification: "not_required" };
  }

  if (question.inputType === "choice") {
    if (!question.options?.some((item) => item.value === normalized)) {
      return { ok: false, error: "Lựa chọn chưa khớp với các phương án được hỗ trợ." };
    }
    return { ok: true, value: normalized, verification: "not_required" };
  }

  switch (question.field) {
    case "name":
      return validateName(normalized);
    case "phone":
      return validatePhone(normalized);
    case "zalo":
      return validatePhone(normalized, "Số Zalo");
    case "email":
      return validateEmail(normalized);
    case "surveyAddress":
      return validateAddress(normalized);
    case "dimensions":
      return validateDimensions(normalized);
    default:
      return validateGenericText(normalized);
  }
}
