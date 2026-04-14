import styled from '@emotion/styled'
import { token } from '../theme/token-utils'

const alertTypeMap = {
  info: {
    background: token('colors.infoBg', '#e6f4ff'),
    border: token('colors.infoBorder', '#91caff'),
    accent: token('colors.info', '#1677ff'),
  },
  success: {
    background: token('colors.successBg', '#f6ffed'),
    border: token('colors.successBorder', '#b7eb8f'),
    accent: token('colors.success', '#52c41a'),
  },
  warning: {
    background: token('colors.warningBg', '#fffbe6'),
    border: token('colors.warningBorder', '#ffe58f'),
    accent: token('colors.warning', '#faad14'),
  },
  error: {
    background: token('colors.errorBg', '#fff2f0'),
    border: token('colors.errorBorder', '#ffccc7'),
    accent: token('colors.error', '#ff4d4f'),
  },
}

export const AlertRoot = styled.div<{
  $type: 'info' | 'success' | 'warning' | 'error'
}>`
  display: flex;
  gap: ${token('spacing.md', '12px')};
  align-items: flex-start;
  width: 100%;
  box-sizing: border-box;
  padding: ${token('spacing.md', '12px')} ${token('spacing.lg', '16px')};
  border-radius: ${token('borderRadius.md', '8px')};
  border: 1px solid ${({ $type }) => alertTypeMap[$type].border};
  background: ${({ $type }) => alertTypeMap[$type].background};
  color: ${token('colors.text', '#1f1f1f')};
`

export const AlertIcon = styled.span<{
  $type: 'info' | 'success' | 'warning' | 'error'
}>`
  display: inline-flex;
  flex-shrink: 0;
  margin-top: 2px;
  color: ${({ $type }) => alertTypeMap[$type].accent};

  svg {
    width: 18px;
    height: 18px;
  }
`

export const AlertContent = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: ${token('spacing.xs', '4px')};
`

export const AlertTitle = styled.div`
  font-size: ${token('fontSize.md', '16px')};
  font-weight: 600;
  line-height: ${token('lineHeight.normal', '1.5')};
`

export const AlertDescription = styled.div`
  font-size: ${token('fontSize.sm', '14px')};
  line-height: ${token('lineHeight.normal', '1.5')};
  color: ${token('colors.textSecondary', '#595959')};
`

export const AlertAction = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${token('spacing.sm', '8px')};
  margin-left: auto;
  padding-left: ${token('spacing.md', '12px')};
`

export const AlertCloseButton = styled.button`
  border: none;
  background: transparent;
  color: ${token('colors.textSecondary', '#8c8c8c')};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: 20px;
  height: 20px;
  border-radius: ${token('borderRadius.sm', '4px')};

  &:hover {
    color: ${token('colors.text', '#1f1f1f')};
    background: color-mix(in srgb, ${token('colors.text', '#1f1f1f')} 10%, transparent);
  }

  &:focus-visible {
    outline: 2px solid ${token('colors.primary', '#1677ff')};
    outline-offset: 2px;
  }
`
