import { createContext, type MutableRefObject } from 'react'
import type { AxiosInstance } from 'axios'
import type { ChatStoreInstance } from '../store/chat-store'
import type {
  AiChatLabels,
  ChatConfirmationSubmitHandler,
  ChatMessageBlockRenderer,
  ChatMessageRenderOrder,
  ChatQuestionnaireSubmitHandler,
  ChatTransport,
  TransformChatStreamPacket,
} from '../types'

export interface ChatContextValue {
  store: ChatStoreInstance
  transport: ChatTransport
  /** Legacy default-adapter axios client. Undefined when a custom transport is injected. */
  axios?: AxiosInstance
  /** Legacy default-adapter base URL. Undefined when a custom transport is injected. */
  apiBaseUrl?: string
  /** Legacy default-adapter authorization header value. Undefined when a custom transport is injected. */
  authToken?: string
  labels: Required<AiChatLabels>
  /** Stable ref populated by ChatComposer on mount; allows ChatThread to trigger sends. */
  sendRef: MutableRefObject<(content: string) => Promise<void>>
  /** Stable ref populated by ChatComposer on mount; allows ChatThread to replay the last request. */
  retryRef: MutableRefObject<() => Promise<void>>
  /** Optional block renderer used to extend message rendering with custom block types. */
  renderMessageBlock?: ChatMessageBlockRenderer
  /** Optional handler used to intercept questionnaire submissions before the default send flow. */
  handleQuestionnaireSubmit?: ChatQuestionnaireSubmitHandler
  /** Optional handler used to intercept confirmation submissions before the default send flow. */
  handleConfirmationSubmit?: ChatConfirmationSubmitHandler
  /** Optional render order used for mixed text and structured message blocks. */
  messageRenderOrder?: ChatMessageRenderOrder
  /** Optional packet transformer used by the legacy default adapter. */
  transformStreamPacket?: TransformChatStreamPacket
  /** Whether image attachments are enabled. Defaults to true. */
  enableImageAttachments: boolean
}

export const ChatContext = createContext<ChatContextValue | null>(null)
