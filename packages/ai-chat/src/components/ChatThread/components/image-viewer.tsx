import styled from '@emotion/styled'
import { useEffect, type MouseEvent } from 'react'

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  cursor: zoom-out;
`

const Img = styled.img`
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 4px;
`

interface ImageViewerProps {
  src: string
  alt?: string
  onClose: () => void
}

export const ImageViewer = ({ src, alt, onClose }: ImageViewerProps) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const stopPropagation = (e: MouseEvent) => e.stopPropagation()

  return (
    <Overlay onClick={onClose}>
      <Img src={src} alt={alt ?? ''} onClick={stopPropagation} />
    </Overlay>
  )
}
