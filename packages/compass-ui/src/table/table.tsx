import React, { useState, useMemo } from 'react'
import Pagination from '../pagination'
import { TableProps, ColumnType } from './types'
import {
  StyledTableWrapper,
  StyledTable,
  StyledThead,
  StyledTbody,
  StyledTr,
  StyledTh,
  StyledTd,
  EmptyWrapper,
  PaginationWrapper,
} from './table.styles'

export function Table<T = unknown>(props: TableProps<T>) {
  const {
    dataSource = [],
    columns,
    rowKey = 'key',
    bordered = false,
    size = 'medium',
    loading = false,
    pagination,
    rowSelection,
    className,
    style,
    emptyText = 'No Data',
    scroll,
  } = props

  const [sortConfig, setSortConfig] = useState<{
    key: React.Key
    order: 'ascend' | 'descend'
  } | null>(null)

  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record)
    }
    return String((record as Record<string, unknown>)[rowKey]) || index.toString()
  }

  // Handle row selection
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!rowSelection?.onChange) return
    if (e.target.checked) {
      const allKeys = dataSource.map((record, index) => getRowKey(record, index))
      rowSelection.onChange(allKeys, dataSource)
    } else {
      rowSelection.onChange([], [])
    }
  }

  const handleSelectRow = (record: T, index: number) => {
    if (!rowSelection?.onChange) return
    const key = getRowKey(record, index)
    const selectedKeys = rowSelection.selectedRowKeys || []
    const isSelected = selectedKeys.includes(key)

    let newSelectedKeys = []
    if (isSelected) {
      newSelectedKeys = selectedKeys.filter((k) => k !== key)
    } else {
      newSelectedKeys = [...selectedKeys, key]
    }

    const newSelectedRows = dataSource.filter((item, idx) =>
      newSelectedKeys.includes(getRowKey(item, idx)),
    )
    rowSelection.onChange(newSelectedKeys, newSelectedRows)
  }

  const handleSort = (key: React.Key) => {
    const column = columns.find((c) => (c.key || c.dataIndex) === key)
    if (!column || !column.sorter) return

    setSortConfig((prev) => {
      if (prev?.key === key) {
        if (prev.order === 'ascend') return { key, order: 'descend' }
        return null
      }
      return { key, order: 'ascend' }
    })
  }

  const processedData = useMemo(() => {
    const data = [...dataSource]
    if (sortConfig && sortConfig.order) {
      const column = columns.find((c) => (c.key || c.dataIndex) === sortConfig.key) as ColumnType<T>
      if (column?.sorter) {
        data.sort((a, b) => {
          const res = column.sorter!(a, b)
          return sortConfig.order === 'ascend' ? res : -res
        })
      }
    }
    return data
  }, [dataSource, sortConfig, columns])

  const isAllSelected =
    dataSource.length > 0 &&
    dataSource.every((record, index) =>
      rowSelection?.selectedRowKeys?.includes(getRowKey(record, index)),
    )

  const isIndeterminate = (rowSelection?.selectedRowKeys?.length || 0) > 0 && !isAllSelected

  // Render helpers
  const renderHeader = () => {
    return (
      <StyledThead scrollY={scroll?.y} className="compass-table-thead">
        <StyledTr scrollY={scroll?.y} className="compass-table-row">
          {rowSelection && (
            <StyledTh
              size={size}
              width={50}
              className="compass-table-cell compass-table-selection-column"
              fixed="left"
            >
              <input
                type="checkbox"
                checked={isAllSelected}
                ref={(input) => {
                  if (input) input.indeterminate = !!isIndeterminate
                }}
                onChange={handleSelectAll}
              />
            </StyledTh>
          )}
          {columns.map((col) => {
            const colKey = col.key || (col.dataIndex as React.Key)
            const isSorted = sortConfig?.key === colKey
            const sortOrder = isSorted ? sortConfig.order : null

            return (
              <StyledTh
                key={colKey}
                align={col.align}
                width={col.width}
                size={size}
                fixed={col.fixed}
                className="compass-table-cell"
                style={{ cursor: col.sorter ? 'pointer' : 'default' }}
                onClick={() => handleSort(colKey)}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent:
                      col.align === 'right'
                        ? 'flex-end'
                        : col.align === 'center'
                          ? 'center'
                          : 'flex-start',
                  }}
                >
                  {col.title}
                  {col.sorter && (
                    <span
                      style={{
                        display: 'inline-flex',
                        flexDirection: 'column',
                        marginLeft: 8,
                        fontSize: 10,
                        lineHeight: 0.8,
                        color: '#bfbfbf',
                      }}
                    >
                      <span
                        style={{ color: sortOrder === 'ascend' ? '#1890ff' : 'inherit' }}
                        role="img"
                        aria-label="caret-up"
                      >
                        ▲
                      </span>
                      <span
                        style={{ color: sortOrder === 'descend' ? '#1890ff' : 'inherit' }}
                        role="img"
                        aria-label="caret-down"
                      >
                        ▼
                      </span>
                    </span>
                  )}
                </div>
              </StyledTh>
            )
          })}
        </StyledTr>
      </StyledThead>
    )
  }

  const renderBody = () => {
    if (loading) {
      return (
        <StyledTbody className="compass-table-tbody">
          <StyledTr className="compass-table-row">
            <StyledTd
              colSpan={columns.length + (rowSelection ? 1 : 0)}
              style={{ textAlign: 'center', padding: '32px' }}
              className="compass-table-cell"
            >
              Loading...
            </StyledTd>
          </StyledTr>
        </StyledTbody>
      )
    }

    if (processedData.length === 0) {
      return (
        <StyledTbody className="compass-table-tbody">
          <StyledTr className="compass-table-row">
            <StyledTd
              colSpan={columns.length + (rowSelection ? 1 : 0)}
              className="compass-table-cell"
            >
              <EmptyWrapper className="compass-table-empty">{emptyText}</EmptyWrapper>
            </StyledTd>
          </StyledTr>
        </StyledTbody>
      )
    }

    return (
      <StyledTbody scrollY={scroll?.y} className="compass-table-tbody">
        {processedData.map((record, index) => {
          const key = getRowKey(record, index)
          const isSelected = rowSelection?.selectedRowKeys?.includes(key)

          return (
            <StyledTr key={key} scrollY={scroll?.y} className="compass-table-row">
              {rowSelection && (
                <StyledTd
                  size={size}
                  className="compass-table-cell compass-table-selection-column"
                  fixed="left"
                >
                  <input
                    type="checkbox"
                    checked={!!isSelected}
                    onChange={() => handleSelectRow(record, index)}
                  />
                </StyledTd>
              )}
              {columns.map((col) => {
                const colKey = col.key || (col.dataIndex as string)
                const value = col.dataIndex
                  ? (record as Record<string, unknown>)[col.dataIndex as string]
                  : undefined
                return (
                  <StyledTd
                    key={colKey}
                    align={col.align}
                    size={size}
                    fixed={col.fixed}
                    className="compass-table-cell"
                  >
                    {col.render ? col.render(value, record, index) : (value as React.ReactNode)}
                  </StyledTd>
                )
              })}
            </StyledTr>
          )
        })}
      </StyledTbody>
    )
  }

  const tableClassName = [
    'compass-table',
    size && `compass-table--${size}`,
    bordered && 'compass-table--bordered',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div>
      <StyledTableWrapper bordered={bordered} className={tableClassName} style={style}>
        <StyledTable scrollY={scroll?.y} scrollX={scroll?.x}>
          {renderHeader()}
          {renderBody()}
        </StyledTable>
      </StyledTableWrapper>
      {pagination && (
        <PaginationWrapper className="compass-table-pagination">
          <Pagination {...pagination} />
        </PaginationWrapper>
      )}
    </div>
  )
}
