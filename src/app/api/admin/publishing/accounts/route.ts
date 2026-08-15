import { NextResponse } from "next/server";
import { listPublishingAccounts } from "@/lib/server/admin-publishing";
import { SupabaseRestError, SupabaseServerConfigurationError } from "@/lib/server/supabase-rest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json({ data: await listPublishingAccounts() }, { headers: { "cache-control": "private, no-store" } });
  } catch (error) {
    const configurationError = error instanceof SupabaseServerConfigurationError;
    return NextResponse.json({ error: { code: configurationError ? "PUBLISHING_ADMIN_NOT_CONFIGURED" : "PUBLISHING_ADMIN_UNAVAILABLE", message: configurationError ? "Publishing Admin chưa được cấu hình Supabase server-side." : "Không thể đọc trạng thái tài khoản xuất bản.", retryable: error instanceof SupabaseRestError } }, { status: configurationError ? 503 : 502, headers: { "cache-control": "private, no-store" } });
  }
}
