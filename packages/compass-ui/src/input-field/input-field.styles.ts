import styled from '@emotion/styled'
import { getComponentTheme, getThemeColors } from '../theme/utils'

export const Container = styled.div<{ fullWidth?: boolean }>`
  display: inline-flex;
  flex-direction: column;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : '320px')};
`

export const Label = styled.label`
  font-size: 14px;
  margin-bottom: 4px;
  color: ${({ theme }) => getThemeColors(theme).text};
`

export const HelperText = styled.div<{ error?: boolean }>`
  font-size: 12px;
  margin-top: 4px;
  color: ${({ theme, error }) =>
    error ? getThemeColors(theme).error : getThemeColors(theme).textSecondary};
`

export const Adornment = styled.span<{ $position?: 'start' | 'end' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => getThemeColors(theme).textSecondary};
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
  color: ${({ theme }) => getThemeColors(theme).textTertiary};
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
    color: ${({ theme }) => getThemeColors(theme).textSecondary};
  }
`

export const StyledInput = styled.input<{ $size?: 'small' | 'medium' | 'large' }>`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 0;
  margin: 0;
  color: ${({ theme }) => getThemeColors(theme).text};
  font-size: ${({ theme, $size }) => {
    const map = { small: 'sm', medium: 'md', large: 'lg' } as const
    return getComponentTheme(theme, 'input').fontSize[map[$size || 'medium']]
  }};
  width: 100%;

  &::placeholder {
    color: ${({ theme }) => getThemeColors(theme).textDisabled};
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
  error?: boolean
  disabled?: boolean
  focused?: boolean
  size?: 'small' | 'medium' | 'large'
}>`
  display: flex;
  align-items: center;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  background-color: ${({ theme }) => getThemeColors(theme).background};
  border: 1px solid
    ${({ theme, error, focused }) => {
      const colors = getThemeColors(theme)
      const inputTheme = getComponentTheme(theme, 'input')
      if (error) return colors.error
      if (focused) return inputTheme.activeBorderColor
      return colors.border
    }};
  border-radius: ${({ theme }) => getComponentTheme(theme, 'input').borderRadius};
  padding: ${({ theme, size }) => {
    const map = { small: 'sm', medium: 'md', large: 'lg' } as const
    return getComponentTheme(theme, 'input').padding[map[size || 'medium']]
  }};
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme, error, focused, disabled }) => {
      const colors = getThemeColors(theme)
      const inputTheme = getComponentTheme(theme, 'input')
      if (disabled) return colors.border
      if (error) return colors.error
      if (focused) return inputTheme.activeBorderColor
      return inputTheme.hoverBorderColor
    }};

    .compass-input-clear-button[data-visible='true'] {
      opacity: 1;
      pointer-events: auto;
    }
  }

  ${({ disabled, theme }) =>
    disabled &&
    `
    background-color: ${getThemeColors(theme).backgroundSecondary};
    cursor: not-allowed;
    opacity: 0.6;
  `}
`
