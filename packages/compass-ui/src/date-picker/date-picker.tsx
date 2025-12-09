import React, { useState, useEffect } from 'react'
import {
  useFloating,
  useDismiss,
  useInteractions,
  offset,
  flip,
  shift,
  autoUpdate,
  FloatingPortal,
  FloatingFocusManager,
} from '@floating-ui/react'
import {
  format as formatDate,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
  getISOWeek,
} from 'date-fns'
import styled from '@emotion/styled'

import InputField from '../input-field'
import { DatePickerProps } from './types'
import { useCalendar } from './hooks/useCalendar'
import { MonthPanel, YearPanel, QuarterPanel, TimePanel } from './panels'
import Button from '../button'
import {
  LeftOutlined,
  RightOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  CalendarOutlined,
} from '../icons'
import {
  StyledDatePicker,
  StyledCalendar,
  StyledHeader,
  StyledHeaderButton,
  StyledHeaderButtonGroup,
  StyledHeaderTitle,
  StyledWeekDays,
  StyledWeekDay,
  StyledDays,
  StyledDay,
  StyledPickerBody,
  StyledDatePanel,
  StyledWeekNumber,
} from './date-picker.styles'
import { useConfig } from '../config-provider'
import defaultLocale from '../locale/zh_CN'

type PanelMode = 'date' | 'month' | 'year' | 'quarter'

const StyledFooter = styled.div`
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding: 8px 16px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

export const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>((props, ref) => {
  const {
    value,
    defaultValue,
    onChange,
    picker = 'date',
    showTime = false,
    format,
    disabled = false,
    placeholder,
    clearable = false,
    className,
    style,
    fullWidth = false,
    ...rest
  } = props

  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(value || defaultValue || null)
  const [panelMode, setPanelMode] = useState<PanelMode>(picker === 'week' ? 'date' : picker)
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null)

  const { locale: contextLocale } = useConfig()
  const locale = contextLocale?.DatePicker || defaultLocale.DatePicker

  // Sync internal state with props
  useEffect(() => {
    if (value !== undefined) {
      setSelectedDate(value)
    }
  }, [value])

  // Reset panel mode when reopening
  useEffect(() => {
    if (isOpen) {
      setPanelMode(picker === 'week' ? 'date' : picker)
    }
  }, [isOpen, picker])

  const { viewDate, days, nextMonth, prevMonth, nextYear, prevYear, setYear, setViewDate } =
    useCalendar({
      value: selectedDate,
    })

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(4), flip(), shift()],
    whileElementsMounted: autoUpdate,
    placement: 'bottom-start',
  })

  const dismiss = useDismiss(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss])

  const handleDateSelect = (date: Date) => {
    let newDate = date
    // Preserve time if selecting date
    if (selectedDate && panelMode === 'date') {
      newDate.setHours(selectedDate.getHours())
      newDate.setMinutes(selectedDate.getMinutes())
      newDate.setSeconds(selectedDate.getSeconds())
    }

    if (picker === 'week') {
      const start = startOfWeek(newDate, { weekStartsOn: 1 })
      setSelectedDate(start)
      setSelectedDate(start)
      onChange?.(start)
      setIsOpen(false)
    } else {
      setSelectedDate(newDate)
      if (!(showTime && picker === 'date')) {
        onChange?.(newDate)
        setIsOpen(false)
      }
    }
  }

  const handleTimeChange = (date: Date) => {
    setSelectedDate(date)
  }

  const handlePanelSelect = (date: Date, mode: PanelMode) => {
    setViewDate(date)
    if (picker === mode) {
      handleDateSelect(date)
    } else {
      if (mode === 'year') setPanelMode(picker === 'quarter' ? 'quarter' : 'month')
      else if (mode === 'month') setPanelMode('date')
    }
  }

  const handleOk = () => {
    onChange?.(selectedDate)
    setIsOpen(false)
  }

  const getFormat = () => {
    if (format) return format
    if (showTime && picker === 'date') return locale.dateTimeFormat || 'yyyy-MM-dd HH:mm:ss'
    if (picker === 'year') return locale.yearFormat || 'yyyy'
    if (picker === 'month') return 'yyyy-MM'
    if (picker === 'quarter') return locale.quarterFormat || 'yyyy-QQQ'
    if (picker === 'week') return locale.weekFormat || 'yyyy-wo'
    return locale.dateFormat || 'yyyy-MM-dd'
  }

  const inputValue = selectedDate ? formatDate(selectedDate, getFormat()) : ''

  const weekDays = locale.shortWeekDays

  const renderHeader = () => {
    switch (panelMode) {
      case 'year':
        const startYear = Math.floor(viewDate.getFullYear() / 10) * 10
        return (
          <StyledHeader>
            <StyledHeaderButton onClick={() => setYear(viewDate.getFullYear() - 10)}>
              <DoubleLeftOutlined />
            </StyledHeaderButton>
            <StyledHeaderTitle>{`${startYear}-${startYear + 9}`}</StyledHeaderTitle>
            <StyledHeaderButton onClick={() => setYear(viewDate.getFullYear() + 10)}>
              <DoubleRightOutlined />
            </StyledHeaderButton>
          </StyledHeader>
        )
      case 'month':
      case 'quarter':
        return (
          <StyledHeader>
            <StyledHeaderButton onClick={prevYear}>
              <DoubleLeftOutlined />
            </StyledHeaderButton>
            <StyledHeaderTitle onClick={() => setPanelMode('year')}>
              {formatDate(viewDate, locale.yearFormat)}
            </StyledHeaderTitle>
            <StyledHeaderButton onClick={nextYear}>
              <DoubleRightOutlined />
            </StyledHeaderButton>
          </StyledHeader>
        )
      default: // date
        return (
          <StyledHeader>
            <StyledHeaderButtonGroup>
              <StyledHeaderButton onClick={prevYear}>
                <DoubleLeftOutlined />
              </StyledHeaderButton>
              <StyledHeaderButton onClick={prevMonth}>
                <LeftOutlined />
              </StyledHeaderButton>
            </StyledHeaderButtonGroup>
            <StyledHeaderTitle onClick={() => setPanelMode('month')}>
              {locale.monthBeforeYear
                ? `${formatDate(viewDate, locale.monthFormat)} ${formatDate(viewDate, locale.yearFormat)}`
                : `${formatDate(viewDate, locale.yearFormat)} ${formatDate(viewDate, locale.monthFormat)}`}
            </StyledHeaderTitle>
            <StyledHeaderButtonGroup>
              <StyledHeaderButton onClick={nextMonth}>
                <RightOutlined />
              </StyledHeaderButton>
              <StyledHeaderButton onClick={nextYear}>
                <DoubleRightOutlined />
              </StyledHeaderButton>
            </StyledHeaderButtonGroup>
          </StyledHeader>
        )
    }
  }

  const renderPanel = () => {
    switch (panelMode) {
      case 'year':
        return (
          <YearPanel
            viewDate={viewDate}
            selectedDate={selectedDate}
            onSelect={(date) => handlePanelSelect(date, 'year')}
          />
        )
      case 'month':
        return (
          <MonthPanel
            viewDate={viewDate}
            selectedDate={selectedDate}
            onSelect={(date) => handlePanelSelect(date, 'month')}
          />
        )
      case 'quarter':
        return (
          <QuarterPanel
            viewDate={viewDate}
            selectedDate={selectedDate}
            onSelect={(date) => handlePanelSelect(date, 'quarter')}
          />
        )
      default:
        const showWeekNumber = picker === 'week'
        return (
          <>
            <StyledWeekDays showWeekNumber={showWeekNumber}>
              {showWeekNumber && <StyledWeekDay />}
              {weekDays.map((day) => (
                <StyledWeekDay key={day}>{day}</StyledWeekDay>
              ))}
            </StyledWeekDays>
            <StyledDays showWeekNumber={showWeekNumber} onMouseLeave={() => setHoveredDate(null)}>
              {days.map((day, index) => {
                let isSelected = day.isSelected
                if (picker === 'week' && selectedDate) {
                  const start = startOfWeek(selectedDate, { weekStartsOn: 1 })
                  const end = endOfWeek(selectedDate, { weekStartsOn: 1 })
                  isSelected = isWithinInterval(day.date, { start, end })
                }

                let isHovered = false
                if (picker === 'week' && hoveredDate) {
                  const start = startOfWeek(hoveredDate, { weekStartsOn: 1 })
                  const end = endOfWeek(hoveredDate, { weekStartsOn: 1 })
                  isHovered = isWithinInterval(day.date, { start, end })
                }

                const isWeekStart = index % 7 === 0
                const isWeekEnd = index % 7 === 6

                return (
                  <React.Fragment key={index}>
                    {showWeekNumber && isWeekStart && (
                      <StyledWeekNumber
                        isSelected={isSelected}
                        isHovered={isHovered}
                        onClick={() => handleDateSelect(day.date)}
                        onMouseEnter={() => setHoveredDate(day.date)}
                      >
                        {getISOWeek(day.date)}
                      </StyledWeekNumber>
                    )}
                    <StyledDay
                      isCurrentMonth={day.isCurrentMonth}
                      isToday={day.isToday}
                      isSelected={isSelected}
                      isWeekMode={showWeekNumber}
                      isWeekEnd={isWeekEnd}
                      isHovered={isHovered}
                      onClick={() => handleDateSelect(day.date)}
                      onMouseEnter={() => setHoveredDate(day.date)}
                    >
                      {formatDate(day.date, 'd')}
                    </StyledDay>
                  </React.Fragment>
                )
              })}
            </StyledDays>
          </>
        )
    }
  }

  return (
    <StyledDatePicker
      ref={ref}
      className={`compass-date-picker ${className || ''}`}
      style={style}
      fullWidth={fullWidth}
    >
      <div ref={refs.setReference} {...getReferenceProps()}>
        <InputField
          {...rest}
          fullWidth={fullWidth}
          placeholder={placeholder || locale.dateSelect}
          value={inputValue}
          readOnly
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          suffix={<CalendarOutlined />}
          allowClear={clearable}
          onChange={(e) => {
            if (!e.target.value) {
              setSelectedDate(null)
              onChange?.(null)
            }
          }}
        />
      </div>

      {isOpen && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              style={{ ...floatingStyles, zIndex: 1000 }}
              {...getFloatingProps()}
            >
              <StyledCalendar>
                {renderHeader()}
                <StyledPickerBody>
                  <StyledDatePanel>{renderPanel()}</StyledDatePanel>
                  {showTime && picker === 'date' && panelMode === 'date' && (
                    <TimePanel value={selectedDate} onChange={handleTimeChange} />
                  )}
                </StyledPickerBody>
                {showTime && picker === 'date' && (
                  <StyledFooter>
                    <div /> {/* Spacer */}
                    <Button size="small" variant="primary" onClick={handleOk}>
                      {locale.ok}
                    </Button>
                  </StyledFooter>
                )}
              </StyledCalendar>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </StyledDatePicker>
  )
})

export default DatePicker

DatePicker.displayName = 'DatePicker'
