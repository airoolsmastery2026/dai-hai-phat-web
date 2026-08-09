import { createHmac, timingSafeEqual } from 'node:crypto';

export const ADMIN_SESSION_COOKIE = 'dhp_admin_session';
const SESSION_TTL_SECONDS = 8 * 60 * 60;

function adminSecret(): string {
  const value = process.env.DHP_WEB_ADMIN_TOKEN?.trim();
  if (!value) throw new Error('DHP_WEB_ADMIN_TOKEN is not configured');
  return value;
}

function secureEqual(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

function signature(expiresAt: number): string {
  return createHmac('sha256', adminSecret())
    .update(`dhp-admin-session:${expiresAt}`)
    .digest('hex');
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    return secureEqual(adminSecret(), token.trim());
  } catch {
    return false;
  }
}

export function createAdminSessionValue(now = Date.now()): string {
  const expiresAt = Math.floor(now / 1000) + SESSION_TTL_SECONDS;
  return `${expiresAt}.${signature(expiresAt)}`;
}

export function verifyAdminSessionValue(value: string | undefined, now = Date.now()): boolean {
  if (!value) return false;
  const [expiresRaw, providedSignature, ...extra] = value.split('.');
  if (extra.length || !expiresRaw || !providedSignature) return false;

  const expiresAt = Number(expiresRaw);
  if (!Number.isInteger(expiresAt) || expiresAt <= Math.floor(now / 1000)) return false;

  try {
    return secureEqual(signature(expiresAt), providedSignature);
  } catch {
    return false;
  }
}

export function adminSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'strict' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  };
}
