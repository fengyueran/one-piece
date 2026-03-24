import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    '@xinghunm/compass-ui',
    '@emotion/react',
    '@emotion/styled',
    'axios',
    'zustand',
    'react-markdown',
    'remark-gfm',
    'remark-math',
    'rehype-katex',
  ],
  esbuildOptions(options) {
    options.jsxImportSource = '@emotion/react'
  },
})
