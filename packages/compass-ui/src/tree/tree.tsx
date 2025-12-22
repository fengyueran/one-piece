import * as React from 'react'
import { useState, useMemo, useEffect } from 'react'
import { List, RowComponentProps } from 'react-window'
import { TreeProps, DataNode } from './types'
import { TreeContainer } from './tree.styles'
import { TreeNode } from './tree-node'
import { flattenTreeData } from './utils/flatten'
import { convertTreeToEntities, conductCheckWithTrigger } from './utils/tree-data'

const Tree: React.FC<TreeProps> = ({
  treeData = [],
  checkable = false,
  selectable = true,
  showLine = false,
  showIcon = false,
  defaultExpandedKeys = [],
  expandedKeys: propExpandedKeys,
  onExpand,
  defaultSelectedKeys = [],
  selectedKeys: propSelectedKeys,
  onSelect,
  defaultCheckedKeys = [],
  checkedKeys: propCheckedKeys,
  onCheck,
  height,
  itemHeight = 28,
  virtual = false,
  switcherIcon,
  titleRender,
  className,
  style,
}) => {
  // State management
  const [expandedKeys, setExpandedKeys] = useState<(string | number)[]>(
    propExpandedKeys || defaultExpandedKeys,
  )
  const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>(
    propSelectedKeys || defaultSelectedKeys,
  )
  const [checkedKeys, setCheckedKeys] = useState<(string | number)[]>(
    propCheckedKeys || defaultCheckedKeys,
  )

  useEffect(() => {
    if (propExpandedKeys) setExpandedKeys(propExpandedKeys)
  }, [propExpandedKeys])

  useEffect(() => {
    if (propSelectedKeys) setSelectedKeys(propSelectedKeys)
  }, [propSelectedKeys])

  useEffect(() => {
    if (propCheckedKeys) setCheckedKeys(propCheckedKeys)
  }, [propCheckedKeys])

  // Memoize entities map for cascade check
  const { keyEntities } = useMemo(() => {
    return convertTreeToEntities(treeData)
  }, [treeData])

  // Flatten data
  const flattenedNodes = useMemo(() => {
    return flattenTreeData(treeData, expandedKeys)
  }, [treeData, expandedKeys])

  // Handlers
  const handleExpand = (key: string | number, node: DataNode) => {
    const newExpandedKeys = expandedKeys.includes(key)
      ? expandedKeys.filter((k) => k !== key)
      : [...expandedKeys, key]

    if (!propExpandedKeys) {
      setExpandedKeys(newExpandedKeys)
    }

    if (onExpand) {
      onExpand(newExpandedKeys, {
        node,
        expanded: !expandedKeys.includes(key),
      })
    }
  }

  const handleSelect = (key: string | number, node: DataNode, event: React.MouseEvent) => {
    const newSelectedKeys = [key] // Single selection for now

    if (!propSelectedKeys) {
      setSelectedKeys(newSelectedKeys)
    }

    if (onSelect) {
      onSelect(newSelectedKeys, {
        node,
        selected: true,
        event,
      })
    }
  }

  const handleCheck = (key: string | number, node: DataNode, event: React.MouseEvent) => {
    const checked = !checkedKeys.includes(key)

    // Use conductCheckWithTrigger for cascade logic
    const { checkedKeys: newCheckedKeys } = conductCheckWithTrigger(
      key,
      checked,
      checkedKeys,
      keyEntities,
    )

    if (!propCheckedKeys) {
      setCheckedKeys(newCheckedKeys)
    }

    if (onCheck) {
      onCheck(newCheckedKeys, {
        node,
        checked,
        event,
      })
    }
  }

  // Helper to check if a node is the last child of its parent
  const isLastChild = (node: any) => {
    if (!node.parent) {
      // For root nodes, check against original treeData
      const rootNodes = treeData
      return rootNodes[rootNodes.length - 1].key === node.key
    }
    const siblings = node.parent.children
    return siblings[siblings.length - 1].key === node.key
  }

  const Row = ({ index, style }: RowComponentProps): React.ReactElement => {
    const node = flattenedNodes[index]
    if (!node) {
      return <div style={style} />
    }

    // Calculate indentation lines
    const indentLines: boolean[] = []
    let current = node.parent
    while (current) {
      indentLines.unshift(!isLastChild(current))
      current = current.parent
    }

    return (
      <TreeNode
        key={node.key}
        eventKey={node.key}
        title={titleRender ? titleRender(node.data) : node.title}
        level={node.level}
        expanded={expandedKeys.includes(node.key)}
        selected={selectedKeys.includes(node.key)}
        checked={checkedKeys.includes(node.key)}
        isLeaf={node.isLeaf || (!node.children && !node.data.children)}
        checkable={checkable}
        selectable={selectable}
        disabled={node.disabled}
        icon={node.icon}
        style={style}
        onExpand={() => handleExpand(node.key, node.data)}
        onSelect={(e) => handleSelect(node.key, node.data, e)}
        onCheck={(e) => handleCheck(node.key, node.data, e)}
        switcherIcon={switcherIcon}
        showLine={showLine}
        showIcon={showIcon}
        indentLines={indentLines}
      />
    )
  }

  const renderContent = () => {
    if (virtual && height) {
      return (
        <List
          defaultHeight={height}
          rowCount={flattenedNodes.length}
          rowHeight={itemHeight}
          rowComponent={Row}
          rowProps={{}}
          style={{ width: '100%' }}
        />
      )
    }

    return flattenedNodes.map((node) => {
      const indentLines: boolean[] = []
      let current = node.parent
      while (current) {
        indentLines.unshift(!isLastChild(current))
        current = current.parent
      }

      return (
        <TreeNode
          key={node.key}
          eventKey={node.key}
          title={titleRender ? titleRender(node.data) : node.title}
          level={node.level}
          expanded={expandedKeys.includes(node.key)}
          selected={selectedKeys.includes(node.key)}
          checked={checkedKeys.includes(node.key)}
          isLeaf={node.isLeaf || (!node.children && !node.data.children)}
          checkable={checkable}
          selectable={selectable}
          disabled={node.disabled}
          icon={node.icon}
          onExpand={() => handleExpand(node.key, node.data)}
          onSelect={(e) => handleSelect(node.key, node.data, e)}
          onCheck={(e) => handleCheck(node.key, node.data, e)}
          switcherIcon={switcherIcon}
          showLine={showLine}
          showIcon={showIcon}
          indentLines={indentLines}
        />
      )
    })
  }

  return (
    <TreeContainer className={`compass-tree ${className || ''}`} style={style}>
      {renderContent()}
    </TreeContainer>
  )
}

export default Tree
