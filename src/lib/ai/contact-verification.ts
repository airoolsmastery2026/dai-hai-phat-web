export type ContactVerificationField = "phone" | "email" | "zalo";

export type ContactVerificationLevel =
  | "format_only"
  | "network_valid"
  | "domain_valid";

export interface ContactVerificationReceipt {
  field: ContactVerificationField;
  verification: ContactVerificationLevel;
  message: string;
}

export function isContactVerificationField(
  value: unknown,
): value is ContactVerificationField {
  return value === "phone" || value === "email" || value === "zalo";
}

export function isContactVerificationLevel(
  value: unknown,
): value is ContactVerificationLevel {
  return value === "format_only" || value === "network_valid" || value === "domain_valid";
}

export function isContactVerificationCompatible(
  field: ContactVerificationField,
  verification: ContactVerificationLevel,
): boolean {
  if (verification === "format_only") return true;
  if (field === "email") return verification === "domain_valid";
  return verification === "network_valid";
}

export function getContactVerificationAcknowledgement(
  receipt: ContactVerificationReceipt,
): string {
  if (receipt.verification === "network_valid") {
    return receipt.field === "zalo"
      ? "Số dùng cho Zalo đã được dịch vụ kiểm tra mạng công nhận là số hợp lệ. Điều này chưa chứng minh số thuộc về người nhập; quyền sở hữu vẫn cần OTP hoặc xác nhận liên hệ thực tế."
      : "Số điện thoại đã được dịch vụ kiểm tra mạng công nhận là số hợp lệ. Điều này chưa chứng minh số thuộc về người nhập; quyền sở hữu vẫn cần OTP hoặc xác nhận liên hệ thực tế.";
  }

  if (receipt.verification === "domain_valid") {
    return "Tên miền email có khả năng nhận thư và đã vượt qua kiểm tra server. Hộp thư cụ thể vẫn chưa được xác minh là thuộc về người nhập nếu chưa có bước xác nhận riêng.";
  }

  return receipt.field === "email"
    ? "Email đã đúng định dạng và vượt qua kiểm tra server, nhưng DNS chưa xác nhận được tên miền lúc này. Hộp thư chưa được xác minh quyền sở hữu."
    : `${receipt.field === "zalo" ? "Số dùng cho Zalo" : "Số điện thoại"} đã đúng định dạng và vượt qua kiểm tra server, nhưng dịch vụ mạng chưa xác nhận được lúc này. Quyền sở hữu số chưa được xác minh.`;
}
