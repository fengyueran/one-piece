import styled from '@emotion/styled'
import { token } from '../theme/token-utils'

export const AutoCompleteContainer = styled.div<{ fullWidth?: boolean }>`
  position: relative;
  display: inline-block;
  width: ${(props) => (props.fullWidth ? '100%' : 'auto')};
`

export const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: ${token('components.dropdown.zIndex', '1050')};
  box-sizing: border-box;
  padding: 4px;
  overflow: auto;
  font-size: ${token('fontSize.sm', '12px')};
  max-height: 256px;
  background-color: ${token(
    'components.select.backgroundColor',
    token('colors.background', '#fff'),
  )};
  border-radius: ${token('components.select.borderRadius', token('borderRadius.md', '4px'))};
  box-shadow: ${token(
    'components.dropdown.boxShadow',
    token(
      'shadows.lg',
      '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
    ),
  )};
  outline: none;
`

export const OptionItem = styled.div<{ active?: boolean }>`
  position: relative;
  padding: 8px 12px;
  word-break: break-word;
  color: ${token('components.select.optionColor', token('colors.text', 'rgba(0, 0, 0, 0.88)'))};
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  background-color: ${({ active }) =>
    active ? token('components.select.optionHoverBg', '#f5f5f5') : 'transparent'};

  &:hover {
    background-color: ${token('components.select.optionHoverBg', '#f5f5f5')};
  }
`

export const NotFoundContent = styled.div`
  padding: 8px 12px;
  color: ${token('colors.textSecondary', 'rgba(0, 0, 0, 0.45)')};
  text-align: center;
`

export const Highlight = styled.span`
  color: ${token('colors.primary', '#1890ff')};
  font-weight: 500;
`
