import React, { useRef, useEffect } from 'react'
import styled from '@emotion/styled'
import { setHours, setMinutes, setSeconds } from 'date-fns'
import { useConfig } from '../../config-provider/context'
import { getThemeColors } from '../../theme/utils'

const StyledTimePanel = styled.div`
  display: flex;
  flex-direction: column;
  border-left: 1px solid rgba(0, 0, 0, 0.06);
  height: 320px; // Fixed height to match date panel
  width: 160px;
`

interface TimePanelProps {
  value?: Date | null
  onChange: (date: Date) => void
}

const StyledColumn = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 4px 0;

  &:not(:last-child) {
    border-right: 1px solid rgba(0, 0, 0, 0.06);
  }

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => getThemeColors(theme).border};
    border-radius: 3px;

    &:hover {
      background: ${({ theme }) => getThemeColors(theme).textSecondary};
    }
  }
`

const StyledTimeCell = styled.div<{ isSelected?: boolean }>`
  padding: 6px 0;
  text-align: center;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${({ theme, isSelected }) =>
    isSelected ? getThemeColors(theme).primary : 'transparent'};
  color: ${({ theme, isSelected }) => (isSelected ? '#fff' : getThemeColors(theme).text)};
  margin: 0 4px;
  border-radius: 4px;

  &:hover {
    background: ${({ theme, isSelected }) =>
      isSelected
        ? getThemeColors(theme).primaryHover || getThemeColors(theme).primary
        : getThemeColors(theme).backgroundSecondary};
  }

  &:active {
    transform: scale(0.95);
  }
`

const StyledTimeHeader = styled.div`
  height: 41px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  box-sizing: border-box;
  display: flex;
  align-items: center;
`

const StyledHeaderCell = styled.div`
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: ${({ theme }) => getThemeColors(theme).textSecondary};
  font-weight: 400;
  line-height: 40px;
`

const StyledTimeBody = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`

export const TimePanel: React.FC<TimePanelProps> = ({ value, onChange }) => {
  const { locale } = useConfig()
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: 60 }, (_, i) => i)
  const seconds = Array.from({ length: 60 }, (_, i) => i)

  const currentDate = value || new Date()

  const handleHourChange = (hour: number) => {
    onChange(setHours(currentDate, hour))
  }

  const handleMinuteChange = (minute: number) => {
    onChange(setMinutes(currentDate, minute))
  }

  const handleSecondChange = (second: number) => {
    onChange(setSeconds(currentDate, second))
  }

  return (
    <StyledTimePanel>
      <StyledTimeHeader>
        <StyledHeaderCell>{locale?.DatePicker.hour || '时'}</StyledHeaderCell>
        <StyledHeaderCell>{locale?.DatePicker.minute || '分'}</StyledHeaderCell>
        <StyledHeaderCell>{locale?.DatePicker.second || '秒'}</StyledHeaderCell>
      </StyledTimeHeader>
      <StyledTimeBody>
        <StyledColumn>
          {hours.map((hour) => (
            <StyledTimeCell
              key={hour}
              isSelected={currentDate.getHours() === hour}
              onClick={() => handleHourChange(hour)}
            >
              {hour.toString().padStart(2, '0')}
            </StyledTimeCell>
          ))}
        </StyledColumn>
        <StyledColumn>
          {minutes.map((minute) => (
            <StyledTimeCell
              key={minute}
              isSelected={currentDate.getMinutes() === minute}
              onClick={() => handleMinuteChange(minute)}
            >
              {minute.toString().padStart(2, '0')}
            </StyledTimeCell>
          ))}
        </StyledColumn>
        <StyledColumn>
          {seconds.map((second) => (
            <StyledTimeCell
              key={second}
              isSelected={currentDate.getSeconds() === second}
              onClick={() => handleSecondChange(second)}
            >
              {second.toString().padStart(2, '0')}
            </StyledTimeCell>
          ))}
        </StyledColumn>
      </StyledTimeBody>
    </StyledTimePanel>
  )
}
