import styled from '@emotion/styled'
import { token } from '../theme/token-utils'

export const DropdownContainer = styled.div<{
  $disabled?: boolean
}>`
  display: inline-block;
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
`

export const OverlayContainer = styled.div`
  min-width: 120px;
  padding: ${token('components.dropdown.padding', '4px')};
  background-color: ${token(
    'components.dropdown.backgroundColor',
    token('colors.background', '#ffffff'),
  )};
  border-radius: ${token('components.dropdown.borderRadius', token('borderRadius.md', '4px'))};
  box-shadow: ${token(
    'components.dropdown.boxShadow',
    token(
      'shadows.lg',
      '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
    ),
  )};
  list-style: none;
  z-index: ${token('components.dropdown.zIndex', '1050')};

  /* Layout fixed properties */
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .compass-dropdown-content {
    width: 100%;
  }
`
