import styled from '@emotion/styled'
import { token } from '../theme/token-utils'

export const ItemWrapper = styled.div<{ hasError?: boolean }>`
  margin-bottom: ${token('spacing.lg', '24px')};
  position: relative;
  display: flex;
  flex-direction: column;
  width: fit-content;
`

export const Label = styled.label`
  display: block;
  margin-bottom: ${token('components.form.labelMarginBottom', token('spacing.xs', '8px'))};
  font-size: ${token('components.form.labelFontSize', token('fontSize.md', '14px'))};
  color: ${token('components.form.labelColor', token('colors.text', 'rgba(0, 0, 0, 0.88)'))};
`

export const ErrorMessage = styled.div`
  color: ${token('components.form.errorColor', token('colors.error', '#ff4d4f'))};
  font-size: ${token('components.form.errorFontSize', token('fontSize.sm', '12px'))};
  margin-bottom: 0;
  min-height: ${token('spacing.lg', '24px')};
  width: 0;
  min-width: 100%;
  overflow-wrap: break-word;
  word-break: break-all;
  white-space: pre-wrap;
`

export const MarginOffset = styled.div`
  margin-bottom: calc(-1 * ${token('spacing.lg', '24px')});
`
