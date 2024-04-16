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
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:1337',
        secure: false,
        changeOrigin: true,
      },
    },
  },
});
