import { timingSafeEqual } from 'node:crypto';
import { NextRequest } from 'next/server';
import { requestControlPlane } from '@/lib/dhp-control-plane';
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionValue,
} from '@/lib/admin-session';

interface RouteContext {
  params: Promise<{ path: string[] }>;
}

function secureEqual(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

function authorized(request: NextRequest): boolean {
  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (verifyAdminSessionValue(session)) return true;

  const expected = process.env.DHP_WEB_ADMIN_TOKEN?.trim();
  const provided = request.headers.get('x-dhp-admin-token')?.trim();
  return Boolean(expected && provided && secureEqual(expected, provided));
}

async function forward(request: NextRequest, context: RouteContext): Promise<Response> {
  if (!authorized(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { path } = await context.params;
  if (!Array.isArray(path) || path.length === 0 || !['skills', 'media'].includes(path[0])) {
    return Response.json({ error: 'Unsupported Control Plane path' }, { status: 404 });
  }

  const encodedPath = path.map((segment) => encodeURIComponent(segment)).join('/');
  const target = `/v1/${encodedPath}${request.nextUrl.search}`;
  const method = request.method.toUpperCase();
  const body = method === 'GET' || method === 'HEAD' ? undefined : await request.text();

  try {
    const upstream = await requestControlPlane(target, { method, body });
    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: {
        'content-type': upstream.headers.get('content-type') ?? 'application/json; charset=utf-8',
        'cache-control': 'no-store',
      },
    });
  } catch (error) {
    return Response.json(
      {
        error: 'Control Plane unavailable',
        detail: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 },
    );
  }
}

export const GET = forward;
export const POST = forward;
