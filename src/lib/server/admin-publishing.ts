import { supabaseRpcRequest } from "@/lib/server/supabase-rest";

export const PUBLISHING_PLATFORMS = [
  "facebook",
  "instagram",
  "tiktok",
  "linkedin",
  "pinterest",
  "youtube",
] as const;

export type PublishingPlatform = (typeof PUBLISHING_PLATFORMS)[number];

export interface PublishingAccountStatus {
  platform: PublishingPlatform;
  verification_status: "unverified" | "verified" | "error";
  verified_account_id: string | null;
  verified_account_name: string | null;
  verification_error_code: string | null;
  last_verified_at: string | null;
  updated_at: string;
}

const PROJECT_ID = "dai-hai-phat-web";
const ACCESS_TOKEN_MAX = 12_000;
const IDENTIFIER_MAX = 512;

const REQUIRED_FIELDS: Record<PublishingPlatform, readonly string[]> = {
  facebook: ["accessToken", "pageId"],
  instagram: ["accessToken", "userId"],
  tiktok: ["accessToken"],
  linkedin: ["accessToken", "authorUrn"],
  pinterest: ["accessToken", "boardId"],
  youtube: ["accessToken", "channelId"],
};

export function isPublishingPlatform(value: string): value is PublishingPlatform {
  return PUBLISHING_PLATFORMS.includes(value as PublishingPlatform);
}

export function sanitizePublishingCredentials(
  platform: PublishingPlatform,
  input: unknown,
): Record<string, string> {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Credential payload không hợp lệ.");
  }

  const record = input as Record<string, unknown>;
  const output: Record<string, string> = {};
  for (const field of REQUIRED_FIELDS[platform]) {
    const value = typeof record[field] === "string" ? record[field].trim() : "";
    const maxLength = field === "accessToken" ? ACCESS_TOKEN_MAX : IDENTIFIER_MAX;
    if (!value || value.length > maxLength) {
      throw new Error(`${field} không hợp lệ.`);
    }
    output[field] = value;
  }
  return output;
}

export async function listPublishingAccounts(): Promise<PublishingAccountStatus[]> {
  const rows = await supabaseRpcRequest<PublishingAccountStatus[]>(
    "dhp_publish_admin_list_accounts",
    { p_project_id: PROJECT_ID },
  );
  return Array.isArray(rows) ? rows : [];
}

export async function storePublishingCredentialsAndVerify(
  platform: PublishingPlatform,
  credentials: Record<string, string>,
): Promise<number> {
  const requestId = await supabaseRpcRequest<number>(
    "dhp_publish_store_and_request_verify",
    {
      p_project_id: PROJECT_ID,
      p_platform: platform,
      p_credentials: credentials,
    },
  );
  return Number(requestId);
}

export async function requestPublishingVerification(
  platform: PublishingPlatform,
): Promise<number> {
  const requestId = await supabaseRpcRequest<number>(
    "dhp_publish_request_verify",
    { p_project_id: PROJECT_ID, p_platform: platform },
  );
  return Number(requestId);
}

export async function disconnectPublishingAccount(
  platform: PublishingPlatform,
): Promise<void> {
  await supabaseRpcRequest<null>("dhp_publish_remove_account", {
    p_project_id: PROJECT_ID,
    p_platform: platform,
  });
}
