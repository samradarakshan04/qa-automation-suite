import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/api/**/*.spec.ts', 'tests/unit/**/*.spec.ts'],
    environment: 'node',
    testTimeout: 15000,
    reporters: ['default'],
  },
});
