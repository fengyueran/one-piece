import styled from '@emotion/styled'
import { token } from '../theme/token-utils'

export const Container = styled.div<{ fullWidth?: boolean }>`
  display: inline-flex;
  flex-direction: column;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : '320px')};
`

export const Adornment = styled.span<{ $position?: 'start' | 'end' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${token('colors.textSecondary', 'rgba(0, 0, 0, 0.45)')};
  flex-shrink: 0;
  line-height: 0;
  margin-right: ${({ $position }) => ($position === 'start' ? '8px' : '0')};
  margin-left: ${({ $position }) => ($position === 'end' ? '8px' : '0')};
`

export const ClearButton = styled.button<{ visible?: boolean; $isHoverShow?: boolean }>`
  background: none;
  border: none;
  padding: 0;
  margin: 0 4px 0 8px;
  cursor: pointer;
  color: ${token('colors.textTertiary', 'rgba(0, 0, 0, 0.25)')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  line-height: 0;
  transition:
    color 0.2s,
    opacity 0.2s;
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
  opacity: ${({ visible, $isHoverShow }) => {
    if (!visible) return 0
    if ($isHoverShow) return 0
    return 1
  }};
  pointer-events: ${({ visible, $isHoverShow }) => {
    if (!visible) return 'none'
    if ($isHoverShow) return 'none'
    return 'auto'
  }};

  &:hover {
    color: ${token('colors.textSecondary', 'rgba(0, 0, 0, 0.45)')};
  }
`

export const StyledInput = styled.input<{ $size?: 'small' | 'medium' | 'large' }>`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 0;
  margin: 0;
  color: ${token('colors.text', 'rgba(0, 0, 0, 0.88)')};
  font-size: ${({ $size }) => {
    switch ($size) {
      case 'small':
        return token('components.input.fontSize.sm', token('fontSize.sm', '12px'))
      case 'large':
        return token('components.input.fontSize.lg', token('fontSize.lg', '16px'))
      default:
        return token('components.input.fontSize.md', token('fontSize.md', '14px'))
    }
  }};
  width: 100%;

  &::placeholder {
    color: ${token('colors.textDisabled', 'rgba(0, 0, 0, 0.25)')};
  }

  &:disabled {
    cursor: not-allowed;
  }

  &::-webkit-search-decoration,
  &::-webkit-search-cancel-button,
  &::-webkit-search-results-button,
  &::-webkit-search-results-decoration {
    -webkit-appearance: none;
    appearance: none;
    display: none;
  }

  &::-ms-reveal,
  &::-ms-clear {
    display: none;
    width: 0;
    height: 0;
  }
`

export const InputWrapper = styled.div<{
  disabled?: boolean
  focused?: boolean
  status?: 'error' | 'warning'
  size?: 'small' | 'medium' | 'large'
}>`
  display: flex;
  align-items: center;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  background-color: ${token('colors.background', '#fff')};
  border: 1px solid
    ${({ focused, status }) => {
      if (status === 'error') return token('colors.error', '#ff4d4f')
      if (status === 'warning') return token('colors.warning', '#faad14')
      if (focused)
        return token('components.input.activeBorderColor', token('colors.primary', '#1890ff'))
      return token('colors.border', '#d9d9d9')
    }};
  border-radius: ${token('components.input.borderRadius', token('borderRadius.md', '6px'))};
  padding: ${({ size }) => {
    switch (size) {
      case 'small':
        return token('components.input.padding.sm', '1px 7px')
      case 'large':
        return token('components.input.padding.lg', '6px 11px')
      default:
        return token('components.input.padding.md', '4px 11px')
    }
  }};
  transition: all 0.2s;

  &:hover {
    border-color: ${({ focused, disabled, status }) => {
      if (disabled) return token('colors.border', '#d9d9d9')
      if (status === 'error') return token('colors.errorHover', '#ff7875') // lighten error
      if (status === 'warning') return token('colors.warningHover', '#ffc53d') // lighten warning
      if (focused)
        return token('components.input.activeBorderColor', token('colors.primary', '#1890ff'))
      return token('components.input.hoverBorderColor', token('colors.primary', '#1890ff'))
    }};

    .compass-input-clear-button[data-visible='true'] {
      opacity: 1;
      pointer-events: auto;
    }
  }

  ${({ disabled }) =>
    disabled &&
    `
    background-color: ${token('colors.backgroundSecondary', '#f5f5f5')};
    cursor: not-allowed;
    opacity: 0.6;
  `}
`
