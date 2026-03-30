import { useMemo } from 'react'
import {
  AiChat,
  createDefaultChatTransport,
  type ChatMessageBlockRendererProps,
  type TransformChatStreamPacket,
} from '@xinghunm/ai-chat'
import { ApprovalRequiredCard, type ApprovalRequiredPayload } from './approval-required-card'

const API_BASE_URL = import.meta.env.VITE_AI_CHAT_API_BASE_URL ?? '/ai-api'
const AUTH_TOKEN = import.meta.env.VITE_AI_CHAT_AUTH_TOKEN ?? 'Bearer dev-token'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isApprovalRequiredPayload = (value: unknown): value is ApprovalRequiredPayload =>
  isRecord(value) &&
  typeof value.request_id === 'string' &&
  typeof value.session_id === 'string' &&
  typeof value.mode === 'string' &&
  typeof value.tool_name === 'string' &&
  typeof value.tool_input === 'string' &&
  typeof value.timeout_sec === 'number'

const transformStreamPacket: TransformChatStreamPacket = ({ packet, defaultUpdate }) => {
  if (packet.type !== 'approval_required' || !isRecord(packet.data)) {
    return defaultUpdate
  }

  const payload = packet.data
  if (!isApprovalRequiredPayload(payload)) {
    return defaultUpdate
  }

  return {
    ...defaultUpdate,
    blocks: [
      ...(defaultUpdate?.blocks ?? []),
      {
        type: 'custom',
        kind: 'approval-required',
        data: payload,
      },
    ],
  }
}

const renderMessageBlock = ({ block }: ChatMessageBlockRendererProps) => {
  if (block.type !== 'custom' || block.kind !== 'approval-required') {
    return null
  }

  return <ApprovalRequiredCard payload={block.data as ApprovalRequiredPayload} />
}

export const App = () => {
  const transport = useMemo(
    () =>
      createDefaultChatTransport({
        apiBaseUrl: API_BASE_URL,
        authToken: AUTH_TOKEN,
        transformStreamPacket,
      }),
    [],
  )

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AiChat
        transport={transport}
        showConversationList
        enableImageAttachments={false}
        messageRenderOrder="timeline"
        renderMessageBlock={renderMessageBlock}
      />
    </div>
  )
}
