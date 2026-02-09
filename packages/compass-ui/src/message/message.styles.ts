import styled from '@emotion/styled'
import { keyframes, css } from '@emotion/react'
import { token } from '../theme/token-utils'

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

export const MessageContainer = styled.div`
  position: fixed;
  top: ${token('spacing.md', '16px')};
  left: 0;
  width: 100%;
  pointer-events: none;
  z-index: ${token('components.message.zIndex', '1010')};
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const MessageItem = styled.div`
  padding: ${token('spacing.sm', '8px')};
  text-align: center;
  pointer-events: all;

  &.compass-message-enter {
    opacity: 0;
    transform: translateY(-100%);
  }
  &.compass-message-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: ${token('transitions.slow', 'all 0.3s ease-in-out')};
  }
  &.compass-message-exit {
    opacity: 1;
    transform: translateY(0);
  }
  &.compass-message-exit-active {
    opacity: 0;
    transform: translateY(-100%);
    transition: ${token('transitions.slow', 'all 0.3s ease-in-out')};
  }
`

export const MessageContent = styled.div`
  display: inline-flex;
  align-items: center;
  padding: ${token('components.message.contentPadding', '8px 16px')};
  background: ${token('components.message.contentBg', token('colors.background', '#fff'))};
  border-radius: ${token('components.message.borderRadius', token('borderRadius.lg', '8px'))};
  box-shadow: ${token(
    'components.message.boxShadow',
    token(
      'shadows.lg',
      '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
    ),
  )};
  font-size: ${token('fontSize.sm', '14px')};
  line-height: ${token('lineHeight.normal', '1.5715')};
  color: ${token('components.message.contentColor', token('colors.text', 'rgba(0, 0, 0, 0.88)'))};
`

export const IconWrapper = styled.span<{ $type?: string }>`
  margin-right: ${token('spacing.sm', '8px')};
  display: inline-flex;
  align-items: center;
  font-size: ${token('fontSize.md', '16px')};
  line-height: 1;

  ${({ $type }) => {
    let color = token('colors.primary', '#1890ff')
    switch ($type) {
      case 'success':
        color = token('colors.success', '#52c41a')
        break
      case 'error':
        color = token('colors.error', '#ff4d4f')
        break
      case 'warning':
        color = token('colors.warning', '#faad14')
        break
    }

    if ($type === 'loading') {
      return css`
        color: ${color};
        .anticon {
          display: inline-block;
          animation: ${spin} 1s linear infinite;
        }
      `
    }

    return css`
      color: ${color};
    `
  }}
`
