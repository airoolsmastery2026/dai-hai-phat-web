import { NextRequest, NextResponse } from "next/server";

import { evaluateConceptReadiness, type ConceptReadinessProfile } from "@/lib/ai/concept-readiness";
import {
  consumeRateLimit,
  getRequestClientKey,
  isSameOriginRequest,
} from "@/lib/server/api-security";
import { persistProjectInquiryRecord } from "@/lib/server/project-inquiries";

const RATE_LIMIT = { maxRequests: 5, windowMs: 10 * 60 * 1000 };
const ALLOWED_SERVICES = new Set([
  "Cửa cổng",
  "Cầu thang và lan can",
  "Mái che",
  "Nội thất",
  "Cải tạo không gian",
]);

interface InquiryPayload extends ConceptReadinessProfile {
  requestId?: string;
}

function clean(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function parsePayload(value: unknown): InquiryPayload | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  const purpose = clean(input.purpose, 20);
  if (!(["build", "renovate", "reference"] as const).includes(purpose as never)) {
    return null;
  }

  const payload: InquiryPayload = {
    requestId: clean(input.requestId, 100),
    name: clean(input.name, 120),
    phone: clean(input.phone, 30),
    zalo: clean(input.zalo, 30),
    projectArea: clean(input.projectArea, 200),
    service: clean(input.service, 80),
    dimensions: clean(input.dimensions, 160),
    budget: clean(input.budget, 80),
    timeline: clean(input.timeline, 80),
    purpose: purpose as InquiryPayload["purpose"],
    description: clean(input.description, 2_000),
    hasSiteImage: input.hasSiteImage === true,
    hasReferenceImage: input.hasReferenceImage === true,
    consent: input.consent === true,
  };

  const phoneDigits = payload.phone.replace(/\D/g, "");
  if (
    payload.name.length < 2 ||
    phoneDigits.length < 9 ||
    !payload.projectArea ||
    !ALLOWED_SERVICES.has(payload.service) ||
    !payload.dimensions ||
    payload.description.length < 10 ||
    !payload.consent
  ) {
    return null;
  }

  return payload;
}

async function notifyTelegram(
  inquiry: InquiryPayload,
  score: number,
  decision: string,
): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) return;

  const text = [
    "📌 Hồ sơ dự án mới — Đại Hải Phát",
    `Khách hàng: ${inquiry.name}`,
    `Điện thoại: ${inquiry.phone}`,
    inquiry.zalo ? `Zalo: ${inquiry.zalo}` : null,
    `Khu vực: ${inquiry.projectArea}`,
    `Hạng mục: ${inquiry.service}`,
    `Kích thước: ${inquiry.dimensions}`,
    inquiry.budget ? `Ngân sách: ${inquiry.budget}` : null,
    inquiry.timeline ? `Thời gian: ${inquiry.timeline}` : null,
    `Điểm sẵn sàng: ${score}/100 (${decision})`,
    `Nhu cầu: ${inquiry.description}`,
  ]
    .filter(Boolean)
    .join("\n");

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
    cache: "no-store",
    signal: AbortSignal.timeout(6_000),
  });

  if (!response.ok) throw new Error("Telegram notification failed.");
}

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request.headers, request.nextUrl.host)) {
    return NextResponse.json({ error: "Yêu cầu không hợp lệ." }, { status: 403 });
  }

  const rateLimit = consumeRateLimit(
    "project-inquiries",
    getRequestClientKey(request.headers),
    RATE_LIMIT,
  );
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Bạn đã gửi quá nhiều lần. Vui lòng thử lại sau." },
      {
        status: 429,
        headers: { "retry-after": String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
  }

  const inquiry = parsePayload(body);
  if (!inquiry) {
    return NextResponse.json(
      { error: "Vui lòng kiểm tra và bổ sung thông tin dự án." },
      { status: 400 },
    );
  }

  const readiness = evaluateConceptReadiness(inquiry);
  const requestId = inquiry.requestId || crypto.randomUUID();
  const record = {
    request_id: requestId,
    full_name: inquiry.name,
    phone: inquiry.phone,
    zalo_contact: inquiry.zalo || null,
    project_area: inquiry.projectArea,
    service: inquiry.service,
    dimensions: inquiry.dimensions,
    budget: inquiry.budget || null,
    timeline: inquiry.timeline || null,
    purpose: inquiry.purpose,
    description: inquiry.description,
    has_site_image: inquiry.hasSiteImage,
    has_reference_image: inquiry.hasReferenceImage,
    readiness_score: readiness.score,
    readiness_decision: readiness.decision,
    consented_at: new Date().toISOString(),
  };

  try {
    await persistProjectInquiryRecord(record, {
      duplicateStrategy: "ignore",
      signal: AbortSignal.timeout(8_000),
    });

    try {
      await notifyTelegram(inquiry, readiness.score, readiness.decision);
    } catch (error) {
      console.error("Project inquiry Telegram handoff failed", {
        requestId,
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }

    return NextResponse.json({
      ok: true,
      requestId,
      readiness,
    });
  } catch (error) {
    console.error("Project inquiry persistence failed", {
      requestId,
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      { error: "Chưa thể lưu hồ sơ. Vui lòng thử lại hoặc liên hệ Zalo." },
      { status: 503 },
    );
  }
}
