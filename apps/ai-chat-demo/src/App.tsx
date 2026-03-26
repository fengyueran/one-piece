import { useMemo } from 'react'
import { AiChat, createDefaultChatTransport } from '@xinghunm/ai-chat'

const API_BASE_URL = import.meta.env.VITE_AI_CHAT_API_BASE_URL ?? '/ai-api'
const AUTH_TOKEN = import.meta.env.VITE_AI_CHAT_AUTH_TOKEN ?? 'Bearer dev-token'

export const App = () => {
  const transport = useMemo(
    () =>
      createDefaultChatTransport({
        apiBaseUrl: API_BASE_URL,
        authToken: AUTH_TOKEN,
      }),
    [],
  )

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AiChat transport={transport} showConversationList enableImageAttachments={false} />
    </div>
  )
}
