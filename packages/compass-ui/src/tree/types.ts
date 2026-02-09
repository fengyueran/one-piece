import React from 'react'

export interface DataNode {
  key: string | number
  title?: React.ReactNode
  children?: DataNode[]
  disabled?: boolean
  selectable?: boolean
  checkable?: boolean
  icon?: React.ReactNode
  isLeaf?: boolean
  /** Additional custom data fields */
  extraData?: Record<string, unknown>
}

export interface TreeProps {
  /** Tree data */
  treeData?: DataNode[]
  /** Whether to show checkboxes */
  checkable?: boolean
  /** Whether treeNodes are selectable */
  selectable?: boolean
  /** Whether to show connecting lines */
  showLine?: boolean
  /** Whether to show icon */
  showIcon?: boolean
  /** Default expanded keys */
  defaultExpandedKeys?: (string | number)[]
  /** Expanded keys (controlled) */
  expandedKeys?: (string | number)[]
  /** Callback when keys are expanded/collapsed */
  onExpand?: (
    expandedKeys: (string | number)[],
    info: { node: DataNode; expanded: boolean },
  ) => void
  /** Default selected keys */
  defaultSelectedKeys?: (string | number)[]
  /** Selected keys (controlled) */
  selectedKeys?: (string | number)[]
  /** Callback when node is selected */
  onSelect?: (
    selectedKeys: (string | number)[],
    info: { node: DataNode; selected: boolean; event: React.MouseEvent },
  ) => void
  /** Default checked keys */
  defaultCheckedKeys?: (string | number)[]
  /** Checked keys (controlled) */
  checkedKeys?: (string | number)[]
  /** Callback when node is checked */
  onCheck?: (
    checkedKeys: (string | number)[],
    info: { node: DataNode; checked: boolean; event: React.MouseEvent },
  ) => void
  /** Custom expand icon */
  switcherIcon?: React.ReactNode | ((props: { expanded: boolean }) => React.ReactNode)
  /** Custom title render */
  titleRender?: (node: DataNode) => React.ReactNode
  /** Whether to expand node on click */
  expandOnClick?: boolean
  /** Virtual scroll height */
  height?: number
  /** Virtual scroll item height */
  itemHeight?: number
  /** Enable virtual scrolling */
  virtual?: boolean

  /**
   * Custom class name for root element
   */
  className?: string

  /**
   * Custom style for root element
   */
  style?: React.CSSProperties

  /**
   * Granular styles
   */
  styles?: {
    root?: React.CSSProperties
    node?: React.CSSProperties
    content?: React.CSSProperties
    switcher?: React.CSSProperties
    checkbox?: React.CSSProperties
    icon?: React.CSSProperties
    title?: React.CSSProperties
  }

  /**
   * Granular class names
   */
  classNames?: {
    root?: string
    node?: string
    content?: string
    switcher?: string
    checkbox?: string
    icon?: string
    title?: string
  }
}

export interface FlattenNode extends DataNode {
  key: string | number
  title?: React.ReactNode
  level: number
  parent: FlattenNode | null
  children: FlattenNode[]
  data: DataNode
  pos: string // "0-0-1"
}

export interface TreeNodeProps extends Omit<DataNode, 'children'> {
  eventKey: string | number
  level?: number
  expanded?: boolean
  selected?: boolean
  checked?: boolean
  halfChecked?: boolean
  loading?: boolean
  domRef?: React.Ref<HTMLDivElement>
  className?: string
  style?: React.CSSProperties
  onExpand?: (e: React.MouseEvent) => void
  onSelect?: (e: React.MouseEvent) => void
  onCheck?: (e: React.MouseEvent) => void
  children?: React.ReactNode
  switcherIcon?: React.ReactNode | ((props: { expanded: boolean }) => React.ReactNode)
  showLine?: boolean
  showIcon?: boolean
  isLast?: boolean
  indentLines?: boolean[]
  hasTitleRender?: boolean
  styles?: TreeProps['styles']
  classNames?: TreeProps['classNames']
}
