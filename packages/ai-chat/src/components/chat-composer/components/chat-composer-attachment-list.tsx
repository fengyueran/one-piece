import { useState } from 'react'
import styled from '@emotion/styled'
import type { ChatImageAttachment } from '../../../types'
import { ImageViewer } from '../../chat-thread/components/image-viewer'

interface ChatComposerAttachmentListProps {
  attachments: ChatImageAttachment[]
  onRemoveAttachment: (attachmentId: string) => void
}

export const ChatComposerAttachmentList = ({
  attachments,
  onRemoveAttachment,
}: ChatComposerAttachmentListProps) => {
  const [activeImage, setActiveImage] = useState<ChatImageAttachment | null>(null)

  if (!attachments.length) {
    return null
  }

  return (
    <>
      <AttachmentList data-testid="chat-composer-attachment-list">
        {attachments.map((attachment) => (
          <AttachmentCard key={attachment.id}>
            <AttachmentPreviewButton
              type="button"
              aria-label={`${attachment.name} preview`}
              onClick={() => setActiveImage(attachment)}
            >
              <AttachmentThumb src={attachment.previewUrl} alt={attachment.name} />
            </AttachmentPreviewButton>
            <AttachmentRemoveButton
              type="button"
              aria-label={`Remove ${attachment.name}`}
              onClick={(event) => {
                event.stopPropagation()
                onRemoveAttachment(attachment.id)
              }}
            >
              <CloseGlyph aria-hidden="true" />
            </AttachmentRemoveButton>
          </AttachmentCard>
        ))}
      </AttachmentList>
      {activeImage ? (
        <ImageViewer
          src={activeImage.previewUrl}
          alt={activeImage.name}
          onClose={() => setActiveImage(null)}
        />
      ) : null}
    </>
  )
}

const AttachmentList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 12px 12px 0;
  max-height: 238px;
  overflow-y: auto;
  overscroll-behavior: contain;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 999px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`

const AttachmentCard = styled.div`
  position: relative;
  width: 108px;
  height: 72px;
  overflow: hidden;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
`

const AttachmentPreviewButton = styled.button`
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: zoom-in;
`

const AttachmentThumb = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`

const AttachmentRemoveButton = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  background: rgba(20, 20, 24, 0.92);
  color: rgba(255, 255, 255, 0.94);
  cursor: pointer;
  line-height: 0;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 4px 10px rgba(0, 0, 0, 0.24);
  transition:
    background-color 140ms ease,
    border-color 140ms ease,
    transform 140ms ease,
    box-shadow 140ms ease;

  &:hover {
    background: rgba(37, 37, 44, 0.98);
    border-color: rgba(255, 255, 255, 0.28);
    transform: scale(1.06);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.12),
      0 8px 18px rgba(0, 0, 0, 0.32);
  }

  &:active {
    transform: scale(0.96);
    background: rgba(30, 30, 35, 0.98);
  }
`

const CloseGlyph = styled.span`
  position: relative;
  width: 11px;
  height: 11px;
  display: block;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 11px;
    height: 1.75px;
    border-radius: 999px;
    background: currentColor;
    transform-origin: center;
  }

  &::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }

  &::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
`
