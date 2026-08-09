import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  adminSessionCookieOptions,
  createAdminSessionValue,
  verifyAdminSessionValue,
  verifyAdminToken,
} from '@/lib/admin-session';

export async function GET(request: NextRequest) {
  const authenticated = verifyAdminSessionValue(
    request.cookies.get(ADMIN_SESSION_COOKIE)?.value,
  );
  return NextResponse.json(
    { authenticated },
    { headers: { 'cache-control': 'no-store' } },
  );
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const token = body && typeof body === 'object' && !Array.isArray(body)
    ? (body as Record<string, unknown>).token
    : undefined;

  if (typeof token !== 'string' || !verifyAdminToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const response = NextResponse.json({ authenticated: true });
  response.cookies.set(
    ADMIN_SESSION_COOKIE,
    createAdminSessionValue(),
    adminSessionCookieOptions(),
  );
  response.headers.set('cache-control', 'no-store');
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(ADMIN_SESSION_COOKIE, '', {
    ...adminSessionCookieOptions(),
    maxAge: 0,
  });
  response.headers.set('cache-control', 'no-store');
  return response;
}
