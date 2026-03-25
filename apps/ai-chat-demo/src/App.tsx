import { AiChat } from '@xinghunm/ai-chat'

const API_BASE_URL = import.meta.env.VITE_AI_CHAT_API_BASE_URL ?? 'http://localhost:8000'
const AUTH_TOKEN = import.meta.env.VITE_AI_CHAT_AUTH_TOKEN ?? 'Bearer dev-token'

export const App = () => (
  <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
    <AiChat apiBaseUrl={API_BASE_URL} authToken={AUTH_TOKEN} showConversationList />
  </div>
)
