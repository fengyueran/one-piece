import { defineConfig } from 'dumi'
import path from 'path'

export default defineConfig({
  title: 'Compass UI',
  outputPath: 'docs-dist',

  themeConfig: {
    name: 'Compass UI',
    logo: '/logo.png',
    nav: [
      { title: '指南', link: '/guide' },
      { title: '组件', link: '/components' },
      { title: 'GitHub', link: 'https://github.com/fengyueran/one-piece' },
    ],
    footer: 'Copyright © 2024 | Powered by Compass UI',
  },

  alias: {
    '@xinghunm/compass-ui/dist/locale': path.join(__dirname, 'src/locale'),
  },
  styles: [
    `
    .dumi-default-header-left {
       padding-right: 40px !important;
    }
    .dumi-default-header-left .dumi-default-logo img {
       width: 32px !important; 
       height: 32px !important;
    }
    `,
  ],
})
