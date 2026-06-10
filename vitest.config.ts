import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    exclude: ['.claude/**', 'node_modules/**', '.next/**'],
    include: ['**/*.test.ts', '**/*.test.tsx'],
  },
});
