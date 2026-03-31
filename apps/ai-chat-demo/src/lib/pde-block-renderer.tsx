import type { ChatMessageBlockRendererProps } from '@xinghunm/ai-chat'
import { ApprovalRequiredCard } from '../approval-required-card'
import type { ApprovalRequiredPayload } from './pde-stream-transform'

export const renderPdeMessageBlock = ({ block }: ChatMessageBlockRendererProps) => {
  if (block.type !== 'custom' || block.kind !== 'approval-required') {
    return null
  }

  return <ApprovalRequiredCard payload={block.data as ApprovalRequiredPayload} />
}
