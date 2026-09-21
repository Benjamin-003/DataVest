import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.{test,spec}.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.{test,spec}.ts',
        'src/**/*.routes.ts',
        'src/types/**',
        'src/index.ts',
        'src/prisma/client.ts',
        'src/config/rss-feeds.ts',
        'src/app.ts',
      ],
    },
  },
});