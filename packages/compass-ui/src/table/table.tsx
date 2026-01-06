import React from 'react'
import Pagination from '../pagination'
import { TableProps } from './types'
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
          {columns.map((col) => (
            <StyledTh
              key={col.key || (col.dataIndex as string)}
              align={col.align}
              width={col.width}
              size={size}
              className="compass-table-cell"
            >
              {col.title}
            </StyledTh>
          ))}
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

    if (dataSource.length === 0) {
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
        {dataSource.map((record, index) => {
          const key = getRowKey(record, index)
          const isSelected = rowSelection?.selectedRowKeys?.includes(key)

          return (
            <StyledTr key={key} scrollY={scroll?.y} className="compass-table-row">
              {rowSelection && (
                <StyledTd size={size} className="compass-table-cell compass-table-selection-column">
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
        <StyledTable scrollY={scroll?.y}>
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
