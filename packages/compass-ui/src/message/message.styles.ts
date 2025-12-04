import styled from '@emotion/styled'
import { keyframes, css } from '@emotion/react'

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
  top: ${({ theme }) => theme.spacing?.md || 16}px;
  left: 0;
  width: 100%;
  pointer-events: none;
  z-index: ${({ theme }) => theme?.components?.message?.zIndex || 1010};
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const MessageItem = styled.div`
  padding: ${({ theme }) => theme.spacing?.sm || 8}px;
  text-align: center;
  pointer-events: all;

  &.compass-message-enter {
    opacity: 0;
    transform: translateY(-100%);
  }
  &.compass-message-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: ${({ theme }) => theme.transitions?.slow || 'all 0.3s ease-in-out'};
  }
  &.compass-message-exit {
    opacity: 1;
    transform: translateY(0);
  }
  &.compass-message-exit-active {
    opacity: 0;
    transform: translateY(-100%);
    transition: ${({ theme }) => theme.transitions?.slow || 'all 0.3s ease-in-out'};
  }
`

export const MessageContent = styled.div`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) =>
    theme?.components?.message?.contentPadding ||
    `${theme.spacing?.sm || 8}px ${theme.spacing?.md || 16}px`};
  background: ${({ theme }) => theme.colors?.background || '#fff'};
  border-radius: ${({ theme }) =>
    theme?.components?.message?.borderRadius || `${theme.borderRadius?.lg || 8}px`};
  box-shadow: ${({ theme }) =>
    theme?.components?.message?.boxShadow ||
    theme.shadows?.lg ||
    '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)'};
  font-size: ${({ theme }) => theme.fontSize?.sm || 14}px;
  line-height: ${({ theme }) => theme.lineHeight?.normal || 1.5715};
  color: ${({ theme }) => theme.colors?.text || 'rgba(0, 0, 0, 0.88)'};
`

export const IconWrapper = styled.span<{ $type?: string }>`
  margin-right: ${({ theme }) => theme.spacing?.sm || 8}px;
  display: inline-flex;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSize?.md || 16}px;
  line-height: 1;

  ${({ $type, theme }) => {
    let color = theme?.colors?.primary || '#1890ff'
    switch ($type) {
      case 'success':
        color = theme?.colors?.success || '#52c41a'
        break
      case 'error':
        color = theme?.colors?.error || '#ff4d4f'
        break
      case 'warning':
        color = theme?.colors?.warning || '#faad14'
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
