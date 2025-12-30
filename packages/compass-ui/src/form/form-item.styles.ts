import styled from '@emotion/styled'
import { Theme } from '../theme/types'
import { getComponentTheme } from '../theme/utils'

export const ItemWrapper = styled.div<{ hasError?: boolean }>`
  margin-bottom: ${({ theme, hasError }) =>
    hasError ? '0' : getComponentTheme(theme, 'form').itemMarginBottom};
  position: relative;
  display: flex;
  flex-direction: column;
  width: fit-content;
`

export const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }: { theme: Theme }) =>
    getComponentTheme(theme, 'form').labelMarginBottom};
  font-size: ${({ theme }: { theme: Theme }) => getComponentTheme(theme, 'form').labelFontSize};
  color: ${({ theme }: { theme: Theme }) => getComponentTheme(theme, 'form').labelColor};
`

export const ErrorMessage = styled.div`
  color: ${({ theme }: { theme: Theme }) => getComponentTheme(theme, 'form').errorColor};
  font-size: ${({ theme }: { theme: Theme }) => getComponentTheme(theme, 'form').errorFontSize};
  margin-top: ${({ theme }: { theme: Theme }) => getComponentTheme(theme, 'form').errorMarginTop};
  margin-bottom: 0;
  min-height: ${({ theme }: { theme: Theme }) => getComponentTheme(theme, 'form').itemMarginBottom};
  width: 0;
  min-width: 100%;
  overflow-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
`
