import styled from '@emotion/styled'
import { Theme } from '../theme/types'
import { getComponentTheme } from '../theme/utils'

export const ItemWrapper = styled.div`
  margin-bottom: ${({ theme }: { theme: Theme }) =>
    getComponentTheme(theme, 'form').itemMarginBottom};
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
  margin-bottom: ${({ theme }: { theme: Theme }) =>
    getComponentTheme(theme, 'form').errorMarginBottom};
  min-height: 16px;
`
