import { resolve4, resolve6, resolveMx } from "node:dns/promises";

import { normalizeVietnamPhone } from "@/lib/ai/customer-input";
import { verifyPhoneWithAPILayer } from "@/lib/server/phone-verification";

export type ContactVerificationField = "phone" | "zalo" | "email";
export type ContactVerificationStatus =
  | "network_verified"
  | "format_only"
  | "invalid";

export interface ContactVerificationResult {
  field: ContactVerificationField;
  status: ContactVerificationStatus;
  normalizedValue: string;
  message: string;
}

const DNS_TIMEOUT_MS = 2_500;
const EMAIL_PATTERN = /^([a-z0-9.!#$%&'*+/=?^_`{|}~-]+)@([a-z0-9-]+(?:\.[a-z0-9-]+)+)$/i;

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("timeout")), timeoutMs);
  });
  return Promise.race([promise, timeout]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

function dnsErrorCode(error: unknown): string | null {
  if (!error || typeof error !== "object" || !("code" in error)) return null;
  const code = (error as { code?: unknown }).code;
  return typeof code === "string" ? code : null;
}

async function domainHasAddress(domain: string): Promise<boolean> {
  const checks = await Promise.allSettled([
    withTimeout(resolve4(domain), DNS_TIMEOUT_MS),
    withTimeout(resolve6(domain), DNS_TIMEOUT_MS),
  ]);
  return checks.some(
    (result) => result.status === "fulfilled" && result.value.length > 0,
  );
}

async function verifyEmail(value: string): Promise<ContactVerificationResult> {
  const normalizedValue = value.trim().toLocaleLowerCase("en-US");
  const match = normalizedValue.match(EMAIL_PATTERN);
  const domain = match?.[2];
  if (!domain || normalizedValue.length > 254 || normalizedValue.includes("..")) {
    return {
      field: "email",
      status: "invalid",
      normalizedValue,
      message: "Email chưa đúng định dạng.",
    };
  }

  try {
    const records = await withTimeout(resolveMx(domain), DNS_TIMEOUT_MS);
    if (records.some((record) => record.exchange.trim())) {
      return {
        field: "email",
        status: "network_verified",
        normalizedValue,
        message:
          "Tên miền email có máy chủ nhận thư. Quyền sở hữu địa chỉ email vẫn chưa được xác minh nếu chưa có bước xác nhận riêng.",
      };
    }
  } catch (error) {
    const code = dnsErrorCode(error);
    if (code === "ENOTFOUND") {
      return {
        field: "email",
        status: "invalid",
        normalizedValue,
        message: "Tên miền email không tồn tại hoặc không thể phân giải.",
      };
    }

    if (code !== "ENODATA" && code !== "ENOTFOUND") {
      return {
        field: "email",
        status: "format_only",
        normalizedValue,
        message:
          "Email đúng định dạng nhưng chưa thể kiểm tra máy chủ nhận thư lúc này. Hệ thống không coi đây là địa chỉ đã xác minh.",
      };
    }
  }

  if (await domainHasAddress(domain)) {
    return {
      field: "email",
      status: "format_only",
      normalizedValue,
      message:
        "Tên miền email tồn tại nhưng chưa xác nhận được máy chủ nhận thư. Hệ thống chỉ ghi nhận là đúng định dạng.",
    };
  }

  return {
    field: "email",
    status: "invalid",
    normalizedValue,
    message: "Tên miền email không có bản ghi mạng phù hợp để nhận diện.",
  };
}

async function verifyPhone(
  field: "phone" | "zalo",
  value: string,
): Promise<ContactVerificationResult> {
  const normalizedValue = normalizeVietnamPhone(value) ?? "";
  if (!normalizedValue) {
    return {
      field,
      status: "invalid",
      normalizedValue: value.trim(),
      message: "Số điện thoại Việt Nam chưa đúng định dạng hỗ trợ.",
    };
  }

  const upstream = await verifyPhoneWithAPILayer(normalizedValue);
  if (upstream.status === "invalid") {
    return {
      field,
      status: "invalid",
      normalizedValue,
      message: "Nhà cung cấp kiểm tra số xác nhận số này không hợp lệ.",
    };
  }
  if (upstream.status === "verified") {
    return {
      field,
      status: "network_verified",
      normalizedValue,
      message:
        "Số đã vượt qua kiểm tra mạng của nhà cung cấp. Điều này chưa chứng minh người nhập là chủ sở hữu số nếu chưa có OTP.",
    };
  }

  return {
    field,
    status: "format_only",
    normalizedValue,
    message:
      "Số đúng định dạng nhưng dịch vụ kiểm tra mạng chưa xác nhận được. Hệ thống không coi đây là số đã xác minh.",
  };
}

export async function verifyContactValue(
  field: ContactVerificationField,
  value: string,
): Promise<ContactVerificationResult> {
  return field === "email" ? verifyEmail(value) : verifyPhone(field, value);
}
