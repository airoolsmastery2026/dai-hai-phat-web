import { NextResponse } from "next/server";

import { apiJsonResponse } from "@/lib/server/api-json-response";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const NO_STORE_HEADERS = { "Cache-Control": "private, no-store" } as const;

export function GET() {
  const requestId = globalThis.crypto.randomUUID();

  return apiJsonResponse(
    {
      schemaVersion: "1.0",
      requestId,
      data: {
        status: "ok",
        service: "dai-hai-phat-web",
        timestamp: new Date().toISOString(),
      },
    },
    200,
    NO_STORE_HEADERS,
  );
}

export function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      ...NO_STORE_HEADERS,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
