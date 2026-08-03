import { NextRequest, NextResponse } from "next/server";

const ADMIN_PATH_PREFIX = "/admin";

function unauthorized(): NextResponse {
  return new NextResponse("Yêu cầu xác thực quản trị.", {
    status: 401,
    headers: {
      "cache-control": "no-store",
      "www-authenticate": 'Basic realm="Dai Hai Phat Admin", charset="UTF-8"',
    },
  });
}

function readBasicCredentials(value: string | null): [string, string] | null {
  if (!value?.startsWith("Basic ")) return null;

  try {
    const decoded = atob(value.slice(6));
    const separator = decoded.indexOf(":");
    if (separator < 1) return null;
    return [decoded.slice(0, separator), decoded.slice(separator + 1)];
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest): NextResponse {
  if (!request.nextUrl.pathname.startsWith(ADMIN_PATH_PREFIX)) {
    return NextResponse.next();
  }

  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    return new NextResponse("Trang quản trị chưa được cấu hình.", {
      status: 503,
      headers: { "cache-control": "no-store" },
    });
  }

  const credentials = readBasicCredentials(request.headers.get("authorization"));
  if (
    !credentials ||
    credentials[0] !== expectedUsername ||
    credentials[1] !== expectedPassword
  ) {
    return unauthorized();
  }

  const response = NextResponse.next();
  response.headers.set("cache-control", "no-store");
  response.headers.set("x-robots-tag", "noindex, nofollow, noarchive");
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
