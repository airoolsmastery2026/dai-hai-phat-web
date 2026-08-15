import { NextRequest, NextResponse } from "next/server";
import { disconnectPublishingAccount, isPublishingPlatform, requestPublishingVerification, sanitizePublishingCredentials, storePublishingCredentialsAndVerify } from "@/lib/server/admin-publishing";
import { consumeRateLimit, getRequestClientKey, isSameOriginRequest } from "@/lib/server/api-security";
import { SupabaseRestError, SupabaseServerConfigurationError } from "@/lib/server/supabase-rest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ platform: string }> };
const BODY_LIMIT_BYTES = 16 * 1024;

function json(body: unknown, status = 200, headers?: HeadersInit) {
  return NextResponse.json(body, { status, headers: { "cache-control": "private, no-store", ...headers } });
}

function guard(request: NextRequest) {
  if (!isSameOriginRequest(request.headers, request.nextUrl.host)) return json({ error: { code: "CROSS_SITE_REQUEST", message: "Cross-site request bị từ chối.", retryable: false } }, 403);
  const limit = consumeRateLimit("admin-publishing", getRequestClientKey(request.headers), { maxRequests: 20, windowMs: 10 * 60 * 1000 });
  if (!limit.allowed) return json({ error: { code: "RATE_LIMITED", message: "Thao tác quá nhanh. Vui lòng thử lại sau.", retryable: true } }, 429, { "retry-after": String(limit.retryAfterSeconds) });
  return null;
}

async function platformOf(context: RouteContext) {
  const normalized = (await context.params).platform.toLowerCase();
  return isPublishingPlatform(normalized) ? normalized : null;
}

function upstream(error: unknown) {
  const config = error instanceof SupabaseServerConfigurationError;
  return json({ error: { code: config ? "PUBLISHING_ADMIN_NOT_CONFIGURED" : "PUBLISHING_ADMIN_UNAVAILABLE", message: config ? "Publishing Admin chưa được cấu hình Supabase server-side." : "Không thể hoàn tất thao tác với Publishing Cloud Worker.", retryable: error instanceof SupabaseRestError } }, config ? 503 : 502);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const blocked = guard(request); if (blocked) return blocked;
  const platform = await platformOf(context); if (!platform) return json({ error: { code: "UNSUPPORTED_PLATFORM", message: "Nền tảng không được hỗ trợ.", retryable: false } }, 404);
  const length = Number(request.headers.get("content-length") || 0);
  if (Number.isFinite(length) && length > BODY_LIMIT_BYTES) return json({ error: { code: "PAYLOAD_TOO_LARGE", message: "Credential payload quá lớn.", retryable: false } }, 413);
  try {
    const credentials = sanitizePublishingCredentials(platform, await request.json());
    const verificationRequestId = await storePublishingCredentialsAndVerify(platform, credentials);
    return json({ data: { platform, configured: true, verificationStatus: "unverified", verificationRequested: true, verificationRequestId } }, 202);
  } catch (error) {
    if (error instanceof SyntaxError || (error instanceof Error && error.message.includes("không hợp lệ"))) return json({ error: { code: "INVALID_CREDENTIALS", message: error instanceof Error ? error.message : "Credential payload không hợp lệ.", retryable: false } }, 400);
    return upstream(error);
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  const blocked = guard(request); if (blocked) return blocked;
  const platform = await platformOf(context); if (!platform) return json({ error: { code: "UNSUPPORTED_PLATFORM", message: "Nền tảng không được hỗ trợ.", retryable: false } }, 404);
  try { return json({ data: { platform, verificationRequested: true, verificationRequestId: await requestPublishingVerification(platform) } }, 202); } catch (error) { return upstream(error); }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const blocked = guard(request); if (blocked) return blocked;
  const platform = await platformOf(context); if (!platform) return json({ error: { code: "UNSUPPORTED_PLATFORM", message: "Nền tảng không được hỗ trợ.", retryable: false } }, 404);
  try { await disconnectPublishingAccount(platform); return json({ data: { platform, configured: false } }); } catch (error) { return upstream(error); }
}
