import styled from '@emotion/styled'
import { token } from '../theme/token-utils'
import { Adornment, ClearButton, Container, InputWrapper } from '../input/input.styles'

export { Adornment, ClearButton, Container }

export const TextareaWrapper = styled(InputWrapper)`
  align-items: flex-start;
`

export const StyledTextarea = styled.textarea<{ $size?: 'small' | 'medium' | 'large' }>`
  flex: 1;
  width: 100%;
  border: none;
  outline: none;
  resize: vertical;
  background: transparent;
  padding: 0;
  margin: 0;
  color: ${token('colors.text', 'rgba(0, 0, 0, 0.88)')};
  line-height: 1.5715;
  min-height: ${({ $size }) => {
    switch ($size) {
      case 'small':
        return '54px'
      case 'large':
        return '94px'
      default:
        return '74px'
    }
  }};
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

  &::placeholder {
    color: ${token('colors.textDisabled', 'rgba(0, 0, 0, 0.25)')};
  }

  &:disabled {
    cursor: not-allowed;
  }
`
