import React from 'react'
import { PaginationProps } from '../pagination'

export interface ColumnType<T = unknown> {
  /** Column title */
  title: React.ReactNode
  /** Unique key for column */
  key?: React.Key
  /** Field name to get value from record */
  dataIndex?: keyof T
  /** Render function */
  render?: (value: unknown, record: T, index: number) => React.ReactNode
  /** Column alignment */
  align?: 'left' | 'center' | 'right'
  /** Column width */
  width?: string | number
  /** Fixed column */
  fixed?: 'left' | 'right' | boolean
  /** Sorter function */
  sorter?: (a: T, b: T) => number
}

export interface RowSelection<T> {
  /** Selected row keys */
  selectedRowKeys?: React.Key[]
  /** Callback when selection changes */
  onChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void
}

export interface TableProps<T = unknown> {
  /** Data source array */
  dataSource: T[]
  /** Columns configuration */
  columns: ColumnType<T>[]
  /**
   * Row's unique key
   * @default 'key'
   */
  rowKey?: string | ((record: T) => string)
  /** Whether to show border */
  bordered?: boolean
  /** Table size */
  size?: 'small' | 'medium' | 'large'
  /** Loading status */
  loading?: boolean
  /** Pagination config, set false to hide */
  pagination?: PaginationProps | false
  /** Row selection config */
  rowSelection?: RowSelection<T>
  /** Custom class name */
  className?: string
  /** Custom style */
  style?: React.CSSProperties
  /** Empty text */
  emptyText?: React.ReactNode
  /** Scroll config */
  scroll?: {
    x?: string | number
    y?: string | number
  }
}
