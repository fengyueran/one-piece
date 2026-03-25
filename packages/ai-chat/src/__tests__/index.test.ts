jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => children,
}))
jest.mock('remark-gfm', () => ({}))
jest.mock('remark-math', () => ({}))
jest.mock('rehype-katex', () => ({}))

import {
  AiChat,
  AiChatProvider,
  ChatComposer,
  ChatConversationList,
  ChatThread,
  createDefaultChatTransport,
  useChatContext,
  useChatStore,
} from '../index'

describe('package root exports', () => {
  it('exports the public hooks, transport helpers, and main components', () => {
    expect(AiChat).toBeDefined()
    expect(AiChatProvider).toBeDefined()
    expect(ChatComposer).toBeDefined()
    expect(ChatConversationList).toBeDefined()
    expect(ChatThread).toBeDefined()
    expect(createDefaultChatTransport).toBeDefined()
    expect(useChatContext).toBeDefined()
    expect(useChatStore).toBeDefined()
  })
})
