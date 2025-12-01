import styled from '@emotion/styled'

export const MessageContainer = styled.div`
  position: fixed;
  top: 16px;
  left: 0;
  width: 100%;
  pointer-events: none;
  z-index: 1010;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const MessageItem = styled.div`
  padding: 8px;
  text-align: center;
  pointer-events: all;

  &.compass-message-enter {
    opacity: 0;
    transform: translateY(-100%);
  }
  &.compass-message-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: all 0.3s ease-in-out;
  }
  &.compass-message-exit {
    opacity: 1;
    transform: translateY(0);
  }
  &.compass-message-exit-active {
    opacity: 0;
    transform: translateY(-100%);
    transition: all 0.3s ease-in-out;
  }
`

export const MessageContent = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 10px 16px;
  background: #fff;
  border-radius: 4px;
  box-shadow:
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05);
  font-size: 14px;
  line-height: 1.5715;
`

export const IconWrapper = styled.span<{ $type?: string }>`
  margin-right: 8px;
  display: inline-flex;
  align-items: center;
  font-size: 16px;

  ${({ $type, theme }) => {
    switch ($type) {
      case 'success':
        return `color: ${theme?.colors?.success || '#52c41a'};`
      case 'error':
        return `color: ${theme?.colors?.error || '#ff4d4f'};`
      case 'warning':
        return `color: ${theme?.colors?.warning || '#faad14'};`
      case 'loading':
        return `color: ${theme?.colors?.primary || '#1890ff'};`
      default:
        return `color: ${theme?.colors?.primary || '#1890ff'};`
    }
  }}
`
