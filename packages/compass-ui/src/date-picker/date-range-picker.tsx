import React, { useState, useEffect, useRef } from 'react'
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
import { format as formatDate, isSameDay, isWithinInterval, isBefore, isAfter } from 'date-fns'
import styled from '@emotion/styled'
import { useConfig } from '../config-provider/context'
import defaultLocale from '../locale/zh_CN'

import { DateRangePickerProps } from './types'
import { useCalendar } from './hooks/useCalendar'
import { TimePanel } from './panels'
import Button from '../button'
import {
  CalendarOutlined,
  LeftOutlined,
  RightOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  CloseCircleIcon,
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
  StyledRangeWrapper,
  StyledRangeInput,
  StyledSeparator,
  StyledActiveBar,
  StyledSuffixIcon,
} from './date-picker.styles'

const StyledFooter = styled.div`
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding: 8px 16px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

type SelectingType = 'start' | 'end' | null

const DateRangePicker = React.forwardRef<HTMLDivElement, DateRangePickerProps>((props, ref) => {
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
  const [dates, setDates] = useState<[Date | null, Date | null]>(
    value || defaultValue || [null, null],
  )
  const [selecting, setSelecting] = useState<SelectingType>(null)
  const [hoverDate, setHoverDate] = useState<Date | null>(null)
  const [inputHover, setInputHover] = useState(false)
  const isSecondSelection = useRef(false)

  // Sync internal state with props
  useEffect(() => {
    if (value !== undefined) {
      setDates(value)
    }
  }, [value])

  const { viewDate, days, nextMonth, prevMonth, nextYear, prevYear, setViewDate } = useCalendar({
    value: dates[0] || new Date(),
  })

  const { locale: contextLocale } = useConfig()
  const locale = contextLocale?.DatePicker || defaultLocale.DatePicker

  const handleOpenChange = (open: boolean) => {
    if (!open && (!dates[0] || !dates[1])) {
      setDates([null, null])
      setSelecting(null)
    }
    setIsOpen(open)
  }

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: handleOpenChange,
    middleware: [offset(4), flip(), shift()],
    whileElementsMounted: autoUpdate,
    placement: 'bottom-start',
  })

  const dismiss = useDismiss(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss])

  const handleDateSelect = (date: Date) => {
    if (selecting === 'start') {
      const newDates: [Date | null, Date | null] = [date, dates[1]]
      if (newDates[1] && isAfter(date, newDates[1])) {
        newDates[1] = null
      }
      setDates(newDates)

      if (!showTime) {
        if (isSecondSelection.current && newDates[0] && newDates[1]) {
          onChange?.(newDates)
          setIsOpen(false)
          setSelecting(null)
        } else {
          isSecondSelection.current = true
          setSelecting('end')
        }
      }
    } else if (selecting === 'end') {
      const newDates: [Date | null, Date | null] = [dates[0], date]
      if (newDates[0] && isBefore(date, newDates[0])) {
        newDates[0] = date
        newDates[1] = dates[0]
      }
      setDates(newDates)

      if (!showTime) {
        if (isSecondSelection.current && newDates[0] && newDates[1]) {
          onChange?.(newDates)
          setIsOpen(false)
          setSelecting(null)
        } else {
          isSecondSelection.current = true
          setSelecting('start')
        }
      }
    }
  }

  const handleTimeChange = (date: Date, type: 'start' | 'end') => {
    const newDates: [Date | null, Date | null] = [...dates]
    if (type === 'start') {
      newDates[0] = date
    } else {
      newDates[1] = date
    }
    setDates(newDates)
  }

  const handleOk = () => {
    if (!dates[0]) {
      setSelecting('start')
      return
    }
    if (!dates[1]) {
      setSelecting('end')
      return
    }
    onChange?.(dates)
    setIsOpen(false)
    setSelecting(null)
  }

  const handleInputClick = (type: 'start' | 'end') => {
    if (disabled) return
    setIsOpen(true)
    isSecondSelection.current = false
    setSelecting(type)
    if (type === 'start' && dates[0]) {
      setViewDate(dates[0])
    } else if (type === 'end' && dates[1]) {
      setViewDate(dates[1])
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDates([null, null])
    onChange?.([null, null])
    setSelecting(null)
  }

  const getFormat = () => {
    if (format) return format
    if (showTime) return 'yyyy-MM-dd HH:mm:ss'
    return 'yyyy-MM-dd'
  }

  const isInRange = (date: Date) => {
    if (dates[0] && dates[1]) {
      return isWithinInterval(date, { start: dates[0], end: dates[1] })
    }
    if (selecting === 'end' && dates[0] && hoverDate) {
      const start = isBefore(dates[0], hoverDate) ? dates[0] : hoverDate
      const end = isBefore(dates[0], hoverDate) ? hoverDate : dates[0]
      return isWithinInterval(date, { start, end })
    }
    return false
  }

  const isSelected = (date: Date) => {
    return (dates[0] && isSameDay(date, dates[0])) || (dates[1] && isSameDay(date, dates[1]))
  }

  const weekDays = locale.shortWeekDays

  return (
    <StyledDatePicker
      ref={ref}
      className={`compass-date-range-picker ${className || ''}`}
      style={style}
      fullWidth={fullWidth}
    >
      <div ref={refs.setReference} {...getReferenceProps()}>
        <StyledRangeWrapper
          focused={isOpen}
          disabled={disabled}
          onMouseEnter={() => setInputHover(true)}
          onMouseLeave={() => setInputHover(false)}
        >
          <StyledRangeInput
            placeholder={placeholder?.[0] || locale.startDate}
            value={dates[0] ? formatDate(dates[0], getFormat()) : ''}
            readOnly
            disabled={disabled}
            onClick={() => handleInputClick('start')}
          />
          <StyledSeparator>→</StyledSeparator>
          <StyledRangeInput
            placeholder={placeholder?.[1] || locale.endDate}
            value={dates[1] ? formatDate(dates[1], getFormat()) : ''}
            readOnly
            disabled={disabled}
            onClick={() => handleInputClick('end')}
          />
          {clearable && inputHover && (dates[0] || dates[1]) ? (
            <StyledSuffixIcon onClick={handleClear} style={{ cursor: 'pointer' }}>
              <CloseCircleIcon />
            </StyledSuffixIcon>
          ) : (
            <StyledSuffixIcon>
              <CalendarOutlined />
            </StyledSuffixIcon>
          )}
          {isOpen && selecting && (
            <StyledActiveBar position={selecting === 'start' ? 'left' : 'right'} />
          )}
        </StyledRangeWrapper>
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
                <StyledHeader>
                  <StyledHeaderButtonGroup>
                    <StyledHeaderButton onClick={prevYear}>
                      <DoubleLeftOutlined />
                    </StyledHeaderButton>
                    <StyledHeaderButton onClick={prevMonth}>
                      <LeftOutlined />
                    </StyledHeaderButton>
                  </StyledHeaderButtonGroup>
                  <StyledHeaderTitle>
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
                <StyledPickerBody>
                  <StyledDatePanel>
                    <StyledWeekDays>
                      {weekDays.map((day) => (
                        <StyledWeekDay key={day}>{day}</StyledWeekDay>
                      ))}
                    </StyledWeekDays>
                    <StyledDays>
                      {days.map((day, index) => {
                        const inRange = isInRange(day.date)
                        const selected = isSelected(day.date)

                        return (
                          <StyledDay
                            key={index}
                            isCurrentMonth={day.isCurrentMonth}
                            isToday={day.isToday}
                            isSelected={!!selected}
                            isInRange={inRange && !selected}
                            onClick={() => handleDateSelect(day.date)}
                            onMouseEnter={() => setHoverDate(day.date)}
                            onMouseLeave={() => setHoverDate(null)}
                          >
                            {formatDate(day.date, 'd')}
                          </StyledDay>
                        )
                      })}
                    </StyledDays>
                  </StyledDatePanel>
                  {showTime && selecting && (
                    <TimePanel
                      value={selecting === 'start' ? dates[0] : dates[1]}
                      onChange={(date) => handleTimeChange(date, selecting)}
                    />
                  )}
                </StyledPickerBody>
                {showTime && (
                  <StyledFooter>
                    <Button
                      size="small"
                      variant="primary"
                      onClick={handleOk}
                      disabled={selecting === 'start' ? !dates[0] : !dates[1]}
                    >
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

export default DateRangePicker

DateRangePicker.displayName = 'DateRangePicker'
