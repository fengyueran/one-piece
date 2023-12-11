import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { createHtmlPlugin } from 'vite-plugin-html';
import bundleAnalyzer from 'rollup-plugin-bundle-analyzer';

const loading = fs.readFileSync(path.join(__dirname, 'vendor/loading.html'));

const packageInfo = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'package.json'), {
    encoding: 'utf8',
  }),
);

const stringToPort = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
  }

  const port = Math.abs(hash % 9000) + 1000;
  return port;
};

export default defineConfig({
  // https://vitejs.dev/config/
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    process.env.Analyze && bundleAnalyzer({ port: 9000 }),
    react({
      babel: {
        plugins: [
          [
            'styled-components-px2vw',
            {
              unitToConvert: 'pxvw', // 需要转换的单位，默认为"px"
              viewportWidth: 1920, // 设计稿的视口宽度
              unitPrecision: 6, // 单位转换后保留的精度
              propList: ['*'], // 能转化为vw的属性列表
              transformRuntime: true, // 设置 transformation:true 之后，可以转换被字符串模板嵌套的字符串表达式
            },
          ],
        ],
        babelrc: false,
        configFile: false,
      },
    }),
    svgr(),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          loading,
        },
      },
    }),
  ],
  server: {
    port: stringToPort(packageInfo.name),
    host: '0.0.0.0',
  },
});
