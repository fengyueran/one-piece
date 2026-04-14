import styled from '@emotion/styled'
import { token } from '../theme/token-utils'

const getControlSize = (size?: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'small':
      return token('components.checkbox.size.sm', '14px')
    case 'large':
      return token('components.checkbox.size.lg', '20px')
    case 'medium':
    default:
      return token('components.checkbox.size.md', '16px')
  }
}

export const CheckboxRoot = styled.label<{
  $size?: 'small' | 'medium' | 'large'
  $disabled?: boolean
}>`
  display: inline-flex;
  align-items: center;
  gap: ${token('spacing.sm', '8px')};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  color: ${({ $disabled }) =>
    $disabled ? token('colors.textDisabled', 'rgba(0, 0, 0, 0.25)') : 'inherit'};
  user-select: none;
  width: fit-content;
  font-size: ${({ $size }) => {
    switch ($size) {
      case 'small':
        return token('fontSize.xs', '12px')
      case 'large':
        return token('fontSize.md', '16px')
      case 'medium':
      default:
        return token('fontSize.sm', '14px')
    }
  }};
`

export const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  margin: 0;
`

export const CheckboxControl = styled.span<{
  $checked?: boolean
  $indeterminate?: boolean
  $disabled?: boolean
  $status?: 'error' | 'warning'
  $size?: 'small' | 'medium' | 'large'
}>`
  width: ${({ $size }) => getControlSize($size)};
  height: ${({ $size }) => getControlSize($size)};
  border-radius: ${token('components.checkbox.borderRadius', token('borderRadius.sm', '4px'))};
  border: 1px solid
    ${({ $checked, $status, $disabled }) => {
      if ($disabled) return token('colors.border', '#d9d9d9')
      if ($status === 'error') return token('colors.error', '#ff4d4f')
      if ($status === 'warning') return token('colors.warning', '#faad14')
      if ($checked) {
        return token('components.checkbox.checkedBorderColor', token('colors.primary', '#1890ff'))
      }
      return token('components.checkbox.borderColor', token('colors.border', '#d9d9d9'))
    }};
  background: ${({ $checked, $indeterminate, $disabled }) => {
    if ($disabled) {
      return token('components.checkbox.disabledBg', token('colors.backgroundSecondary', '#fafafa'))
    }
    if ($checked || $indeterminate) {
      return token('components.checkbox.checkedBg', token('colors.primary', '#1890ff'))
    }
    return token('colors.background', '#fff')
  }};
  color: ${token('components.checkbox.iconColor', token('colors.white', '#fff'))};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  transition: ${token('transitions.normal', 'all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)')};
  flex-shrink: 0;

  input:focus-visible + & {
    box-shadow: 0 0 0 2px
      color-mix(
        in srgb,
        ${token('components.checkbox.focusRingColor', token('colors.primary', '#1890ff'))},
        white 70%
      );
  }
`

export const CheckboxIndicator = styled.span<{
  $visible?: boolean
  $indeterminate?: boolean
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: scale(${({ $visible }) => ($visible ? 1 : 0.6)});
  transition: ${token('transitions.fast', 'all 0.1s ease-in-out')};

  svg {
    width: 0.8em;
    height: 0.8em;
  }

  ${({ $indeterminate }) =>
    $indeterminate &&
    `
      &::before {
        content: '';
        width: 8px;
        height: 2px;
        border-radius: 999px;
        background: currentColor;
      }

      svg {
        display: none;
      }
    `}
`

export const CheckboxLabel = styled.span`
  color: ${token('components.checkbox.labelColor', token('colors.text', 'rgba(0, 0, 0, 0.88)'))};
  line-height: ${token('lineHeight.normal', '1.5')};
`
