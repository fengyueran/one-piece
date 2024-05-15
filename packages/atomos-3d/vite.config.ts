import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import react from '@vitejs/plugin-react';

const packageInfo = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'package.json'), {
    encoding: 'utf8',
  })
);

const stringToPort = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
  }

  const port = Math.abs(hash % 9000) + 1000;
  return port;
};

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
    },
  },
  plugins: [react()],
  define: {
    global: {},
  },
  server: {
    port: stringToPort(packageInfo.name),
    host: '0.0.0.0',
    proxy: {
      '/efile': {
        target: 'https://ksefile.hpccube.com:65241',
        secure: false,
        changeOrigin: true,
      },
    },
  },
});
