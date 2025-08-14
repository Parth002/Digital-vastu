// File: vite.config.ts

import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  },
  // ADD THIS BUILD SECTION
  build: {
    rollupOptions: {
      external: ['jspdf'], // Tells Vite to ignore 'jspdf' during the build
    },
  },
});