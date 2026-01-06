import styled from '@emotion/styled'
import { Theme } from '../theme'
import { getThemeToken, getComponentTheme } from '../theme/utils'

export const StyledTableWrapper = styled.div<{
  bordered?: boolean
}>`
  position: relative;
  width: 100%;
  overflow-x: auto;
  border-radius: 8px;
  border: ${({ bordered, theme }) => {
    const colors = getThemeToken(theme as Theme, 'colors')
    return bordered ? `1px solid ${colors.border}` : 'none'
  }};
`

export const StyledTable = styled.table<{ scrollY?: string | number }>`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  background-color: ${({ theme }) => getComponentTheme(theme as Theme, 'table').bodyBg};
  display: ${({ scrollY }) => (scrollY ? 'flex' : 'table')};
  flex-direction: column;
`

export const StyledThead = styled.thead<{ scrollY?: string | number }>`
  background-color: ${({ theme }) => getComponentTheme(theme as Theme, 'table').headerBg};
  ${({ scrollY }) => (scrollY ? 'flex: 0 0 auto;' : '')}
`

export const StyledTbody = styled.tbody<{ scrollY?: string | number }>`
  ${({ scrollY }) =>
    scrollY
      ? `
      display: block;
      overflow-y: auto;
      max-height: ${typeof scrollY === 'number' ? `${scrollY}px` : scrollY};
      flex: 1 1 auto;
    `
      : ''}

  & > tr:last-child > td {
    border-bottom: none;
  }
`

export const StyledTr = styled.tr<{ scrollY?: string | number }>`
  transition: background-color 0.2s;
  ${({ scrollY }) =>
    scrollY
      ? `
    display: table;
    width: 100%;
    table-layout: fixed;
  `
      : ''}

  &:hover {
    background-color: ${({ theme }) => getComponentTheme(theme as Theme, 'table').rowHoverBg};
  }

  &:not(:last-child) {
    border-bottom: 1px solid
      ${({ theme }) => getComponentTheme(theme as Theme, 'table').borderColor};
  }
`

export const StyledTh = styled.th<{
  align?: 'left' | 'center' | 'right'
  width?: string | number
  size?: 'small' | 'medium' | 'large'
}>`
  padding: ${({ size }) =>
    size === 'small' ? '8px 8px' : size === 'large' ? '16px 16px' : '12px 16px'};
  color: ${({ theme }) => getComponentTheme(theme as Theme, 'table').headerColor};
  font-weight: 600;
  text-align: ${({ align }) => align || 'left'};
  width: ${({ width }) => (typeof width === 'number' ? `${width}px` : width)};
  white-space: nowrap;
`

export const StyledTd = styled.td<{
  align?: 'left' | 'center' | 'right'
  size?: 'small' | 'medium' | 'large'
}>`
  padding: ${({ size }) =>
    size === 'small' ? '8px 8px' : size === 'large' ? '16px 16px' : '12px 16px'};
  color: ${({ theme }) => getComponentTheme(theme as Theme, 'table').color};
  text-align: ${({ align }) => align || 'left'};
`

export const EmptyWrapper = styled.div`
  padding: 32px;
  text-align: center;
  color: ${({ theme }) => getThemeToken(theme as Theme, 'colors').textSecondary};
`

export const PaginationWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 16px 0;
`
