// Shared e2e helpers — locale-aware route building + single auth-stub import surface.
// VI is the default locale (unprefixed: `/`, `/awards-information`); EN is `/en`-prefixed.

export { applyStubSession } from '../auth-stub';
export type { StubUser } from '../auth-stub';

export type Locale = 'vi' | 'en';

// Implemented routes (see proxy.ts allow-list + app/[locale]/* pages).
export const ROUTES = {
  HOME: '/',
  AWARDS: '/awards-information',
  PRELAUNCH: '/prelaunch',
  KUDOS: '/sun-kudos',
  LOGIN: '/login',
} as const;

/**
 * Prefix a route with the locale segment.
 * VI returns the path unchanged; EN prepends `/en` ("/" → "/en").
 */
export function localePath(path: string, locale: Locale = 'vi'): string {
  if (locale === 'vi') return path;
  if (path === '/') return '/en';
  return `/en${path}`;
}
