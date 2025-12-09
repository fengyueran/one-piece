import React from 'react'
import styled from '@emotion/styled'
import { setMonth, format } from 'date-fns'

const StyledMonthGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 8px 0;
`

const StyledMonthCell = styled.div<{ isSelected?: boolean }>`
  padding: 8px 0;
  text-align: center;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  background: ${({ theme, isSelected }) => (isSelected ? theme.colors.primary : 'transparent')};
  color: ${({ theme, isSelected }) => (isSelected ? '#fff' : theme.colors.text)};

  &:hover {
    background: ${({ theme, isSelected }) =>
      isSelected ? theme.colors.primary : theme.colors.backgroundSecondary};
  }
`

interface MonthPanelProps {
  viewDate: Date
  onSelect: (date: Date) => void
  selectedDate?: Date | null
}

export const MonthPanel: React.FC<MonthPanelProps> = ({ viewDate, onSelect, selectedDate }) => {
  const months = Array.from({ length: 12 }, (_, i) => i)

  const handleSelect = (monthIndex: number) => {
    const newDate = setMonth(viewDate, monthIndex)
    onSelect(newDate)
  }

  return (
    <StyledMonthGrid>
      {months.map((month) => {
        const date = setMonth(viewDate, month)
        const isSelected = selectedDate
          ? selectedDate.getMonth() === month &&
            selectedDate.getFullYear() === viewDate.getFullYear()
          : false

        return (
          <StyledMonthCell key={month} isSelected={isSelected} onClick={() => handleSelect(month)}>
            {format(date, 'MMM')}
          </StyledMonthCell>
        )
      })}
    </StyledMonthGrid>
  )
}
