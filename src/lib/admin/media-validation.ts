export const ADMIN_MEDIA_ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const ADMIN_MEDIA_MAX_BYTES = 8 * 1024 * 1024;
export const ADMIN_MEDIA_MAX_FILES = 12;

export interface AdminMediaCandidate {
  name: string;
  type: string;
  size: number;
}

export interface AdminMediaValidationResult {
  accepted: AdminMediaCandidate[];
  rejected: Array<AdminMediaCandidate & { reason: string }>;
}

export function validateAdminMediaCandidates(
  candidates: readonly AdminMediaCandidate[],
): AdminMediaValidationResult {
  const accepted: AdminMediaCandidate[] = [];
  const rejected: Array<AdminMediaCandidate & { reason: string }> = [];

  for (const candidate of candidates.slice(0, ADMIN_MEDIA_MAX_FILES)) {
    if (!ADMIN_MEDIA_ALLOWED_TYPES.includes(candidate.type as never)) {
      rejected.push({ ...candidate, reason: "Định dạng ảnh không được hỗ trợ." });
      continue;
    }

    if (candidate.size <= 0) {
      rejected.push({ ...candidate, reason: "Tệp ảnh trống." });
      continue;
    }

    if (candidate.size > ADMIN_MEDIA_MAX_BYTES) {
      rejected.push({ ...candidate, reason: "Ảnh vượt quá giới hạn 8 MB." });
      continue;
    }

    accepted.push(candidate);
  }

  for (const candidate of candidates.slice(ADMIN_MEDIA_MAX_FILES)) {
    rejected.push({ ...candidate, reason: "Mỗi lần chỉ nhận tối đa 12 ảnh." });
  }

  return { accepted, rejected };
}
