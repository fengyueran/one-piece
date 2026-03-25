import { memo } from 'react'
import styled from '@emotion/styled'
import type { ChatSession } from '../../../types'

interface ChatSessionItemProps {
  session: ChatSession
  isActive: boolean
  modeLabel: string
  onClick: (sessionId: string) => void
}

export const ChatSessionItem = memo(
  ({ session, isActive, modeLabel, onClick }: ChatSessionItemProps) => {
    return (
      <SessionButton
        type="button"
        data-active={isActive}
        onClick={() => onClick(session.sessionId)}
      >
        <SessionMeta>
          <SessionTitle>{session.title}</SessionTitle>
          <ModeBadge>{modeLabel}</ModeBadge>
        </SessionMeta>
      </SessionButton>
    )
  },
)

const SessionMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`

const SessionTitle = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const SessionButton = styled.button`
  border: 1px solid transparent;
  border-radius: 12px;
  padding: 12px;
  text-align: left;
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.03);
  cursor: pointer;

  &[data-active='true'] {
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.08);
  }
`

const ModeBadge = styled.span`
  flex-shrink: 0;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 4px 10px;
  font-size: 11px;
  line-height: 1;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.04);
`
