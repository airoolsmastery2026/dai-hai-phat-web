import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const HEALTH_HEADERS = {
  "Cache-Control": "public, max-age=0, must-revalidate",
  "X-Content-Type-Options": "nosniff",
} as const;

export function GET() {
  return NextResponse.json(
    {
      status: "ok",
      service: "dai-hai-phat-web",
      timestamp: new Date().toISOString(),
    },
    { status: 200, headers: HEALTH_HEADERS },
  );
}

export function HEAD() {
  return new NextResponse(null, { status: 200, headers: HEALTH_HEADERS });
}
