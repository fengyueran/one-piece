import type { ComponentPropsWithoutRef } from 'react'
import { Fragment, memo, useState } from 'react'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import type {
  ChatAgentMode,
  ChatImageAttachment,
  ChatMessage,
  ChatMessageBlock,
  ChatMessageBlockRenderer,
  ChatParameterSummaryItem,
  ExecutionConfirmationSubmission,
  PlanQuestion,
  ExecutionProposal,
  PlanQuestionnaire,
  PlanQuestionnaireAnswerValue,
  PlanQuestionnaireSubmission,
  ResultSummary,
} from '../../../types'
import { useChatMessageReveal } from '../hooks/use-chat-message-reveal'
import { useTimelineBlockAnchors } from '../hooks/use-timeline-block-anchors'
import {
  buildAnchoredTimelineSegments,
  getTimelineDisplayUnitCount,
  buildTimelineTextDisplay,
  getTimelineBlockKey,
  getTimelineConsumedText,
  type MessageBodySegment,
} from '../lib/chat-message-timeline'
import { ExecutionConfirmationCard } from './execution-confirmation-card'
import { NoticeCard } from './notice-card'
import { ParameterSummaryCard } from './parameter-summary-card'
import { QuestionnaireCard } from './questionnaire-card'
import { ResultSummaryCard } from './result-summary-card'
import { ImageViewer } from './image-viewer'
import { useChatContext } from '../../../context/use-chat-context'

const MARKDOWN_REMARK_PLUGINS = [remarkGfm, remarkMath]
const MARKDOWN_REHYPE_PLUGINS = [rehypeKatex]
type MarkdownTableProps = ComponentPropsWithoutRef<'table'> & {
  node?: unknown
}
const MARKDOWN_COMPONENTS = {
  table: ({ node: _node, ...props }: MarkdownTableProps) => (
    <TableWrapper>
      <table {...props} />
    </TableWrapper>
  ),
}

const renderMarkdownContent = (content: string) => (
  <ReactMarkdown
    remarkPlugins={MARKDOWN_REMARK_PLUGINS}
    rehypePlugins={MARKDOWN_REHYPE_PLUGINS}
    components={MARKDOWN_COMPONENTS}
  >
    {content}
  </ReactMarkdown>
)

const createExecutionConfirmationContent = (proposal: ExecutionProposal) =>
  [
    'Execution confirmed',
    `- Equation: ${proposal.resourceName}`,
    ...(proposal.executorName ? [`- Solver: ${proposal.executorName}`] : []),
    `- Proposal ID: ${proposal.proposalId}`,
  ].join('\n')

const areChatAttachmentsEqual = (
  previousAttachments?: ChatImageAttachment[],
  nextAttachments?: ChatImageAttachment[],
) => {
  if (previousAttachments === nextAttachments) {
    return true
  }

  if (!previousAttachments || !nextAttachments) {
    return previousAttachments === nextAttachments
  }

  if (previousAttachments.length !== nextAttachments.length) {
    return false
  }

  return previousAttachments.every((attachment, index) => {
    const nextAttachment = nextAttachments[index]

    return (
      attachment.id === nextAttachment?.id &&
      attachment.name === nextAttachment.name &&
      attachment.mimeType === nextAttachment.mimeType &&
      attachment.size === nextAttachment.size &&
      attachment.previewUrl === nextAttachment.previewUrl
    )
  })
}

const areParameterSummaryItemsEqual = (
  previousItems: ChatParameterSummaryItem[],
  nextItems: ChatParameterSummaryItem[],
) =>
  previousItems.length === nextItems.length &&
  previousItems.every((item, index) => {
    const nextItem = nextItems[index]

    return (
      item.label === nextItem?.label &&
      item.value === nextItem.value &&
      item.fieldPath === nextItem.fieldPath
    )
  })

const areExecutionProposalsEqual = (
  previousProposal: ExecutionProposal,
  nextProposal: ExecutionProposal,
) =>
  previousProposal.proposalId === nextProposal.proposalId &&
  previousProposal.resourceKey === nextProposal.resourceKey &&
  previousProposal.resourceName === nextProposal.resourceName &&
  previousProposal.executorName === nextProposal.executorName &&
  previousProposal.requiresConfirmation === nextProposal.requiresConfirmation &&
  areParameterSummaryItemsEqual(previousProposal.parameterSummary, nextProposal.parameterSummary) &&
  (previousProposal.warnings ?? []).length === (nextProposal.warnings ?? []).length &&
  (previousProposal.warnings ?? []).every(
    (warning, index) => warning === nextProposal.warnings?.[index],
  )

const areResultSummariesEqual = (previousSummary: ResultSummary, nextSummary: ResultSummary) =>
  previousSummary.summaryId === nextSummary.summaryId &&
  previousSummary.status === nextSummary.status &&
  previousSummary.headline === nextSummary.headline &&
  previousSummary.details.length === nextSummary.details.length &&
  previousSummary.details.every((detail, index) => detail === nextSummary.details[index])

const areStringArraysEqual = (previousValues: string[], nextValues: string[]) =>
  previousValues.length === nextValues.length &&
  previousValues.every((value, index) => value === nextValues[index])

const areQuestionAnswersEqual = (
  previousAnswer: PlanQuestionnaireAnswerValue | undefined,
  nextAnswer: PlanQuestionnaireAnswerValue | undefined,
) => {
  if (Array.isArray(previousAnswer) || Array.isArray(nextAnswer)) {
    return (
      Array.isArray(previousAnswer) &&
      Array.isArray(nextAnswer) &&
      areStringArraysEqual(previousAnswer, nextAnswer)
    )
  }

  return previousAnswer === nextAnswer
}

const areQuestionAnswerMapsEqual = (
  previousAnswers?: Partial<Record<string, PlanQuestionnaireAnswerValue>>,
  nextAnswers?: Partial<Record<string, PlanQuestionnaireAnswerValue>>,
) => {
  if (previousAnswers === nextAnswers) {
    return true
  }

  if (!previousAnswers || !nextAnswers) {
    return previousAnswers === nextAnswers
  }

  const previousKeys = Object.keys(previousAnswers)
  const nextKeys = Object.keys(nextAnswers)

  return (
    previousKeys.length === nextKeys.length &&
    previousKeys.every((key) => areQuestionAnswersEqual(previousAnswers[key], nextAnswers[key]))
  )
}

const areQuestionOptionsEqual = (
  previousOptions: Array<{ label: string; value: string }>,
  nextOptions: Array<{ label: string; value: string }>,
) =>
  previousOptions.length === nextOptions.length &&
  previousOptions.every(
    (option, index) =>
      option.label === nextOptions[index]?.label && option.value === nextOptions[index]?.value,
  )

const arePlanQuestionsEqual = (previousQuestion: PlanQuestion, nextQuestion: PlanQuestion) => {
  if (
    previousQuestion.id !== nextQuestion.id ||
    previousQuestion.label !== nextQuestion.label ||
    previousQuestion.required !== nextQuestion.required ||
    previousQuestion.kind !== nextQuestion.kind
  ) {
    return false
  }

  switch (previousQuestion.kind) {
    case 'single_select':
      return (
        nextQuestion.kind === 'single_select' &&
        previousQuestion.allowOther === nextQuestion.allowOther &&
        areQuestionOptionsEqual(previousQuestion.options, nextQuestion.options)
      )
    case 'multi_select':
      return (
        nextQuestion.kind === 'multi_select' &&
        areQuestionOptionsEqual(previousQuestion.options, nextQuestion.options)
      )
    case 'text':
      return (
        nextQuestion.kind === 'text' && previousQuestion.placeholder === nextQuestion.placeholder
      )
    case 'number':
      return (
        nextQuestion.kind === 'number' &&
        previousQuestion.placeholder === nextQuestion.placeholder &&
        previousQuestion.unit === nextQuestion.unit
      )
    case 'boolean':
      return (
        nextQuestion.kind === 'boolean' &&
        previousQuestion.trueLabel === nextQuestion.trueLabel &&
        previousQuestion.falseLabel === nextQuestion.falseLabel
      )
    default:
      return false
  }
}

const areQuestionnairesEqual = (
  previousQuestionnaire: PlanQuestionnaire,
  nextQuestionnaire: PlanQuestionnaire,
) =>
  previousQuestionnaire.questionnaireId === nextQuestionnaire.questionnaireId &&
  previousQuestionnaire.title === nextQuestionnaire.title &&
  previousQuestionnaire.description === nextQuestionnaire.description &&
  previousQuestionnaire.submitLabel === nextQuestionnaire.submitLabel &&
  previousQuestionnaire.questions.length === nextQuestionnaire.questions.length &&
  previousQuestionnaire.questions.every((question, index) =>
    arePlanQuestionsEqual(question, nextQuestionnaire.questions[index] as PlanQuestion),
  ) &&
  areQuestionAnswerMapsEqual(previousQuestionnaire.answers, nextQuestionnaire.answers)

const areMessageBlocksEqual = (
  previousBlocks?: ChatMessageBlock[],
  nextBlocks?: ChatMessageBlock[],
) => {
  if (previousBlocks === nextBlocks) {
    return true
  }

  if (!previousBlocks || !nextBlocks) {
    return previousBlocks === nextBlocks
  }

  if (previousBlocks.length !== nextBlocks.length) {
    return false
  }

  return previousBlocks.every((block, index) => {
    const nextBlock = nextBlocks[index]

    if (!nextBlock || block.type !== nextBlock.type) {
      return false
    }

    switch (block.type) {
      case 'markdown': {
        const comparableBlock = nextBlock as Extract<ChatMessageBlock, { type: 'markdown' }>
        return block.text === comparableBlock.text
      }
      case 'notice': {
        const comparableBlock = nextBlock as Extract<ChatMessageBlock, { type: 'notice' }>
        return block.tone === comparableBlock.tone && block.text === comparableBlock.text
      }
      case 'parameter_summary': {
        const comparableBlock = nextBlock as Extract<
          ChatMessageBlock,
          { type: 'parameter_summary' }
        >
        return areParameterSummaryItemsEqual(block.items, comparableBlock.items)
      }
      case 'confirmation_card': {
        const comparableBlock = nextBlock as Extract<
          ChatMessageBlock,
          { type: 'confirmation_card' }
        >
        return areExecutionProposalsEqual(block.proposal, comparableBlock.proposal)
      }
      case 'result_summary': {
        const comparableBlock = nextBlock as Extract<ChatMessageBlock, { type: 'result_summary' }>
        return areResultSummariesEqual(block.summary, comparableBlock.summary)
      }
      case 'questionnaire': {
        const comparableBlock = nextBlock as Extract<ChatMessageBlock, { type: 'questionnaire' }>
        return areQuestionnairesEqual(block.questionnaire, comparableBlock.questionnaire)
      }
      case 'custom': {
        const comparableBlock = nextBlock as Extract<ChatMessageBlock, { type: 'custom' }>
        return block.kind === comparableBlock.kind && block.data === comparableBlock.data
      }
      default:
        return false
    }
  })
}

const isSameMessage = (
  previousMessage: ChatMessage,
  nextMessage: ChatMessage,
  previousMode?: ChatAgentMode,
  nextMode?: ChatAgentMode,
  previousConfirmationSubmit?: (submission: ExecutionConfirmationSubmission) => void,
  nextConfirmationSubmit?: (submission: ExecutionConfirmationSubmission) => void,
  previousQuestionnaireSubmit?: (submission: PlanQuestionnaireSubmission) => void,
  nextQuestionnaireSubmit?: (submission: PlanQuestionnaireSubmission) => void,
  previousRenderMessageBlock?: ChatMessageBlockRenderer,
  nextRenderMessageBlock?: ChatMessageBlockRenderer,
) =>
  previousMessage.id === nextMessage.id &&
  previousMessage.sessionId === nextMessage.sessionId &&
  previousMessage.role === nextMessage.role &&
  previousMessage.content === nextMessage.content &&
  areMessageBlocksEqual(previousMessage.blocks, nextMessage.blocks) &&
  previousMessage.localOnly === nextMessage.localOnly &&
  areChatAttachmentsEqual(previousMessage.attachments, nextMessage.attachments) &&
  previousMessage.status === nextMessage.status &&
  previousMessage.createdAt === nextMessage.createdAt &&
  previousMode === nextMode &&
  previousConfirmationSubmit === nextConfirmationSubmit &&
  previousQuestionnaireSubmit === nextQuestionnaireSubmit &&
  previousRenderMessageBlock === nextRenderMessageBlock

const ChatMessageItemView = ({
  message,
  mode = 'agent',
  onConfirmationSubmit,
  onQuestionnaireSubmit,
  renderMessageBlock,
}: {
  message: ChatMessage
  mode?: ChatAgentMode
  onConfirmationSubmit?: (submission: ExecutionConfirmationSubmission) => void
  onQuestionnaireSubmit?: (submission: PlanQuestionnaireSubmission) => void
  renderMessageBlock?: ChatMessageBlockRenderer
}) => {
  const { labels, messageRenderOrder = 'blocks-first' } = useChatContext()
  const [activeImage, setActiveImage] = useState<
    | {
        name: string
        previewUrl: string
      }
    | undefined
  >(undefined)
  const {
    displayedBlocks,
    displayedContent,
    freshContent,
    isAssistantStreaming,
    isFreshBlockActive,
    settledContent,
  } = useChatMessageReveal(message)
  const isStoppedAssistant = message.role === 'assistant' && message.status === 'stopped'
  const attachments = message.attachments ?? []
  const blocks = message.blocks ?? []
  const hasStructuredBlocks = blocks.length > 0
  const hasMarkdownOnlyBlocks =
    hasStructuredBlocks && blocks.every((block) => block.type === 'markdown')
  const hasTextContent = Boolean(settledContent || freshContent || displayedContent)
  const shouldRenderStructuredBlocks =
    hasStructuredBlocks && !(isAssistantStreaming && hasMarkdownOnlyBlocks && hasTextContent)
  const isPlanMode = mode === 'plan'
  const canSubmitConfirmation = isPlanMode && typeof onConfirmationSubmit === 'function'
  const canSubmitQuestionnaire = isPlanMode && typeof onQuestionnaireSubmit === 'function'
  const shouldShowStreamingCaret =
    isAssistantStreaming && (!shouldRenderStructuredBlocks || hasTextContent)
  const timelineConsumedText =
    messageRenderOrder === 'timeline' ? getTimelineConsumedText(blocks) : ''
  const hasConsumedTimelineText =
    timelineConsumedText.length > 0 && displayedContent.startsWith(timelineConsumedText)
  const timelineDisplayedContent = hasConsumedTimelineText
    ? displayedContent.slice(timelineConsumedText.length)
    : displayedContent
  const timelineTextDisplay = buildTimelineTextDisplay(
    timelineDisplayedContent,
    isAssistantStreaming,
    isFreshBlockActive,
  )
  const displayedTimelineTextLength = getTimelineDisplayUnitCount(timelineDisplayedContent)
  const { timelineBlockAnchors, visibleTimelineBlockKeys } = useTimelineBlockAnchors({
    blocks,
    displayedTimelineTextLength,
    isAssistantStreaming,
    message,
    messageRenderOrder,
  })

  const renderChatMessageBlock = (block: ChatMessageBlock, index: number) => {
    switch (block.type) {
      case 'markdown':
        return (
          <ContentBlock
            key={`markdown-${index}`}
            data-testid={`chat-message-block-${index}`}
            data-block-tone="settled"
          >
            {renderMarkdownContent(block.text)}
          </ContentBlock>
        )
      case 'notice':
        return (
          <Fragment key={`notice-${index}`}>
            <NoticeCard text={block.text} tone={block.tone} />
          </Fragment>
        )
      case 'parameter_summary':
        return (
          <Fragment key={`parameter-summary-${index}`}>
            <ParameterSummaryCard items={block.items} />
          </Fragment>
        )
      case 'confirmation_card':
        return (
          <Fragment key={`confirmation-card-${index}`}>
            <ExecutionConfirmationCard
              proposal={block.proposal}
              interactive={isPlanMode}
              onConfirm={
                canSubmitConfirmation
                  ? () =>
                      onConfirmationSubmit({
                        proposalId: block.proposal.proposalId,
                        content: createExecutionConfirmationContent(block.proposal),
                        sourceMessageId: message.id,
                      })
                  : undefined
              }
            />
          </Fragment>
        )
      case 'result_summary':
        return (
          <Fragment key={`result-summary-${index}`}>
            <ResultSummaryCard summary={block.summary} />
          </Fragment>
        )
      case 'questionnaire':
        return (
          <Fragment key={`questionnaire-${index}`}>
            <QuestionnaireCard
              questionnaire={block.questionnaire}
              interactive={canSubmitQuestionnaire}
              labels={{
                submitting: labels.questionnaireSubmitting,
                submitted: labels.questionnaireSubmitted,
                validationPrefix: labels.questionnaireValidationPrefix,
                submitFailed: labels.questionnaireSubmitFailed,
              }}
              onSubmit={
                canSubmitQuestionnaire
                  ? (submission) =>
                      onQuestionnaireSubmit({
                        ...submission,
                        sourceMessageId: message.id,
                      })
                  : undefined
              }
            />
          </Fragment>
        )
      case 'custom':
        return (
          <Fragment key={`custom-${block.kind}-${index}`}>
            {renderMessageBlock?.({
              block,
              index,
              message,
              mode,
              onConfirmationSubmit,
              onQuestionnaireSubmit,
            }) ?? null}
          </Fragment>
        )
      default:
        return null
    }
  }

  const renderTextContent = (options?: {
    content?: string
    displayedBlocks?: Array<{ content: string; tone: 'fresh' | 'settled' }>
    useTimelineSegmentation?: boolean
  }) => {
    const textContent = options?.content ?? displayedContent
    const localTimelineTextDisplay = options?.displayedBlocks
      ? undefined
      : options?.useTimelineSegmentation && options.content !== undefined
        ? buildTimelineTextDisplay(options.content, isAssistantStreaming, isFreshBlockActive)
        : undefined
    const textBlocks =
      options?.displayedBlocks ?? localTimelineTextDisplay?.displayedBlocks ?? displayedBlocks
    const settledText = localTimelineTextDisplay?.settledContent ?? settledContent
    const freshText = localTimelineTextDisplay?.freshContent ?? freshContent

    return (
      <>
        {textBlocks
          .filter((block) => block.content)
          .map((block, index) => (
            <ContentBlock
              key={`${block.tone}-${index}`}
              data-testid={
                block.tone === 'fresh' ? 'chat-message-fresh-block' : 'chat-message-settled-block'
              }
              data-block-tone={block.tone}
              data-block-index={index}
            >
              {renderMarkdownContent(block.content)}
            </ContentBlock>
          ))}
        {!textBlocks.some((block) => block.content) &&
        !settledText &&
        !freshText &&
        Boolean(textContent) ? (
          <ContentBlock data-testid="chat-message-settled-block" data-block-tone="settled">
            {renderMarkdownContent(textContent)}
          </ContentBlock>
        ) : null}
      </>
    )
  }

  const renderStaticTextSegment = (content: string) => (
    <ContentBlock data-testid="chat-message-settled-block" data-block-tone="settled">
      {renderMarkdownContent(content)}
    </ContentBlock>
  )

  const bodySegments: MessageBodySegment[] = (() => {
    if (!shouldRenderStructuredBlocks && hasTextContent) {
      return [{ type: 'text' }]
    }

    if (!shouldRenderStructuredBlocks) {
      return []
    }

    if (messageRenderOrder === 'timeline' && hasTextContent) {
      const hasAnchoredStructuredBlocks = blocks.some((block, index) => {
        const blockKey = getTimelineBlockKey(block, index)
        return blockKey ? timelineBlockAnchors[blockKey] !== undefined : false
      })

      if (hasAnchoredStructuredBlocks) {
        return buildAnchoredTimelineSegments({
          blocks,
          timelineBlockAnchors,
          timelineDisplayedBlocks: timelineTextDisplay.displayedBlocks,
          visibleTimelineBlockKeys,
        })
      }

      const orderedTimelineSegments = blocks.map((block, index) =>
        block.type === 'markdown'
          ? ({
              type: 'markdown',
              content: block.text,
            } as const)
          : ({
              type: 'block',
              block,
              index,
            } as const),
      )

      if (!timelineConsumedText) {
        return displayedContent
          ? [{ type: 'text', content: displayedContent }, ...orderedTimelineSegments]
          : orderedTimelineSegments
      }

      return timelineDisplayedContent
        ? [...orderedTimelineSegments, { type: 'text', content: timelineDisplayedContent }]
        : orderedTimelineSegments
    }

    const orderedBlocks = blocks.map((block, index) => ({
      type: 'block' as const,
      block,
      index,
    }))

    return hasTextContent ? [...orderedBlocks, { type: 'text' }] : orderedBlocks
  })()

  return (
    <>
      <Bubble data-role={message.role} data-status={message.status ?? 'done'}>
        <Header>
          {isAssistantStreaming ? (
            <StreamingIndicator
              data-testid="chat-streaming-indicator"
              aria-label={labels.assistantStreamingAriaLabel}
            >
              <IndicatorSpark />
              <IndicatorSpark data-secondary />
            </StreamingIndicator>
          ) : null}
          <Role>{message.role === 'user' ? labels.userRoleLabel : labels.assistantRoleLabel}</Role>
          {isStoppedAssistant ? (
            <StatusTag data-testid="chat-message-stopped-tag">{labels.stoppedResponse}</StatusTag>
          ) : null}
        </Header>
        <Content data-testid="chat-message-content">
          {shouldRenderStructuredBlocks || hasTextContent ? (
            <ContentStack data-testid="chat-message-body-stack">
              {bodySegments.map((segment, index) => (
                <ContentSegment
                  key={
                    segment.type === 'text'
                      ? `text-${index}`
                      : segment.type === 'markdown'
                        ? `markdown-${index}`
                        : `${segment.block.type}-${segment.index}`
                  }
                  data-testid="chat-message-content-segment"
                >
                  {segment.type === 'block'
                    ? renderChatMessageBlock(segment.block, segment.index)
                    : segment.type === 'text'
                      ? segment.content !== undefined
                        ? segment.useTimelineSegmentation
                          ? renderTextContent({
                              content: segment.content,
                              displayedBlocks: segment.displayedBlocks,
                              useTimelineSegmentation: true,
                            })
                          : renderStaticTextSegment(segment.content)
                        : renderTextContent()
                      : renderStaticTextSegment(segment.content)}
                </ContentSegment>
              ))}
            </ContentStack>
          ) : null}
          {attachments.length ? (
            <AttachmentGrid data-testid="chat-message-attachment-grid">
              {attachments.map((attachment) => (
                <AttachmentButton
                  key={attachment.id}
                  type="button"
                  aria-label={attachment.name}
                  onClick={() =>
                    setActiveImage({
                      name: attachment.name,
                      previewUrl: attachment.previewUrl,
                    })
                  }
                >
                  <AttachmentImage src={attachment.previewUrl} alt={attachment.name} />
                </AttachmentButton>
              ))}
            </AttachmentGrid>
          ) : null}
          {shouldShowStreamingCaret ? (
            <StreamingCaret data-testid="chat-streaming-caret" aria-hidden="true" />
          ) : null}
        </Content>
      </Bubble>
      {activeImage ? (
        <ImageViewer
          src={activeImage.previewUrl}
          alt={activeImage.name}
          onClose={() => setActiveImage(undefined)}
        />
      ) : null}
    </>
  )
}

export const ChatMessageItem = memo(ChatMessageItemView, (previousProps, nextProps) =>
  isSameMessage(
    previousProps.message,
    nextProps.message,
    previousProps.mode,
    nextProps.mode,
    previousProps.onConfirmationSubmit,
    nextProps.onConfirmationSubmit,
    previousProps.onQuestionnaireSubmit,
    nextProps.onQuestionnaireSubmit,
    previousProps.renderMessageBlock,
    nextProps.renderMessageBlock,
  ),
)

const Bubble = styled.article`
  width: 100%;
  max-width: 100%;
  padding: 14px 16px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.03),
    0 12px 30px rgba(0, 0, 0, 0.18);

  &[data-role='user'] {
    width: auto;
    max-width: min(760px, 100%);
    margin-left: auto;
    background: linear-gradient(180deg, rgba(59, 59, 63, 0.9) 0%, rgba(42, 43, 46, 0.92) 100%);
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`

const Role = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.42);
  text-transform: capitalize;
  letter-spacing: 0.08em;
`

const StatusTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: rgba(255, 255, 255, 0.84);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
`

const Content = styled.div`
  color: rgba(255, 255, 255, 0.92);
  line-height: 1.6;

  p {
    margin: 0;
  }

  p + p {
    margin-top: 12px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 0;
    overflow: hidden;
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.03);
  }

  th,
  td {
    padding: 10px 12px;
    text-align: left;
    vertical-align: top;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  th {
    color: rgba(255, 255, 255, 0.82);
    font-weight: 600;
    background: rgba(255, 255, 255, 0.04);
  }

  tbody tr:last-of-type td {
    border-bottom: none;
  }
`

const ContentStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const ContentSegment = styled.div`
  min-width: 0;
`

const ContentBlock = styled.div`
  transition:
    opacity 180ms ease-out,
    filter 180ms ease-out;

  & + & {
    margin-top: 16px;
  }

  &[data-block-tone='fresh'] {
    opacity: 0.85;
    filter: brightness(0.82) saturate(0.88);
  }
`

const AttachmentGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
`

const AttachmentButton = styled.button`
  width: 116px;
  height: 86px;
  overflow: hidden;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
`

const AttachmentImage = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
`

const TableWrapper = styled.div`
  overflow-x: auto;
`

const caretBlink = keyframes`
  0%, 49% {
    opacity: 1;
  }

  50%, 100% {
    opacity: 0.2;
  }
`

const shimmer = keyframes`
  0%, 100% {
    transform: scale(0.9) rotate(0deg);
    opacity: 0.55;
  }

  50% {
    transform: scale(1.05) rotate(8deg);
    opacity: 1;
  }
`

const StreamingIndicator = styled.div`
  position: relative;
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background:
    radial-gradient(circle at 50% 50%, rgba(78, 102, 255, 0.18), transparent 70%),
    rgba(255, 255, 255, 0.01);
  border: 1px dashed rgba(255, 255, 255, 0.14);
`

const IndicatorSpark = styled.span`
  position: absolute;
  width: 10px;
  height: 10px;
  background: linear-gradient(180deg, #7ea0ff 0%, #4a6fff 100%);
  clip-path: polygon(50% 0%, 68% 32%, 100% 50%, 68% 68%, 50% 100%, 32% 68%, 0% 50%, 32% 32%);
  box-shadow: 0 0 12px rgba(78, 102, 255, 0.55);
  animation: ${shimmer} 1.2s ease-in-out infinite;

  &[data-secondary] {
    width: 6px;
    height: 6px;
    top: 4px;
    left: 5px;
    animation-delay: 0.2s;
  }
`

const StreamingCaret = styled.span`
  display: inline-block;
  width: 8px;
  height: 1.1em;
  margin-left: 2px;
  vertical-align: text-bottom;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(126, 160, 255, 0.95) 0%, rgba(74, 111, 255, 0.75) 100%);
  box-shadow: 0 0 10px rgba(78, 102, 255, 0.35);
  animation: ${caretBlink} 0.9s steps(1) infinite;
`
