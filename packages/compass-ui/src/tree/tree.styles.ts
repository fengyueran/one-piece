import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { token } from '../theme/token-utils'

export const TreeContainer = styled.div`
  position: relative;
  font-size: ${token('components.tree.fontSize', '14px')};
  line-height: 1.5;
  color: ${token('components.tree.nodeColor', 'rgba(0, 0, 0, 0.88)')};
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
  padding-left: ${({ level }) =>
    `calc(${level} * ${token('components.tree.indentSize', '24px')} + 4px)`};
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
  background-color: ${({ selected }) =>
    selected ? token('components.tree.nodeSelectedBg', '#e6f7ff') : 'transparent'};
  border-radius: ${token('components.tree.borderRadius', '4px')};
  color: ${({ selected }) =>
    selected ? token('components.tree.nodeSelectedColor', 'inherit') : 'inherit'};

  &:hover {
    background-color: ${({ selected }) =>
      selected
        ? token('components.tree.nodeSelectedBg', '#e6f7ff')
        : token('components.tree.nodeHoverBg', '#f5f5f5')};
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
  z-index: 1;
  background: ${({ showLine }) => (showLine ? '#fff' : 'transparent')};
  color: ${token('components.tree.switcherColor', 'rgba(0, 0, 0, 0.45)')};

  &:hover {
    color: ${token('components.tree.switcherHoverColor', 'rgba(0, 0, 0, 0.88)')};
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
  width: ${token('components.tree.indentSize', '24px')};
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
