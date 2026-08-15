import { NextRequest } from 'next/server';
import { requestControlPlane } from '@/lib/dhp-control-plane';

interface RouteContext {
  params: Promise<{ path: string[] }>;
}

const ALLOWED_ROOTS = ['skills', 'media', 'publish', 'capabilities'] as const;

async function forward(request: NextRequest, context: RouteContext): Promise<Response> {
  const { path } = await context.params;
  if (!Array.isArray(path) || path.length === 0 || !ALLOWED_ROOTS.includes(path[0] as (typeof ALLOWED_ROOTS)[number])) {
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
