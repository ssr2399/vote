import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
             if (id.includes('react')) return 'vendor-react';
             if (id.includes('@google')) return 'vendor-google';
             if (id.includes('lucide')) return 'vendor-icons';
             return 'vendor';
          }
        }
      }
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
