import styled from '@emotion/styled'
import Button from '../button'

export const AnimationDuration = 500 // ms

export const RootContainer = styled.div<{ $visible: boolean }>`
  position: fixed;
  inset: 0;
  z-index: ${(props) => props.theme?.components?.modal?.zIndex || 1000};
  pointer-events: ${(props) => (props.$visible ? 'auto' : 'none')};
`

export const Mask = styled.div<{ $visible?: boolean }>`
  position: fixed;
  inset: 0;
  background-color: ${(props) => props.theme?.components?.modal?.maskColor || 'rgba(0, 0, 0, 0.3)'};
  backdrop-filter: blur(4px);
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transition: opacity ${AnimationDuration}ms;
`

export const ModalContent = styled.div<{ $visible: boolean; $width?: string | number }>`
  background: ${(props) =>
    props.theme?.components?.modal?.contentBg || props.theme.colors.background};
  padding: ${(props) =>
    props.theme?.components?.modal?.bodyPadding || `${props.theme.spacing.lg}px`};
  border-radius: ${(props) =>
    props.theme?.components?.modal?.borderRadius || `${props.theme.borderRadius.md}px`};
  box-shadow: ${(props) => props.theme?.components?.modal?.boxShadow || props.theme.shadows.lg};
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
  margin-bottom: ${(props) => props.theme.spacing.md}px;
`

export const Title = styled.div`
  font-size: ${(props) => props.theme.fontSize.lg}px;
  font-weight: ${(props) => props.theme.fontWeight.bold};
  color: ${(props) => props.theme.colors.text};
  line-height: 1.5;
`

export const CloseBtn = styled(Button)``

export const Footer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin-top: ${(props) => props.theme.spacing.md}px;
`

export const StyledButton = styled(Button)`
  padding: 4px 18px;
  margin: 0;
`
