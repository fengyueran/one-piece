import styled from '@emotion/styled'
import { DEFAULT_CHAT_AGENT_MODE } from '../../types'
import { useChatContext, useChatStore } from '../../context/use-chat-context'
import { createDraftChatSession, createDraftChatSessionId } from '../ChatComposer/lib/chat-composer'
import { ChatSessionItem } from './components/chat-session-item'

export const ChatConversationList = () => {
  const { labels } = useChatContext()

  const sessions = useChatStore((s) => s.sessions)
  const activeSessionId = useChatStore((s) => s.activeSessionId)
  const preferredMode = useChatStore((s) => s.preferredMode)
  const createSession = useChatStore((s) => s.createSession)
  const setActiveSession = useChatStore((s) => s.setActiveSession)

  const modeLabels: Record<string, string> = {
    ask: labels.modeLabelAsk,
    plan: labels.modeLabelPlan,
    agent: labels.modeLabelAgent,
  }

  const handleCreateSession = () => {
    const session = createDraftChatSession({
      model: '',
      mode: preferredMode,
      nowIso: () => new Date().toISOString(),
      createSessionId: createDraftChatSessionId,
    })
    createSession(session)
  }

  return (
    <Container>
      <Toolbar>
        <Title>Sessions</Title>
        <CreateButton type="button" data-testid="chat-create-session" onClick={handleCreateSession}>
          {labels.newChat}
        </CreateButton>
      </Toolbar>
      <List data-testid="chat-session-list">
        {sessions.map((session) => (
          <ChatSessionItem
            key={session.sessionId}
            session={session}
            isActive={activeSessionId === session.sessionId}
            modeLabel={modeLabels[session.mode ?? DEFAULT_CHAT_AGENT_MODE] ?? ''}
            onClick={setActiveSession}
          />
        ))}
      </List>
    </Container>
  )
}

const Container = styled.aside`
  width: 280px;
  min-width: 280px;
  border-right: 1px solid var(--border-default, rgba(255, 255, 255, 0.08));
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.02);
`

const Toolbar = styled.div`
  padding: 20px 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const Title = styled.h2`
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
`

const CreateButton = styled.button`
  border: none;
  border-radius: 12px;
  padding: 12px 14px;
  background: var(--text-primary);
  color: var(--bg-primary);
  text-align: left;
  cursor: pointer;
`

const List = styled.div`
  padding: 0 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: auto;
`
