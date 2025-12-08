import styled from '@emotion/styled'

export const StyledMenu = styled.div`
  margin: 0;
  padding: 0;
  list-style: none;
`

export const StyledMenuItem = styled.div<{ $disabled?: boolean; $danger?: boolean }>`
  display: flex;
  align-items: center;
  margin: 0;
  padding: ${({ theme }) => theme?.components?.menu?.itemPadding || '0 12px'};
  height: ${({ theme }) => theme?.components?.menu?.itemHeight || '32px'};
  color: ${({ theme, $danger }) =>
    $danger
      ? theme?.colors?.error || '#ff4d4f'
      : theme?.components?.menu?.itemColor || 'rgba(0, 0, 0, 0.88)'};
  font-size: ${({ theme }) => theme?.components?.menu?.fontSize || '14px'};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.3s;
  border-radius: ${({ theme }) => theme?.components?.menu?.borderRadius || '4px'};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};

  &:hover {
    background-color: ${({ theme, $disabled, $danger }) => {
      if ($disabled) return 'transparent'
      if ($danger) return '#fff2f0' // Light error bg
      return theme?.components?.menu?.itemHoverBg || '#f5f5f5'
    }};
  }
`

export const IconWrapper = styled.span`
  margin-right: 8px;
  display: inline-flex;
  align-items: center;
`
