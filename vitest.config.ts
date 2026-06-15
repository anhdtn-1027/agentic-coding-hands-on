import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('.', import.meta.url)).replace(/\/$/, '');

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Mirror tsconfig "@/*" path alias so component imports resolve under Vitest.
    alias: { '@': rootDir },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    // e2e/** holds Playwright specs (*.spec.ts) — keep them out of Vitest.
    exclude: ['e2e/**', '.claude/**', 'node_modules/**', '.next/**'],
    include: ['**/*.test.ts', '**/*.test.tsx'],
  },
});
