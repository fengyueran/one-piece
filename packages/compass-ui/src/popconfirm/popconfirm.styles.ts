import styled from '@emotion/styled'
import { token } from '../theme/token-utils'

export const PopconfirmContent = styled.div`
  min-width: ${token('components.popconfirm.minWidth', '240px')};
`

export const PopconfirmTitle = styled.div`
  color: ${token('components.popconfirm.titleColor', token('colors.text', 'rgba(0, 0, 0, 0.88)'))};
  font-size: ${token('components.popconfirm.titleFontSize', token('fontSize.md', '14px'))};
  font-weight: ${token('fontWeight.semibold', '600')};
  line-height: 1.5;
`

export const PopconfirmDescription = styled.div`
  margin-top: ${token('components.popconfirm.descriptionMarginTop', '8px')};
  color: ${token(
    'components.popconfirm.descriptionColor',
    token('colors.textSecondary', 'rgba(0, 0, 0, 0.65)'),
  )};
  font-size: ${token('components.popconfirm.descriptionFontSize', token('fontSize.sm', '13px'))};
  line-height: 1.6;
`

export const PopconfirmActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${token('components.popconfirm.actionsGap', '8px')};
  margin-top: ${token('components.popconfirm.actionsMarginTop', '14px')};
`
