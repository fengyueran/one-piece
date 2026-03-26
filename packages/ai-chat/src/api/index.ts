import type { AxiosInstance } from 'axios'
import type { ChatModelsResponse, ChatTerminateResponse } from '../types'

const CHAT_MODELS_PATH = '/models'
const CHAT_TERMINATE_PATH = '/chat/terminate'

/**
 * Fetches the list of available chat models from the backend.
 */
export const getChatModels = async (
  client: AxiosInstance,
  path: string = CHAT_MODELS_PATH,
): Promise<ChatModelsResponse> => {
  const response = await client.get<ChatModelsResponse>(path)
  return response.data
}

/**
 * Sends a terminate request to stop an active streaming session.
 */
export const terminateChat = async (
  client: AxiosInstance,
  sessionId?: string,
  path: string = CHAT_TERMINATE_PATH,
): Promise<ChatTerminateResponse> => {
  // Session ID is sent both in the header and body to support
  // different backend routing strategies (header-based and body-based).
  const response = await client.post<ChatTerminateResponse>(
    path,
    sessionId ? { session_id: sessionId } : {},
    { headers: sessionId ? { 'X-Session-ID': sessionId } : undefined },
  )
  return response.data
}
