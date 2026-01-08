import styled from '@emotion/styled'
import { getThemeToken, getComponentTheme } from '../theme/utils'

export const AutoCompleteContainer = styled.div<{ fullWidth?: boolean }>`
  position: relative;
  display: inline-block;
  width: ${(props) => (props.fullWidth ? '100%' : 'auto')};
`

export const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: ${({ theme }) => getComponentTheme(theme, 'dropdown').zIndex};
  box-sizing: border-box;
  padding: 4px;
  overflow: auto;
  font-size: ${({ theme }) => getThemeToken(theme, 'fontSize').sm}px;
  max-height: 256px;
  background-color: ${({ theme }) => getComponentTheme(theme, 'select').backgroundColor};
  border-radius: ${({ theme }) => getComponentTheme(theme, 'select').borderRadius};
  box-shadow: ${({ theme }) => getComponentTheme(theme, 'dropdown').boxShadow};
  outline: none;
`

export const OptionItem = styled.div<{ active?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  color: ${({ theme }) => getComponentTheme(theme, 'select').optionColor};
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  background-color: ${({ active, theme }) =>
    active ? getComponentTheme(theme, 'select').optionHoverBg : 'transparent'};

  &:hover {
    background-color: ${({ theme }) => getComponentTheme(theme, 'select').optionHoverBg};
  }
`

export const NotFoundContent = styled.div`
  padding: 8px 12px;
  color: ${({ theme }) => getThemeToken(theme, 'colors').textSecondary};
  text-align: center;
`

export const Highlight = styled.span`
  color: ${({ theme }) => getThemeToken(theme, 'colors').primary};
  font-weight: 500;
`
