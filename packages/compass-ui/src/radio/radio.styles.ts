import styled from '@emotion/styled'
import { token } from '../theme/token-utils'

const getControlSize = (size?: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'small':
      return '14px'
    case 'large':
      return '20px'
    case 'medium':
    default:
      return '16px'
  }
}

const getDotSize = (size?: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'small':
      return '6px'
    case 'large':
      return '10px'
    case 'medium':
    default:
      return '8px'
  }
}

export const RadioGroupRoot = styled.div<{ $direction?: 'horizontal' | 'vertical'; $size?: 'small' | 'medium' | 'large' }>`
  display: inline-flex;
  flex-direction: ${({ $direction }) => ($direction === 'horizontal' ? 'row' : 'column')};
  gap: ${token('spacing.sm', '8px')};
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

export const RadioRoot = styled.label<{ $size?: 'small' | 'medium' | 'large'; $disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${token('spacing.sm', '8px')};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  color: ${({ $disabled }) =>
    $disabled ? token('colors.textDisabled', 'rgba(0, 0, 0, 0.25)') : 'inherit'};
  user-select: none;
  width: fit-content;
`

export const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  margin: 0;
`

export const RadioControl = styled.span<{
  $checked?: boolean
  $disabled?: boolean
  $status?: 'error' | 'warning'
  $size?: 'small' | 'medium' | 'large'
}>`
  width: ${({ $size }) => getControlSize($size)};
  height: ${({ $size }) => getControlSize($size)};
  border-radius: 50%;
  border: 1px solid
    ${({ $checked, $status, $disabled }) => {
      if ($disabled) return token('colors.border', '#d9d9d9')
      if ($status === 'error') return token('colors.error', '#ff4d4f')
      if ($status === 'warning') return token('colors.warning', '#faad14')
      if ($checked) return token('colors.primary', '#1890ff')
      return token('colors.border', '#d9d9d9')
    }};
  background: ${token('colors.background', '#fff')};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  transition: ${token('transitions.normal', 'all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)')};

  ${HiddenInput}:focus-visible + & {
    box-shadow: 0 0 0 2px color-mix(in srgb, ${token('colors.primary', '#1890ff')}, white 70%);
  }
`

export const RadioDot = styled.span<{
  $visible?: boolean
  $size?: 'small' | 'medium' | 'large'
}>`
  width: ${({ $size }) => getDotSize($size)};
  height: ${({ $size }) => getDotSize($size)};
  border-radius: 50%;
  background: ${token('colors.primary', '#1890ff')};
  transform: scale(${({ $visible }) => ($visible ? 1 : 0)});
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: ${token('transitions.fast', 'all 0.1s ease-in-out')};
`

export const RadioLabel = styled.span`
  line-height: ${token('lineHeight.normal', '1.5')};
`
