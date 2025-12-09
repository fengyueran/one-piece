import React from 'react'
import styled from '@emotion/styled'
import { setYear } from 'date-fns'

const StyledYearGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 8px 16px;
`

const StyledYearCell = styled.div<{ isSelected?: boolean; isCurrent?: boolean }>`
  padding: 8px 12px;
  text-align: center;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  background: ${({ theme, isSelected }) => (isSelected ? theme.colors.primary : 'transparent')};
  color: ${({ theme, isSelected, isCurrent }) =>
    isSelected ? '#fff' : isCurrent ? theme.colors.text : theme.colors.textDisabled};

  &:hover {
    background: ${({ theme, isSelected }) =>
      isSelected ? theme.colors.primary : 'rgba(0, 0, 0, 0.08)'};
  }
`

interface YearPanelProps {
  viewDate: Date
  onSelect: (date: Date) => void
  selectedDate?: Date | null
}

export const YearPanel: React.FC<YearPanelProps> = ({ viewDate, onSelect, selectedDate }) => {
  const currentYear = viewDate.getFullYear()
  const startYear = Math.floor(currentYear / 10) * 10
  const years = Array.from({ length: 12 }, (_, i) => startYear - 1 + i)

  const handleSelect = (year: number) => {
    const newDate = setYear(viewDate, year)
    onSelect(newDate)
  }

  return (
    <StyledYearGrid>
      {years.map((year) => {
        const isSelected = selectedDate ? selectedDate.getFullYear() === year : false
        const isCurrent = year >= startYear && year <= startYear + 9

        return (
          <StyledYearCell
            key={year}
            isSelected={isSelected}
            isCurrent={isCurrent}
            onClick={() => handleSelect(year)}
          >
            {year}
          </StyledYearCell>
        )
      })}
    </StyledYearGrid>
  )
}
