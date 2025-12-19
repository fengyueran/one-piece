import styled from '@emotion/styled'
import Button from '../button'
import { getComponentTheme, getThemeToken } from '../theme/utils'

export const AnimationDuration = 500 // ms

export const RootContainer = styled.div<{ $visible: boolean }>`
  position: fixed;
  inset: 0;
  z-index: ${(props) => getComponentTheme(props.theme, 'modal').zIndex || 1000};
  pointer-events: ${(props) => (props.$visible ? 'auto' : 'none')};
`

export const Mask = styled.div<{ $visible?: boolean }>`
  position: fixed;
  inset: 0;
  background-color: ${(props) =>
    getComponentTheme(props.theme, 'modal').maskColor || 'rgba(0, 0, 0, 0.3)'};
  backdrop-filter: blur(4px);
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transition: opacity ${AnimationDuration}ms;
`

export const ModalContent = styled.div<{ $visible: boolean; $width?: string | number }>`
  background: ${(props) =>
    getComponentTheme(props.theme, 'modal').contentBg ||
    getThemeToken(props.theme, 'colors').background};
  padding: ${(props) =>
    getComponentTheme(props.theme, 'modal').bodyPadding ||
    `${getThemeToken(props.theme, 'spacing').lg}px`};
  border-radius: ${(props) =>
    getComponentTheme(props.theme, 'modal').borderRadius ||
    `${getThemeToken(props.theme, 'borderRadius').md}px`};
  box-shadow: ${(props) =>
    getComponentTheme(props.theme, 'modal').boxShadow || getThemeToken(props.theme, 'shadows').lg};
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
  margin-bottom: ${(props) => getThemeToken(props.theme, 'spacing').md}px;
`

export const Title = styled.div`
  font-size: ${(props) => getThemeToken(props.theme, 'fontSize').lg}px;
  font-weight: ${(props) => getThemeToken(props.theme, 'fontWeight').bold};
  color: ${(props) => getThemeToken(props.theme, 'colors').text};
  line-height: 1.5;
`

export const CloseBtn = styled(Button)``

export const Footer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin-top: ${(props) => getThemeToken(props.theme, 'spacing').md}px;
`

export const StyledButton = styled(Button)`
  padding: 4px 18px;
  margin: 0;
`
