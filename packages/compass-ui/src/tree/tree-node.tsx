import * as React from 'react'
import { CaretRightOutlined, PlusSquareOutlined, MinusSquareOutlined, FileOutlined } from '../icons'
import { TreeNodeProps } from './types'
import {
  TreeNodeWrapper,
  Switcher,
  CheckboxWrapper,
  NodeContent,
  NodeTitle,
  IconWrapper,
  Indent,
} from './tree.styles'

export const TreeNode: React.FC<TreeNodeProps> = ({
  level = 0,
  expanded,
  selected,
  checked,
  halfChecked,
  disabled,
  title,
  icon,
  isLeaf,
  checkable,
  selectable,
  onExpand,
  onSelect,
  onCheck,
  className,
  style,
  switcherIcon,
  showLine,
  showIcon,
  indentLines = [],
  styles,
  classNames,
}) => {
  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isLeaf && onExpand) {
      onExpand(e)
    }
  }

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (disabled) {
      return
    }

    if (selectable !== false) {
      if (onSelect) {
        onSelect(e)
      }
    } else if (!isLeaf && onExpand) {
      onExpand(e)
    }
  }

  const handleCheck = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!disabled && checkable !== false && onCheck) {
      onCheck(e)
    }
  }

  const renderSwitcherIcon = () => {
    if (typeof switcherIcon === 'function') {
      return switcherIcon({ expanded: !!expanded })
    }
    if (showLine) {
      if (isLeaf) {
        return <FileOutlined />
      }
      return expanded ? <MinusSquareOutlined /> : <PlusSquareOutlined />
    }
    return switcherIcon || <CaretRightOutlined />
  }

  const shouldRotate = typeof switcherIcon !== 'function'

  return (
    <TreeNodeWrapper
      level={showLine ? 0 : level}
      selected={selected}
      disabled={disabled}
      className={`compass-tree-node ${selected ? 'compass-tree-node--selected' : ''} ${disabled ? 'compass-tree-node--disabled' : ''} ${isLeaf ? 'compass-tree-node--leaf' : ''} ${classNames?.node || ''} ${className || ''}`}
      style={{ ...style, ...styles?.node }}
      onClick={handleSelect}
      showLine={showLine}
    >
      {showLine &&
        indentLines.map((active, index) => (
          <Indent key={index} active={active} className="compass-tree-indent" />
        ))}

      {!isLeaf ? (
        <Switcher
          expanded={shouldRotate ? expanded : undefined}
          onClick={handleExpand}
          className={`compass-tree-switcher ${classNames?.switcher || ''}`}
          style={styles?.switcher}
          showLine={showLine}
        >
          {renderSwitcherIcon()}
        </Switcher>
      ) : showLine ? (
        <Switcher
          className={`compass-tree-switcher compass-tree-switcher--leaf ${classNames?.switcher || ''}`}
          showLine={showLine}
          style={styles?.switcher}
        >
          {renderSwitcherIcon()}
        </Switcher>
      ) : (
        <Switcher
          className={`compass-tree-switcher compass-tree-switcher--noop ${classNames?.switcher || ''}`}
          showLine={showLine}
          style={styles?.switcher}
        >
          <span style={{ width: '16px', display: 'inline-block' }} />
        </Switcher>
      )}

      {(checkable as boolean | undefined) && (
        <CheckboxWrapper
          onClick={handleCheck}
          className={`compass-tree-checkbox ${classNames?.checkbox || ''}`}
          style={styles?.checkbox}
        >
          <input
            type="checkbox"
            checked={checked}
            disabled={disabled}
            ref={(input) => {
              if (input) {
                input.indeterminate = !!halfChecked
              }
            }}
            readOnly
          />
        </CheckboxWrapper>
      )}

      <NodeContent
        className={`compass-tree-content ${classNames?.content || ''}`}
        style={styles?.content}
      >
        {showIcon && icon && (
          <IconWrapper
            className={`compass-tree-icon ${classNames?.icon || ''}`}
            style={styles?.icon}
          >
            {icon}
          </IconWrapper>
        )}
        <NodeTitle
          className={`compass-tree-title ${classNames?.title || ''}`}
          style={styles?.title}
        >
          {title}
        </NodeTitle>
      </NodeContent>
    </TreeNodeWrapper>
  )
}
