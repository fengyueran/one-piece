import { act, renderHook } from '@testing-library/react'
import { useComposerAttachments } from '../../components/chat-composer/hooks/use-composer-attachments'

describe('useComposerAttachments', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('transfers composer attachments to messages without creating duplicate object URLs', () => {
    const createObjectURL = jest
      .spyOn(URL, 'createObjectURL')
      .mockImplementation(() => 'blob:attachment-1')
    const revokeObjectURL = jest.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})

    const { result } = renderHook(() => useComposerAttachments())
    const file = new File(['image'], 'image.png', { type: 'image/png' })

    act(() => {
      result.current.appendFiles([file])
    })

    let messageAttachments: ReturnType<typeof result.current.takeMessageAttachments> = []
    act(() => {
      messageAttachments = result.current.takeMessageAttachments()
    })

    expect(createObjectURL).toHaveBeenCalledTimes(1)
    expect(revokeObjectURL).not.toHaveBeenCalled()
    expect(messageAttachments).toHaveLength(1)
    expect(messageAttachments[0]?.previewUrl).toBe('blob:attachment-1')
    expect(result.current.attachments).toEqual([])
  })
})
