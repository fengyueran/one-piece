import { useEffect, useRef, useState } from 'react'
import type { ChatImageAttachment } from '../../../types'

const SUPPORTED_IMAGE_MIME_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp'])
const MAX_COMPOSER_ATTACHMENTS = 10

interface AppendFilesResult {
  addedCount: number
  limitExceeded: boolean
}

export interface ComposerImageAttachment extends ChatImageAttachment {
  file: File
}

const createObjectUrl = (file: File) =>
  typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function'
    ? URL.createObjectURL(file)
    : ''

const revokeObjectUrl = (url: string) => {
  if (url && typeof URL !== 'undefined' && typeof URL.revokeObjectURL === 'function') {
    URL.revokeObjectURL(url)
  }
}

const createAttachmentId = () =>
  `attachment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const releaseComposerAttachments = (attachments: ComposerImageAttachment[]) => {
  attachments.forEach((attachment) => revokeObjectUrl(attachment.previewUrl))
}

const cloneComposerAttachmentsForMessage = (attachments: ComposerImageAttachment[]) =>
  attachments.map(({ file, ...attachment }) => ({
    ...attachment,
    previewUrl: createObjectUrl(file),
  }))

export const useComposerAttachments = () => {
  const [attachments, setAttachments] = useState<ComposerImageAttachment[]>([])
  const attachmentsRef = useRef<ComposerImageAttachment[]>([])

  useEffect(() => {
    attachmentsRef.current = attachments
  }, [attachments])

  useEffect(
    () => () => {
      releaseComposerAttachments(attachmentsRef.current)
    },
    [],
  )

  const appendFiles = (files: File[] | FileList): AppendFilesResult => {
    const validFiles = Array.from(files).filter((file) => SUPPORTED_IMAGE_MIME_TYPES.has(file.type))
    if (!validFiles.length) return { addedCount: 0, limitExceeded: false }

    const currentAttachments = attachmentsRef.current
    const remainingSlots = MAX_COMPOSER_ATTACHMENTS - currentAttachments.length
    if (remainingSlots <= 0) return { addedCount: 0, limitExceeded: true }

    const filesToAppend = validFiles.slice(0, remainingSlots)

    // Create attachments (including Object URLs) outside the updater to avoid
    // double-invocation in React StrictMode, which would leak the first set of URLs.
    const newAttachments = filesToAppend.map((file) => ({
      id: createAttachmentId(),
      file,
      name: file.name,
      mimeType: file.type,
      size: file.size,
      previewUrl: createObjectUrl(file),
    }))

    setAttachments((current) => [...current, ...newAttachments])

    return {
      addedCount: filesToAppend.length,
      limitExceeded: validFiles.length > filesToAppend.length,
    }
  }

  const removeAttachment = (attachmentId: string) => {
    setAttachments((current) => {
      const target = current.find((a) => a.id === attachmentId)
      if (target) releaseComposerAttachments([target])
      return current.filter((a) => a.id !== attachmentId)
    })
  }

  const clearAttachments = () => {
    setAttachments((current) => {
      releaseComposerAttachments(current)
      return []
    })
  }

  return {
    attachments,
    appendFiles,
    removeAttachment,
    clearAttachments,
    createMessageAttachments: () => cloneComposerAttachmentsForMessage(attachments),
  }
}
