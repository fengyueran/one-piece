import styled from '@emotion/styled'
import {
  InputWrapper as BaseInputWrapper,
  StyledInput,
  Container,
  Adornment,
} from '../input-field/input-field.styles'
import { token } from '../theme/token-utils'

export { StyledInput, Container, Adornment }

export const InputWrapper = styled(BaseInputWrapper)<{
  size?: 'small' | 'medium' | 'large'
  controls?: boolean
}>`
  padding-right: ${({ size, controls }) => {
    if (!controls) return undefined // Use default padding if no controls
    const map = { small: '30px', medium: '34px', large: '38px' } as const
    return map[size || 'medium']
  }};
`

export const StepperWrapper = styled.div<{ size?: 'small' | 'medium' | 'large' }>`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 22px;
  border-left: 1px solid ${token('colors.border', '#d9d9d9')};
  border-radius: 0 ${token('components.input.borderRadius', token('borderRadius.md', '4px'))}
    ${token('components.input.borderRadius', token('borderRadius.md', '4px'))} 0;
  overflow: hidden;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
  z-index: 1; // Ensure it sits above input content area if needed

  // Show when InputWrapper (parent) is hovered or focused within
  .compass-input-number:hover &,
  .compass-input-number:focus-within & {
    opacity: 1;
    pointer-events: auto;
  }

  // Sync border color with parent hover state
  .compass-input-number:hover & {
    border-left-color: ${token(
      'components.input.hoverBorderColor',
      token('colors.primary', '#4096ff'),
    )};
  }

  // Sync border color with parent focus state
  .compass-input-number:focus-within & {
    border-left-color: ${token(
      'components.input.activeBorderColor',
      token('colors.primary', '#40a9ff'),
    )};
  }
`

export const StepperButton = styled.button<{
  disabled?: boolean
  $size?: 'small' | 'medium' | 'large'
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  width: 22px;
  padding: 0;
  border: none;
  border-bottom: 1px solid ${token('colors.border', '#d9d9d9')};
  background: transparent;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  color: ${({ disabled }) =>
    disabled ? token('colors.textTertiary', '#bfbfbf') : token('colors.textSecondary', '#595959')};
  transition: all 0.2s;

  // Sync separator border color
  .compass-input-number:hover & {
    border-bottom-color: ${token(
      'components.input.hoverBorderColor',
      token('colors.primary', '#4096ff'),
    )};
  }
  .compass-input-number:focus-within & {
    border-bottom-color: ${token(
      'components.input.activeBorderColor',
      token('colors.primary', '#40a9ff'),
    )};
  }

  &:last-of-type {
    border-bottom: none;
  }

  &:hover:not(:disabled) {
    flex: 1.4; // Expand height on hover (60/40 ratio)
    background: ${token('colors.backgroundSecondary', '#f5f5f5')};
    color: ${token('colors.text', '#000')};
  }

  &:active:not(:disabled) {
    background: ${token('colors.backgroundTertiary', '#e6e6e6')};
  }

  svg {
    width: ${({ $size }) => ($size === 'small' ? '9px' : '12px')};
    height: ${({ $size }) => ($size === 'small' ? '9px' : '12px')};
  }
`
