import type { AxiosInstance } from 'axios'
import type { ChatModelsResponse, ChatTerminateResponse } from '../types'

const CHAT_MODELS_PATH = '/v1/models'
const CHAT_TERMINATE_PATH = '/v1/chat/terminate'

export const getChatModels = async (client: AxiosInstance): Promise<ChatModelsResponse> => {
  const response = await client.get<ChatModelsResponse>(CHAT_MODELS_PATH)
  return response.data
}

export const terminateChat = async (
  client: AxiosInstance,
  sessionId?: string,
): Promise<ChatTerminateResponse> => {
  const response = await client.post<ChatTerminateResponse>(
    CHAT_TERMINATE_PATH,
    sessionId ? { session_id: sessionId } : {},
    { headers: sessionId ? { 'X-Session-ID': sessionId } : undefined },
  )
  return response.data
}
