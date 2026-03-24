import styled from '@emotion/styled'
import { token } from '../theme/token-utils'

export const TooltipTrigger = styled.span`
  position: relative;
  display: inline-flex;
`

export const TooltipOverlay = styled.div`
  max-width: ${token('components.tooltip.maxWidth', '240px')};
  padding: ${token('components.tooltip.padding', '6px 10px')};
  color: ${token('components.tooltip.contentColor', '#ffffff')};
  background: ${token('components.tooltip.backgroundColor', 'rgba(0, 0, 0, 0.85)')};
  border-radius: ${token('components.tooltip.borderRadius', token('borderRadius.sm', '8px'))};
  box-shadow: ${token(
    'components.tooltip.boxShadow',
    token('shadows.sm', '0 1px 2px rgba(0, 0, 0, 0.03)'),
  )};
  font-size: ${token('components.tooltip.fontSize', token('fontSize.sm', '14px'))};
  line-height: 1.5;
  word-break: break-word;
  z-index: ${token('components.tooltip.zIndex', '1070')};
`

export const TooltipArrow = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  background: ${token('components.tooltip.backgroundColor', 'rgba(0, 0, 0, 0.85)')};
  transform: rotate(45deg);
`
