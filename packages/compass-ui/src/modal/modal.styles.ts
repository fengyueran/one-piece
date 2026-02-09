import styled from '@emotion/styled'
import Button from '../button'
import { token } from '../theme/token-utils'

export const AnimationDuration = 500 // ms

export const RootContainer = styled.div<{ $visible: boolean }>`
  position: fixed;
  inset: 0;
  z-index: ${token('components.modal.zIndex', '1000')};
  pointer-events: ${(props) => (props.$visible ? 'auto' : 'none')};
`

export const Mask = styled.div<{ $visible?: boolean }>`
  position: fixed;
  inset: 0;
  background-color: ${token('components.modal.maskColor', 'rgba(0, 0, 0, 0.45)')};
  backdrop-filter: blur(1px);
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transition: opacity ${AnimationDuration}ms;
`

export const ModalContent = styled.div<{ $visible: boolean; $width?: string | number }>`
  background: ${token('components.modal.contentBg', token('colors.background', '#fff'))};
  padding: ${token('components.modal.padding', token('spacing.lg', '24px'))};
  border-radius: ${token('components.modal.borderRadius', token('borderRadius.lg', '8px'))};
  box-shadow: ${token(
    'components.modal.boxShadow',
    token(
      'shadows.lg',
      '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
    ),
  )};
  width: ${(props) =>
    props.$width
      ? typeof props.$width === 'number'
        ? `${props.$width}px`
        : props.$width
      : '100%'};
  max-width: ${(props) => (props.$width ? '100%' : '500px')};
  margin: auto;
  position: relative;
  top: 120px;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transition:
    transform ${AnimationDuration}ms,
    opacity ${AnimationDuration}ms;
  ${(props) => (props.$visible ? `transform: translateY(0)` : `transform: translateY(-20px)`)}
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${token('spacing.md', '16px')};
`

export const Title = styled.div`
  font-size: ${token('fontSize.lg', '18px')};
  font-weight: ${token('fontWeight.bold', '700')};
  color: ${token('colors.text', 'rgba(0, 0, 0, 0.88)')};
  line-height: 1.5;
`

export const CloseBtn = styled(Button)``

export const Footer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin-top: ${token('spacing.md', '16px')};
`

export const StyledButton = styled(Button)`
  padding: 4px 18px;
  margin: 0;
`
