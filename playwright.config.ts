import { defineConfig, devices } from '@playwright/test';
import { loadEnvConfig } from '@next/env';

// Load .env.local (AUTH_SECRET) so specs can mint a stubbed next-auth session.
loadEnvConfig(process.cwd());

const PORT = Number(process.env.E2E_PORT ?? 3100);
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npm run dev -- -p ${PORT}`,
    url: baseURL,
    // Reused locally for speed. NOTE: a server already on this port must have been
    // started with AUTH_URL=http://localhost:<port> (see env below), otherwise the
    // stubbed-session test will see a redirect to /login. CI always starts fresh.
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    // Auth.js normalizes the request origin to AUTH_URL; align it with the test
    // port so next-intl's locale rewrite stays on this server (not :3001).
    env: { ...process.env, AUTH_URL: baseURL, NEXTAUTH_URL: baseURL } as Record<string, string>,
  },
});
