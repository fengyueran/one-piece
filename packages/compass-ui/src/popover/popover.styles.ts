import styled from '@emotion/styled'
import { token } from '../theme/token-utils'

export const PopoverOverlay = styled.div`
  z-index: ${token('components.popover.zIndex', '1060')};
`

export const PopoverCard = styled.div`
  min-width: ${token('components.popover.minWidth', '220px')};
  max-width: ${token('components.popover.maxWidth', '320px')};
  border-radius: ${token('components.popover.borderRadius', token('borderRadius.md', '8px'))};
  background: ${token('components.popover.backgroundColor', token('colors.background', '#fff'))};
  box-shadow: ${token(
    'components.popover.boxShadow',
    '0 8px 24px rgba(0, 0, 0, 0.14), 0 4px 10px rgba(0, 0, 0, 0.08)',
  )};
  border: 1px solid ${token('components.popover.borderColor', 'rgba(5, 5, 5, 0.08)')};
  overflow: hidden;
`

export const PopoverHeader = styled.div`
  padding: ${token('components.popover.headerPadding', '12px 14px 0')};
`

export const PopoverTitle = styled.div`
  color: ${token('components.popover.titleColor', token('colors.text', 'rgba(0, 0, 0, 0.88)'))};
  font-size: ${token('components.popover.titleFontSize', token('fontSize.md', '14px'))};
  font-weight: ${token('fontWeight.semibold', '600')};
  line-height: 1.5;
`

export const PopoverBody = styled.div`
  padding: ${token('components.popover.bodyPadding', '12px 14px 14px')};
  color: ${token(
    'components.popover.bodyColor',
    token('colors.textSecondary', 'rgba(0, 0, 0, 0.65)'),
  )};
  font-size: ${token('components.popover.bodyFontSize', token('fontSize.sm', '13px'))};
  line-height: 1.6;
`
