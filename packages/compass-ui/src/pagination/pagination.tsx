import React, { useState, useEffect } from 'react'

import { PaginationProps } from './types'
import { PaginationContainer, PaginationItem } from './pagination.styles'
import {
  LeftOutlined,
  RightOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  EllipsisOutlined,
} from '../icons'
import Select from '../select'
import InputNumber from '../input-number'
import { usePagination, DOTS } from './usePagination'
import { useConfig } from '../config-provider/context'
import defaultLocale from '../locale/en_US'

export const Pagination: React.FC<PaginationProps> = ({
  current,
  defaultCurrent = 1,
  total = 0,
  pageSize: customPageSize,
  defaultPageSize = 10,
  onChange,
  disabled,
  size = 'default',
  className,
  style,
  showSizeChanger,
  pageSizeOptions = [10, 20, 50, 100],
  showQuickJumper,
  showTotal,
  simple,
  totalAlign = 'left',
  ...rest
}) => {
  const { locale: contextLocale } = useConfig()
  const locale = contextLocale?.Pagination || defaultLocale.Pagination
  const [currentPage, setCurrentPage] = useState(current || defaultCurrent)
  const [pageSize, setPageSize] = useState(customPageSize || defaultPageSize)
  const [inputVal, setInputVal] = useState(String(currentPage))

  useEffect(() => {
    if (current !== undefined) {
      setCurrentPage(current)
      setInputVal(String(current))
    }
  }, [current])

  useEffect(() => {
    // sync input val if internal page changes (e.g. prev/next click)
    setInputVal(String(currentPage))
  }, [currentPage])

  useEffect(() => {
    if (customPageSize !== undefined) {
      setPageSize(customPageSize)
    }
  }, [customPageSize])

  const totalPages = Math.ceil(total / pageSize)

  const paginationRange = usePagination({
    current: currentPage,
    total,
    pageSize,
    siblingCount: 1,
  })

  const handleChange = (page: number) => {
    if (disabled) return
    let newPage = page
    if (newPage < 1) newPage = 1
    if (newPage > totalPages) newPage = totalPages

    if (newPage !== currentPage) {
      if (current === undefined) {
        setCurrentPage(newPage)
      }
      onChange?.(newPage, pageSize)
    }
  }

  const handleSizeChange = (newValue: string | number | (string | number)[]) => {
    const newSize = Number(newValue)
    setPageSize(newSize)
    const newCurrent = 1
    if (current === undefined) {
      setCurrentPage(newCurrent)
    }
    onChange?.(newCurrent, newSize)
  }

  const handleJumpPrev = () => {
    handleChange(currentPage - 5)
  }

  const handleJumpNext = () => {
    handleChange(currentPage + 5)
  }

  const handleSimpleInputChange = (value: number | null) => {
    if (value === null) {
      setInputVal('')
    } else {
      setInputVal(String(value))
    }
  }

  const handleSimpleInputBlur = () => {
    let val = parseInt(inputVal, 10)
    if (isNaN(val)) {
      val = currentPage
    } else {
      if (val < 1) val = 1
      if (val > totalPages) val = totalPages
    }
    handleChange(val)
    setInputVal(String(val))
  }

  const handleSimpleInputEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    let val = parseInt(target.value, 10)
    if (isNaN(val)) {
      val = currentPage
    } else {
      if (val < 1) val = 1
      if (val > totalPages) val = totalPages
    }
    handleChange(val)
    setInputVal(String(val))
    target.blur()
  }

  if (total === 0) return null

  if (simple) {
    return (
      <PaginationContainer
        className={`compass-pagination compass-pagination-simple ${className || ''}`}
        style={style}
        disabled={disabled}
        size={size}
        {...rest}
        aria-label="pagination"
      >
        <PaginationItem
          disabled={currentPage === 1 || disabled}
          onClick={() => handleChange(currentPage - 1)}
          size={size}
          className="compass-pagination-prev"
          title={locale.prev_page}
        >
          <LeftOutlined />
        </PaginationItem>
        <li style={{ margin: '0 8px', display: 'flex', alignItems: 'center' }}>
          <InputNumber
            value={inputVal ? parseInt(inputVal, 10) : null}
            onChange={handleSimpleInputChange}
            onBlur={handleSimpleInputBlur}
            onPressEnter={handleSimpleInputEnter}
            size={size === 'small' ? 'small' : 'medium'}
            disabled={disabled}
            className="compass-pagination-simple-input"
            min={1}
            max={totalPages}
          />
          <span style={{ margin: '0 8px' }}>/</span>
          {totalPages}
        </li>
        <PaginationItem
          disabled={currentPage === totalPages || disabled}
          onClick={() => handleChange(currentPage + 1)}
          size={size}
          className="compass-pagination-next"
          title={locale.next_page}
        >
          <RightOutlined />
        </PaginationItem>
      </PaginationContainer>
    )
  }

  const items = paginationRange.map((pageNumber, index) => {
    if (pageNumber === DOTS) {
      const isLeftDots = index === 1

      return (
        <PaginationItem
          key={`dots-${index}`}
          className="compass-pagination-jump-placeholder"
          size={size}
          disabled={disabled}
          title={isLeftDots ? locale.prev_5 : locale.next_5}
          onClick={isLeftDots ? handleJumpPrev : handleJumpNext}
        >
          <div className="compass-pagination-item-ellipsis">
            <EllipsisOutlined />
          </div>
          <div className="compass-pagination-item-link-icon">
            {isLeftDots ? <DoubleLeftOutlined /> : <DoubleRightOutlined />}
          </div>
        </PaginationItem>
      )
    }

    return (
      <PaginationItem
        key={pageNumber}
        active={currentPage === pageNumber}
        disabled={disabled}
        size={size}
        onClick={() => handleChange(Number(pageNumber))}
        className={`compass-pagination-item compass-pagination-item-${pageNumber} ${currentPage === pageNumber ? 'compass-pagination-item-active' : ''}`}
      >
        {pageNumber}
      </PaginationItem>
    )
  })

  const renderTotal = () => {
    if (!showTotal) return null
    const rangeStart = (currentPage - 1) * pageSize + 1
    const rangeEnd = Math.min(currentPage * pageSize, total)
    return (
      <li
        className="compass-pagination-total-text"
        style={{
          marginRight: totalAlign === 'left' ? 8 : 0,
          marginLeft: totalAlign === 'right' ? 8 : 0,
        }}
      >
        {showTotal(total, [rangeStart, rangeEnd])}
      </li>
    )
  }

  return (
    <PaginationContainer
      className={`compass-pagination ${className || ''}`}
      style={style}
      disabled={disabled}
      size={size}
      {...rest}
      aria-label="pagination"
    >
      {totalAlign === 'left' && renderTotal()}

      <PaginationItem
        disabled={currentPage === 1 || disabled}
        onClick={() => handleChange(currentPage - 1)}
        size={size}
        className="compass-pagination-prev"
        title={locale.prev_page}
      >
        <LeftOutlined />
      </PaginationItem>

      {items}

      <PaginationItem
        disabled={currentPage === totalPages || disabled}
        onClick={() => handleChange(currentPage + 1)}
        size={size}
        className="compass-pagination-next"
        title={locale.next_page}
      >
        <RightOutlined />
      </PaginationItem>

      {showSizeChanger && (
        <li className="compass-pagination-options" style={{ marginLeft: 16 }}>
          <Select
            size={size === 'small' ? 'small' : 'medium'}
            value={String(pageSize)}
            onChange={handleSizeChange}
            disabled={disabled}
            style={{ width: size === 'small' ? 90 : 110 }}
          >
            {pageSizeOptions.map((opt) => (
              <Select.Option key={opt} value={String(opt)}>
                {opt} {locale.items_per_page}
              </Select.Option>
            ))}
          </Select>
        </li>
      )}

      {totalAlign === 'right' && renderTotal()}

      {showQuickJumper && (
        <li
          className="compass-pagination-options compass-pagination-quick-jumper"
          style={{ marginLeft: 16, display: 'flex', alignItems: 'center' }}
        >
          {locale.jump_to}
          <InputNumber
            size={size === 'small' ? 'small' : 'medium'}
            disabled={disabled}
            style={{ width: 50, margin: '0 8px' }}
            min={1}
            max={totalPages}
            onBlur={(e) => {
              const val = parseInt(e.target.value, 10)
              if (!isNaN(val)) {
                handleChange(val)
                e.target.value = ''
              } else {
                e.target.value = ''
              }
            }}
            onPressEnter={(e) => {
              const target = e.currentTarget
              const val = parseInt(target.value, 10)
              if (!isNaN(val)) {
                handleChange(val)
                target.value = ''
                target.blur()
              }
            }}
          />
        </li>
      )}
    </PaginationContainer>
  )
}

export default Pagination
