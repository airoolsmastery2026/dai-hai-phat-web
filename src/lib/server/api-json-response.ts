import { NextResponse } from "next/server";

function readResponseRequestId(body: unknown): string | undefined {
  if (typeof body !== "object" || body === null || !("requestId" in body)) {
    return undefined;
  }

  const requestId = (body as { requestId?: unknown }).requestId;
  return typeof requestId === "string" && requestId.length <= 100
    ? requestId
    : undefined;
}

export function apiJsonResponse(
  body: unknown,
  status: number,
  extraHeaders?: HeadersInit,
) {
  const requestId = readResponseRequestId(body);

  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      ...(requestId ? { "X-Request-ID": requestId } : {}),
      ...extraHeaders,
    },
  });
}
