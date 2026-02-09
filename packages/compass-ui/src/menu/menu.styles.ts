import styled from '@emotion/styled'
import { token } from '../theme/token-utils'

export const StyledMenu = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`

export const StyledMenuItem = styled.li<{
  $disabled?: boolean
  $danger?: boolean
  $selected?: boolean
}>`
  display: flex;
  align-items: center;
  margin: 0;
  padding: ${token('components.menu.itemPadding', '0 12px')};
  height: ${token('components.menu.itemHeight', '32px')};
  color: ${({ $danger, $selected }) => {
    if ($danger) return token('colors.error', '#ff4d4f')
    if ($selected) return token('colors.primary', '#1677ff')
    return token('components.menu.itemColor', 'rgba(0, 0, 0, 0.88)')
  }};
  background-color: ${({ $selected }) =>
    $selected ? token('components.menu.itemSelectedBg', '#e6f7ff') : 'transparent'};
  font-size: ${token('components.menu.fontSize', '14px')};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.3s;
  border-radius: ${token('components.menu.borderRadius', '4px')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};

  &:hover {
    background-color: ${({ $disabled, $danger, $selected }) => {
      if ($disabled) return 'transparent'
      if ($danger) return '#fff2f0'
      if ($selected) return token('components.menu.itemSelectedBg', '#e6f7ff')
      return token('components.menu.itemHoverBg', '#f5f5f5')
    }};
  }
`

export const IconWrapper = styled.span`
  margin-right: 8px;
  display: inline-flex;
  align-items: center;
`
