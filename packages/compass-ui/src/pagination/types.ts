export interface PaginationProps {
  /** Current page number */
  current?: number
  /** Default initial page number */
  defaultCurrent?: number
  /** Total number of data items */
  total?: number
  /** Number of data items per page */
  pageSize?: number
  /** Default number of data items per page */
  defaultPageSize?: number
  /** Callback executed when page number or pageSize is changed */
  onChange?: (page: number, pageSize: number) => void
  /** Disable pagination */
  disabled?: boolean
  /** Determine whether to show the size changer */
  showSizeChanger?: boolean
  /** Specify the size changer options */
  pageSizeOptions?: number[]
  /** Determine whether you can jump to pages directly */
  showQuickJumper?: boolean
  /** To display the total number and range */
  showTotal?: (total: number, range: [number, number]) => React.ReactNode
  /** Specify the alignment of total text */
  totalAlign?: 'left' | 'right'
  /** Whether to use simple mode */
  simple?: boolean
  /** Specify the size of pagination component */
  size?: 'default' | 'small'
  /** Custom class name */
  className?: string
  /** Custom style */
  style?: React.CSSProperties

  /**
   * Granular styles
   */
  styles?: {
    root?: React.CSSProperties
    item?: React.CSSProperties
    activeItem?: React.CSSProperties
    jumpItem?: React.CSSProperties
    options?: React.CSSProperties
    total?: React.CSSProperties
  }

  /**
   * Granular class names
   */
  classNames?: {
    root?: string
    item?: string
    activeItem?: string
    jumpItem?: string
    options?: string
    total?: string
  }
}
