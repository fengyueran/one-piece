import React from 'react'
import { SelectProps, SelectValue } from '../select'
import { DataNode } from '../tree'

export type { SelectValue }

export interface TreeSelectProps extends Omit<SelectProps, 'options' | 'onChange'> {
  /**
   * Tree data
   */
  treeData?: DataNode[]

  /**
   * Whether to show checkboxes
   */
  treeCheckable?: boolean

  /**
   * Whether treeNodes are selectable
   * @default true
   */
  treeSelectable?: boolean

  /**
   * Default expanded keys
   */
  treeDefaultExpandedKeys?: (string | number)[]

  /**
   * Default expand all
   */
  treeDefaultExpandAll?: boolean

  /**
   * Callback when value changes
   */
  onChange?: (
    value: SelectValue,
    label: React.ReactNode | React.ReactNode[],
    extra?: unknown,
  ) => void

  /**
   * Custom icon for selected tree node
   */
  treeSelectedIcon?: React.ReactNode

  /**
   * Custom title render
   */
  titleRender?: (node: DataNode, searchValue: string) => React.ReactNode

  /**
   * Custom expand icon
   */
  switcherIcon?: React.ReactNode | ((props: { expanded: boolean }) => React.ReactNode)
}
