import styled from '@emotion/styled'

export const StyledMenu = styled.div`
  margin: 0;
  padding: 0;
  list-style: none;
`

export const StyledMenuItem = styled.div<{
  $disabled?: boolean
  $danger?: boolean
  $selected?: boolean
}>`
  display: flex;
  align-items: center;
  margin: 0;
  padding: ${({ theme }) => theme?.components?.menu?.itemPadding || '0 12px'};
  height: ${({ theme }) => theme?.components?.menu?.itemHeight || '32px'};
  color: ${({ theme, $danger, $selected }) => {
    if ($danger) return theme?.colors?.error || '#ff4d4f'
    if ($selected) return theme?.colors?.primary || '#1677ff'
    return theme?.components?.menu?.itemColor || 'rgba(0, 0, 0, 0.88)'
  }};
  background-color: ${({ theme, $selected }) =>
    $selected ? theme?.components?.menu?.itemSelectedBg || '#e6f7ff' : 'transparent'};
  font-size: ${({ theme }) => theme?.components?.menu?.fontSize || '14px'};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.3s;
  border-radius: ${({ theme }) => theme?.components?.menu?.borderRadius || '4px'};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};

  &:hover {
    background-color: ${({ theme, $disabled, $danger, $selected }) => {
      if ($disabled) return 'transparent'
      if ($danger) return '#fff2f0'
      if ($selected) return theme?.components?.menu?.itemSelectedBg || '#e6f7ff'
      return theme?.components?.menu?.itemHoverBg || '#f5f5f5'
    }};
  }
`

export const IconWrapper = styled.span`
  margin-right: 8px;
  display: inline-flex;
  align-items: center;
`
