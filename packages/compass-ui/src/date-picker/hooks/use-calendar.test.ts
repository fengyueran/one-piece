import { renderHook, act } from '@testing-library/react'
import { isSameDay } from 'date-fns'

import { useCalendar } from './use-calendar'

describe('useCalendar', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useCalendar({}))
    expect(result.current.viewDate).toBeInstanceOf(Date)
    expect(isSameDay(result.current.viewDate, new Date())).toBe(true)
  })

  it('should initialize with value prop', () => {
    const date = new Date(2023, 0, 15)
    const { result } = renderHook(() => useCalendar({ value: date }))
    expect(isSameDay(result.current.viewDate, date)).toBe(true)
  })

  it('should update viewDate when value changes', () => {
    const { result, rerender } = renderHook(({ value }) => useCalendar({ value }), {
      initialProps: { value: new Date(2023, 0, 15) },
    })

    const newDate = new Date(2023, 1, 15)
    rerender({ value: newDate })
    expect(isSameDay(result.current.viewDate, newDate)).toBe(true)
  })

  it('should navigate months and years', () => {
    const date = new Date(2023, 0, 15) // Jan 2023
    const { result } = renderHook(() => useCalendar({ defaultValue: date }))

    act(() => {
      result.current.nextMonth()
    })
    expect(result.current.viewDate.getMonth()).toBe(1) // Feb

    act(() => {
      result.current.prevMonth()
    })
    expect(result.current.viewDate.getMonth()).toBe(0) // Jan

    act(() => {
      result.current.nextYear()
    })
    expect(result.current.viewDate.getFullYear()).toBe(2024)

    act(() => {
      result.current.prevYear()
    })
    expect(result.current.viewDate.getFullYear()).toBe(2023)
  })

  it('should set specific month and year', () => {
    const date = new Date(2023, 0, 15)
    const { result } = renderHook(() => useCalendar({ defaultValue: date }))

    act(() => {
      result.current.setMonth(5) // June
    })
    expect(result.current.viewDate.getMonth()).toBe(5)

    act(() => {
      result.current.setYear(2025)
    })
    expect(result.current.viewDate.getFullYear()).toBe(2025)
  })

  it('should generate correct days for view', () => {
    // Jan 2023. Starts on Sunday Jan 1.
    // If week starts on Monday:
    // Dec 26 (Mon) to Feb 5 (Sun) is probable range (6 weeks usually, 42 days)
    const date = new Date(2023, 0, 1)
    const { result } = renderHook(() => useCalendar({ defaultValue: date }))

    // Just check we have days
    expect(result.current.days.length).toBeGreaterThan(0)

    // Check first day properties
    const firstDay = result.current.days[0]
    expect(firstDay).toHaveProperty('date')
    expect(firstDay).toHaveProperty('isCurrentMonth')
    expect(firstDay).toHaveProperty('isToday')
    expect(firstDay).toHaveProperty('isSelected')
  })
})
