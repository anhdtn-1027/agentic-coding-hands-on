import type { BrowserContext } from '@playwright/test';
import { encode } from 'next-auth/jwt';

// Dev (http) cookie name used by Auth.js v5 for the JWT session.
const SESSION_COOKIE = 'authjs.session-token';

export interface StubUser {
  email: string;
  name?: string;
  role?: 'admin' | 'user';
}

/**
 * Mint a valid Auth.js session cookie (no Google OAuth) and attach it to the
 * browser context, so the server middleware treats the user as authenticated.
 * This is the "stub next-auth" approach: a real, secret-signed token without
 * any external provider.
 */
export async function applyStubSession(
  context: BrowserContext,
  user: StubUser = { email: 'e2e@sun-asterisk.com', name: 'E2E User', role: 'user' },
): Promise<void> {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error('AUTH_SECRET is not set — cannot mint a stub session cookie.');
  }

  const token = await encode({
    secret,
    salt: SESSION_COOKIE,
    token: {
      name: user.name,
      email: user.email,
      sub: user.email,
      role: user.role ?? 'user',
    },
  });

  await context.addCookies([
    {
      name: SESSION_COOKIE,
      value: token,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      sameSite: 'Lax',
    },
  ]);
}
