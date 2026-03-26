import styled from '@emotion/styled'
import { ConfigProvider } from '@xinghunm/compass-ui'
import { AiChatProvider, type AiChatProviderProps } from '../ai-chat-provider'
import { ChatThread } from '../chat-thread'
import { ChatComposer } from '../chat-composer'
import { ChatConversationList } from '../chat-conversation-list'

/**
 * Props for the all-in-one `AiChat` component.
 */
export type AiChatProps = Omit<AiChatProviderProps, 'children'> & {
  /** When true, renders the conversation list sidebar. Defaults to false. */
  showConversationList?: boolean
}

/**
 * Top-level AI chat component. Wraps AiChatProvider and composes the full
 * chat UI: optional conversation sidebar + thread + composer.
 */
export const AiChat = ({ showConversationList = false, ...providerProps }: AiChatProps) => (
  <ConfigProvider
    theme={{
      token: {
        spacing: {
          lg: 16,
        },
        colors: {
          primary: '#1f52f0',
          background: '#1c1c1c',
          text: '#fcfbf8',
          textSecondary: '#c5c1ba',
        },
        components: {
          select: {
            optionColor: '#fcfbf8',
            optionSelectedBg: 'transparent',
            optionHoverBg: '#41413f',
            optionSelectedColor: '#fcfbf8',
            backgroundColor: '#1c1c1c',
            dropdownBg: '#1c1c1c',
            placeholderColor: '#c5c1ba',
            borderRadius: '12px',
            dropdownPadding: '4px',
          },
          modal: { contentBg: '#1c1c1c', padding: '24px' },
          dropdown: {
            backgroundColor: '#1c1c1c',
            borderRadius: '12px',
            padding: '4px',
          },
        },
      },
    }}
  >
    <AiChatProvider {...(providerProps as AiChatProviderProps)}>
      <Root data-testid="ai-chat">
        {showConversationList ? <ChatConversationList /> : null}
        <Workspace>
          <ChatThread />
          <ChatComposer />
        </Workspace>
      </Root>
    </AiChatProvider>
  </ConfigProvider>
)

const Root = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
`

const Workspace = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
`
