import styled from '@emotion/styled'

export const StyledDatePicker = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
`

export const StyledCalendar = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.components.datePicker.borderColor};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.components.datePicker.boxShadow};
  width: auto;
  user-select: none;
  overflow: hidden;
`

export const StyledPickerBody = styled.div`
  display: flex;
  border-top: 1px solid ${({ theme }) => theme.components.datePicker.borderColor};
`

export const StyledDatePanel = styled.div`
  width: 280px;
`

export const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.components.datePicker.headerPadding};
`

export const StyledHeaderButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

export const StyledHeaderButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  line-height: 1;
  transition: all 0.2s;
  min-width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.backgroundSecondary};
  }
`

export const StyledHeaderTitle = styled.div`
  font-weight: 500;
  cursor: pointer;
  font-size: ${({ theme }) => theme.components.datePicker.headerFontSize};
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`

export const StyledWeekDays = styled.div<{ showWeekNumber?: boolean }>`
  display: grid;
  grid-template-columns: ${({ showWeekNumber }) =>
    showWeekNumber ? '40px repeat(7, 1fr)' : 'repeat(7, 1fr)'};
  padding: 8px 12px 4px;
  text-align: center;
`

export const StyledWeekDay = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.components.datePicker.weekDayFontSize};
  padding: 4px 0;
  font-weight: 400;
`

export const StyledDays = styled.div<{ showWeekNumber?: boolean }>`
  display: grid;
  grid-template-columns: ${({ showWeekNumber }) =>
    showWeekNumber ? '40px repeat(7, 1fr)' : 'repeat(7, 1fr)'};
  gap: 0;
  padding: 4px 12px 8px;
`

export const StyledWeekNumber = styled.div<{ isSelected?: boolean; isHovered?: boolean }>`
  height: ${({ theme }) => theme.components.datePicker.cellHeight};
  width: 100%;
  margin: ${({ theme }) => theme.components.datePicker.cellMargin} 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.components.datePicker.weekDayFontSize};
  box-sizing: border-box;
  color: ${({ theme, isSelected, isHovered }) => {
    if (isSelected || isHovered) return theme.components.datePicker.cellActiveColor
    return theme.colors.textSecondary
  }};
  background: ${({ theme, isSelected, isHovered }) => {
    if (isSelected) return theme.components.datePicker.cellActiveBg
    if (isHovered) return theme.components.datePicker.cellHoverBg
    return 'transparent'
  }};
  border-radius: ${({ theme }) => theme.components.datePicker.cellBorderRadius} 0 0
    ${({ theme }) => theme.components.datePicker.cellBorderRadius};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme, isSelected }) =>
      isSelected
        ? theme.components.datePicker.cellActiveBg
        : theme.components.datePicker.cellHoverBg};
    color: ${({ theme, isSelected }) =>
      isSelected
        ? theme.components.datePicker.cellActiveColor
        : theme.components.datePicker.cellActiveColor};
  }
`

export const StyledDay = styled.div<{
  isCurrentMonth?: boolean
  isToday?: boolean
  isSelected?: boolean
  isWeekMode?: boolean
  isWeekEnd?: boolean
  isHovered?: boolean
}>`
  height: ${({ theme }) => theme.components.datePicker.cellHeight};
  width: ${({ isWeekMode, theme }) =>
    isWeekMode ? '100%' : theme.components.datePicker.cellWidth};
  margin: ${({ isWeekMode, theme }) =>
    isWeekMode
      ? `${theme.components.datePicker.cellMargin} 0`
      : `${theme.components.datePicker.cellMargin} auto`};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-sizing: border-box;
  font-size: ${({ theme }) => theme.components.datePicker.cellFontSize};
  color: ${({ theme, isCurrentMonth, isSelected, isHovered }) => {
    if (isSelected || isHovered) return theme.components.datePicker.cellActiveColor
    return isCurrentMonth
      ? theme.components.datePicker.cellColor
      : theme.components.datePicker.cellDisabledColor
  }};
  background: ${({ theme, isSelected, isHovered }) => {
    if (isSelected) return theme.components.datePicker.cellActiveBg
    if (isHovered) return theme.components.datePicker.cellHoverBg
    return 'transparent'
  }};
  border-radius: ${({ isWeekMode, isWeekEnd, theme }) =>
    isWeekMode
      ? isWeekEnd
        ? `0 ${theme.components.datePicker.cellBorderRadius} ${theme.components.datePicker.cellBorderRadius} 0`
        : '0'
      : theme.components.datePicker.cellBorderRadius};
  border: ${({ theme, isToday, isSelected, isWeekMode, isHovered }) => {
    if (isWeekMode && isHovered) return '1px solid transparent'
    return !isSelected && isToday
      ? `1px solid ${theme.components.datePicker.cellActiveBg}`
      : '1px solid transparent'
  }};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: ${({ theme, isSelected }) =>
      isSelected
        ? theme.components.datePicker.cellActiveBg
        : theme.components.datePicker.cellHoverBg};
    color: ${({ theme, isSelected }) =>
      isSelected
        ? theme.components.datePicker.cellActiveColor
        : theme.components.datePicker.cellActiveColor};
  }

  &:active {
    transform: ${({ isWeekMode }) => (isWeekMode ? 'none' : 'scale(0.95)')};
  }
`

export const StyledRangeWrapper = styled.div<{
  focused?: boolean
  disabled?: boolean
  error?: boolean
}>`
  display: flex;
  align-items: center;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  min-width: 320px;
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid
    ${({ theme, error, focused }) => {
      if (error) return theme.colors.error
      if (focused) return theme.components.input.activeBorderColor
      return theme.colors.border
    }};
  border-radius: ${({ theme }) => theme.components.input.borderRadius};
  padding: 4px 11px;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme, error, focused, disabled }) => {
      if (disabled) return theme.colors.border
      if (error) return theme.colors.error
      if (focused) return theme.components.input.activeBorderColor
      return theme.components.input.hoverBorderColor
    }};
  }

  ${({ disabled, theme }) =>
    disabled &&
    `
    background-color: ${theme.colors.backgroundSecondary};
    cursor: not-allowed;
    opacity: 0.6;
  `}
`

export const StyledRangeInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 0;
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  width: 100%;
  text-align: center;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textDisabled};
  }

  &:disabled {
    cursor: not-allowed;
  }
`

export const StyledSeparator = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 8px;
  flex-shrink: 0;
`

export const StyledActiveBar = styled.div<{
  position: 'left' | 'right'
  width?: number
}>`
  position: absolute;
  bottom: -1px;
  height: 2px;
  background-color: ${({ theme }) => theme.colors.primary};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  left: ${({ position }) => (position === 'left' ? '0' : '50%')};
  width: 50%;
  pointer-events: none;
  opacity: 1;
  z-index: 1;
`

export const StyledSuffixIcon = styled.span`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-left: 8px;
  font-size: 14px;
`
