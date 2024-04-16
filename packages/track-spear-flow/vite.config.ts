import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: {},
  },
  server: {
    port: 1231,
    host: '0.0.0.0',
    proxy: {
      '/track-spear-flow/api': {
        target: 'http://localhost:1337',
        secure: false,
        changeOrigin: true,
      },
    },
  },
});
