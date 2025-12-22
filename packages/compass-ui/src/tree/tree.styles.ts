import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { getComponentTheme } from '../theme/utils'

export const TreeContainer = styled.div`
  position: relative;
  font-size: ${({ theme }) => getComponentTheme(theme, 'tree').fontSize};
  line-height: 1.5;
  color: ${({ theme }) => getComponentTheme(theme, 'tree').nodeColor};
`

export const TreeNodeWrapper = styled.div<{
  selected?: boolean
  disabled?: boolean
  level: number
  showLine?: boolean
}>`
  display: flex;
  align-items: center;
  padding: 0 4px;
  padding-left: ${({ level, theme }) =>
    `calc(${level} * ${getComponentTheme(theme, 'tree').indentSize} + 4px)`};
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  background-color: ${({ selected, theme }) =>
    selected ? getComponentTheme(theme, 'tree').nodeSelectedBg : 'transparent'};
  border-radius: ${({ theme }) => getComponentTheme(theme, 'tree').borderRadius};
  color: ${({ selected, theme }) =>
    selected ? getComponentTheme(theme, 'tree').nodeSelectedColor : 'inherit'};

  &:hover {
    background-color: ${({ selected, theme }) =>
      selected
        ? getComponentTheme(theme, 'tree').nodeSelectedBg
        : getComponentTheme(theme, 'tree').nodeHoverBg};
  }

  ${({ disabled }) =>
    disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.5;
      &:hover {
        background-color: transparent;
      }
    `}
`

export const Switcher = styled.span<{ expanded?: boolean; showLine?: boolean }>`
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  user-select: none;
  line-height: 0;
  width: 24px;
  height: 24px;
  margin-right: 4px;
  cursor: pointer;
  position: relative;
  transform: rotate(
    ${({ expanded, showLine }) => (showLine ? '0deg' : expanded ? '90deg' : '0deg')}
  );
  transition: transform 0.2s;
  z-index: 1;
  background: ${({ showLine }) => (showLine ? '#fff' : 'transparent')};
  color: ${({ theme }) => getComponentTheme(theme, 'tree').switcherColor};

  &:hover {
    color: ${({ theme }) => getComponentTheme(theme, 'tree').switcherHoverColor};
  }

  &.is-noop {
    cursor: default;
    transform: none;
    &:hover {
      color: inherit;
    }
  }
`

export const Indent = styled.span<{ active?: boolean; isLast?: boolean }>`
  align-self: stretch;
  width: ${({ theme }) => getComponentTheme(theme, 'tree').indentSize};
  display: inline-block;
  flex-shrink: 0;
  position: relative;

  ${({ active }) =>
    active &&
    css`
      &::before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50%;
        border-left: 1px solid #d9d9d9;
        transform: translateX(-50%);
      }
    `}
`

export const CheckboxWrapper = styled.span`
  margin-right: 8px;
  display: flex;
  align-items: center;
`

export const NodeContent = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
`

export const NodeTitle = styled.div`
  flex: 1;
  min-width: 0;
  margin-left: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-right: 4px;
`
