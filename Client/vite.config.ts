/// <reference types="node" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': process.env.VITE_BACKEND_PUBLIC_URI ?? 'http://localhost:3000', // change to your backend port if different
    },
  },
});
