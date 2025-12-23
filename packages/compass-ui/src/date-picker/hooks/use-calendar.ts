import { useMemo, useState } from 'react'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns'

export interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
}

interface UseCalendarProps {
  value?: Date | null
  defaultValue?: Date | null
}

export const useCalendar = ({ value, defaultValue }: UseCalendarProps) => {
  const [viewDate, setViewDate] = useState<Date>(value || defaultValue || new Date())
  const [lastSyncedValue, setLastSyncedValue] = useState(value)

  // Sync viewDate when value changes
  if (value && value !== lastSyncedValue && !isSameDay(viewDate, value)) {
    setViewDate(value)
    setLastSyncedValue(value)
  }

  const days = useMemo(() => {
    const monthStart = startOfMonth(viewDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }) // Monday start
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })

    const calendarDays = eachDayOfInterval({
      start: startDate,
      end: endDate,
    })

    return calendarDays.map((date) => ({
      date,
      isCurrentMonth: isSameMonth(date, monthStart),
      isToday: isToday(date),
      isSelected: value ? isSameDay(date, value) : false,
    }))
  }, [viewDate, value])

  const nextMonth = () => setViewDate(addMonths(viewDate, 1))
  const prevMonth = () => setViewDate(subMonths(viewDate, 1))
  const nextYear = () => setViewDate(addMonths(viewDate, 12))
  const prevYear = () => setViewDate(subMonths(viewDate, 12))

  const setMonth = (month: number) => {
    const newDate = new Date(viewDate)
    newDate.setMonth(month)
    setViewDate(newDate)
  }

  const setYear = (year: number) => {
    const newDate = new Date(viewDate)
    newDate.setFullYear(year)
    setViewDate(newDate)
  }

  return {
    viewDate,
    days,
    nextMonth,
    prevMonth,
    nextYear,
    prevYear,
    setMonth,
    setYear,
    setViewDate,
  }
}
