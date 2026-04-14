import styled from '@emotion/styled'
import { token } from '../theme/token-utils'

const getTrackWidth = (size?: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'small':
      return '28px'
    case 'large':
      return '44px'
    case 'medium':
    default:
      return '36px'
  }
}

const getTrackHeight = (size?: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'small':
      return '16px'
    case 'large':
      return '24px'
    case 'medium':
    default:
      return '20px'
  }
}

const getThumbSize = (size?: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'small':
      return '12px'
    case 'large':
      return '20px'
    case 'medium':
    default:
      return '16px'
  }
}

const getThumbOffset = (size?: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'small':
      return '12px'
    case 'large':
      return '20px'
    case 'medium':
    default:
      return '16px'
  }
}

export const SwitchRoot = styled.label<{ $disabled?: boolean; $size?: 'small' | 'medium' | 'large' }>`
  display: inline-flex;
  align-items: center;
  gap: ${token('spacing.sm', '8px')};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  color: ${({ $disabled }) =>
    $disabled ? token('colors.textDisabled', 'rgba(0, 0, 0, 0.25)') : 'inherit'};
  user-select: none;
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

export const SwitchTrack = styled.span<{
  $checked?: boolean
  $disabled?: boolean
  $status?: 'error' | 'warning'
  $size?: 'small' | 'medium' | 'large'
}>`
  position: relative;
  display: inline-flex;
  align-items: center;
  width: ${({ $size }) => getTrackWidth($size)};
  height: ${({ $size }) => getTrackHeight($size)};
  border-radius: 999px;
  background: ${({ $checked, $disabled, $status }) => {
    if ($disabled) return token('colors.textDisabled', 'rgba(0, 0, 0, 0.25)')
    if ($status === 'error') return token('colors.error', '#ff4d4f')
    if ($status === 'warning') return token('colors.warning', '#faad14')
    return $checked ? token('colors.primary', '#1890ff') : token('colors.textDisabled', 'rgba(0, 0, 0, 0.25)')
  }};
  transition: ${token('transitions.normal', 'all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)')};
  box-sizing: border-box;
  padding: 2px;

  ${HiddenInput}:focus-visible + & {
    box-shadow: 0 0 0 2px color-mix(in srgb, ${token('colors.primary', '#1890ff')}, white 70%);
  }
`

export const SwitchThumb = styled.span<{
  $checked?: boolean
  $size?: 'small' | 'medium' | 'large'
}>`
  position: absolute;
  top: 50%;
  left: 2px;
  width: ${({ $size }) => getThumbSize($size)};
  height: ${({ $size }) => getThumbSize($size)};
  border-radius: 50%;
  background: ${token('colors.white', '#fff')};
  transform: translate(${({ $checked, $size }) => ($checked ? getThumbOffset($size) : '0')}, -50%);
  transition: ${token('transitions.normal', 'all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)')};
  box-shadow: ${token('shadows.sm', '0 1px 2px rgba(0, 0, 0, 0.03)')};
`

export const SwitchInner = styled.span<{ $checked?: boolean; $size?: 'small' | 'medium' | 'large' }>`
  width: 100%;
  padding-left: ${({ $checked, $size }) => ($checked ? '6px' : `calc(${getThumbOffset($size)} + 6px)`)};
  padding-right: ${({ $checked, $size }) => ($checked ? `calc(${getThumbOffset($size)} + 6px)` : '6px')};
  display: inline-flex;
  justify-content: ${({ $checked }) => ($checked ? 'flex-start' : 'flex-end')};
  align-items: center;
  color: ${token('colors.white', '#fff')};
  font-size: 10px;
  line-height: 1;
  overflow: hidden;
`

export const SwitchLabel = styled.span`
  line-height: ${token('lineHeight.normal', '1.5')};
`
