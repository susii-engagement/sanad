import { defineConfig } from 'vite';

const api = {
  '/api': 'http://127.0.0.1:3021',
};

export default defineConfig({
  base: '/',
  build: {
    target: 'es2022',
    outDir: 'dist',
    chunkSizeWarningLimit: 1500,
  },
  optimizeDeps: {
    exclude: ['onnxruntime-web'],
  },
  server: {
    proxy: api,
  },
  preview: {
    proxy: api,
  },
  test: {
    include: process.env.SLI_REPLAY
      ? ['tests/replay/**/*.test.ts']
      : ['tests/unit/**/*.test.ts'],
    testTimeout: 30000,
  },
});
