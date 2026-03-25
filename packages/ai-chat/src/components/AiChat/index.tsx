import styled from '@emotion/styled'
import { AiChatProvider, type AiChatProviderProps } from '../AiChatProvider'
import { ChatThread } from '../ChatThread'
import { ChatComposer } from '../ChatComposer'
import { ChatConversationList } from '../ChatConversationList'

export interface AiChatProps extends AiChatProviderProps {
  /** Show the conversation list sidebar. Defaults to false. */
  showConversationList?: boolean
}

/**
 * Top-level AI chat component. Wraps AiChatProvider and composes the full
 * chat UI: optional conversation sidebar + thread + composer.
 */
export const AiChat = ({ showConversationList = false, ...providerProps }: AiChatProps) => (
  <AiChatProvider {...providerProps}>
    <Root data-testid="ai-chat">
      {showConversationList ? <ChatConversationList /> : null}
      <Workspace>
        <ChatThread />
        <ChatComposer />
      </Workspace>
    </Root>
  </AiChatProvider>
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
