import styled from '@emotion/styled'

import Button from '../button'
import { token } from '../theme/token-utils'

export const AnimationDuration = 300

export const RootContainer = styled.div<{ $visible: boolean }>`
  position: fixed;
  inset: 0;
  z-index: ${token('components.drawer.zIndex', token('components.modal.zIndex', '1000'))};
  pointer-events: ${(props) => (props.$visible ? 'auto' : 'none')};
`

export const Mask = styled.div<{ $visible: boolean }>`
  position: fixed;
  inset: 0;
  background-color: ${token(
    'components.drawer.maskColor',
    token('components.modal.maskColor', 'rgba(0, 0, 0, 0.45)'),
  )};
  backdrop-filter: ${token('components.drawer.backdropBlur', 'blur(1px)')};
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transition: opacity ${AnimationDuration}ms;
`

export const DrawerContent = styled.div<{
  $visible: boolean
  $placement: 'left' | 'right'
  $width?: string | number
}>`
  position: fixed;
  top: 0;
  bottom: 0;
  ${(props) => props.$placement}: 0;
  display: flex;
  flex-direction: column;
  width: ${(props) =>
    props.$width
      ? typeof props.$width === 'number'
        ? `${props.$width}px`
        : props.$width
      : '420px'};
  max-width: min(100vw, 640px);
  background: ${token(
    'components.drawer.contentBg',
    token('components.modal.contentBg', token('colors.background', '#fff')),
  )};
  box-shadow: ${token(
    'components.drawer.boxShadow',
    token(
      'components.modal.boxShadow',
      token(
        'shadows.lg',
        '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
      ),
    ),
  )};
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transition:
    transform ${AnimationDuration}ms,
    opacity ${AnimationDuration}ms;
  ${(props) =>
    props.$visible
      ? 'transform: translateX(0);'
      : props.$placement === 'right'
        ? 'transform: translateX(100%);'
        : 'transform: translateX(-100%);'}
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${token('spacing.sm', '8px')};
  padding: ${token('components.drawer.headerPadding', token('spacing.lg', '24px'))};
  border-bottom: 1px solid
    ${token('components.drawer.borderColor', token('colors.border', '#f0f0f0'))};
`

export const Title = styled.div`
  font-size: ${token('components.drawer.titleFontSize', token('fontSize.lg', '18px'))};
  font-weight: ${token('fontWeight.bold', '700')};
  color: ${token('components.drawer.titleColor', token('colors.text', 'rgba(0, 0, 0, 0.88)'))};
  line-height: 1.5;
`

export const CloseBtn = styled(Button)`
  flex-shrink: 0;
`

export const Body = styled.div`
  flex: 1;
  min-height: 0;
  padding: ${token('components.drawer.bodyPadding', token('spacing.lg', '24px'))};
  overflow: auto;
`

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${token('spacing.sm', '8px')};
  padding: ${token('components.drawer.footerPadding', token('spacing.lg', '24px'))};
  border-top: 1px solid ${token('components.drawer.borderColor', token('colors.border', '#f0f0f0'))};
`
