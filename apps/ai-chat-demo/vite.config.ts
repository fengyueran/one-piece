import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.AI_CHAT_DEMO_PROXY_TARGET || 'http://localhost:8081'
  const workspaceRoot = path.resolve(__dirname, '../..')
  const aiChatSourceEntry = path.resolve(workspaceRoot, 'packages/ai-chat/src/index.ts')

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@xinghunm/ai-chat': aiChatSourceEntry,
      },
    },
    server: {
      fs: {
        allow: [workspaceRoot],
      },
      proxy: {
        '/ai-api': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
