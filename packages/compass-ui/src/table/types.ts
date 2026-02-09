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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, record: T, index: number) => React.ReactNode
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
  /** Custom loading indicator */
  loadingIndicator?: React.ReactNode
  /** Pagination config, set false to hide */
  pagination?: PaginationProps | false
  /** Row selection config */
  rowSelection?: RowSelection<T>
  /** Empty text */
  emptyText?: React.ReactNode
  /** Scroll config */
  scroll?: {
    x?: string | number
    y?: string | number
  }
  /** Set header row properties */
  onHeaderRow?: (
    columns: ColumnType<T>[],
    index?: number,
  ) => React.HTMLAttributes<HTMLTableRowElement>
  /** Set row properties */
  onRow?: (record: T, index?: number) => React.HTMLAttributes<HTMLTableRowElement>
  /** Custom class name */
  className?: string
  /** Custom style */
  style?: React.CSSProperties

  /** Granular styles */
  styles?: {
    root?: React.CSSProperties
    table?: React.CSSProperties
    thead?: React.CSSProperties
    tbody?: React.CSSProperties
    tr?: React.CSSProperties
    th?: React.CSSProperties
    td?: React.CSSProperties
    pagination?: React.CSSProperties
    empty?: React.CSSProperties
    loadingOverlay?: React.CSSProperties
  }

  /** Granular class names */
  classNames?: {
    root?: string
    table?: string
    thead?: string
    tbody?: string
    tr?: string
    th?: string
    td?: string
    pagination?: string
    empty?: string
    loadingOverlay?: string
  }
}
