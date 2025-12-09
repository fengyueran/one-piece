import React from 'react'
import styled from '@emotion/styled'
import { setMonth, setQuarter, getQuarter } from 'date-fns'

const StyledQuarterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 24px 16px;
`

const StyledQuarterCell = styled.div<{ isSelected?: boolean }>`
  padding: 16px 12px;
  text-align: center;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  background: ${({ theme, isSelected }) => (isSelected ? theme.colors.primary : 'transparent')};
  color: ${({ theme, isSelected }) => (isSelected ? '#fff' : theme.colors.text)};

  &:hover {
    background: ${({ theme, isSelected }) =>
      isSelected ? theme.colors.primary : 'rgba(0, 0, 0, 0.08)'};
  }
`

interface QuarterPanelProps {
  viewDate: Date
  onSelect: (date: Date) => void
  selectedDate?: Date | null
}

export const QuarterPanel: React.FC<QuarterPanelProps> = ({ viewDate, onSelect, selectedDate }) => {
  const quarters = [1, 2, 3, 4]

  const handleSelect = (quarter: number) => {
    const newDate = setMonth(viewDate, (quarter - 1) * 3)
    onSelect(newDate)
  }

  return (
    <StyledQuarterGrid>
      {quarters.map((quarter) => {
        const isSelected = selectedDate
          ? getQuarter(selectedDate) === quarter &&
            selectedDate.getFullYear() === viewDate.getFullYear()
          : false

        return (
          <StyledQuarterCell
            key={quarter}
            isSelected={isSelected}
            onClick={() => handleSelect(quarter)}
          >
            Q{quarter}
          </StyledQuarterCell>
        )
      })}
    </StyledQuarterGrid>
  )
}
