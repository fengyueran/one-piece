import styled from '@emotion/styled'
import { getComponentTheme, getThemeColors } from '../theme/utils'

export const StyledDatePicker = styled.div<{ fullWidth?: boolean }>`
  position: relative;
  display: inline-block;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
`

export const StyledCalendar = styled.div`
  background: ${({ theme }) => getThemeColors(theme).background};
  border: 1px solid ${({ theme }) => getComponentTheme(theme, 'datePicker').borderColor};
  border-radius: 8px;
  box-shadow: ${({ theme }) => getComponentTheme(theme, 'datePicker').boxShadow};
  width: auto;
  user-select: none;
  overflow: hidden;
`

export const StyledPickerBody = styled.div`
  display: flex;
  border-top: 1px solid ${({ theme }) => getComponentTheme(theme, 'datePicker').borderColor};
`

export const StyledDatePanel = styled.div`
  width: 280px;
`

export const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => getComponentTheme(theme, 'datePicker').headerPadding};
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
  color: ${({ theme }) => getThemeColors(theme).textSecondary};
  font-size: 14px;
  line-height: 1;
  transition: all 0.2s;
  min-width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${({ theme }) => getThemeColors(theme).text};
    background: ${({ theme }) => getThemeColors(theme).backgroundSecondary};
  }
`

export const StyledHeaderTitle = styled.div`
  font-weight: 500;
  cursor: pointer;
  font-size: ${({ theme }) => getComponentTheme(theme, 'datePicker').headerFontSize};
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => getThemeColors(theme).primary};
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
  color: ${({ theme }) => getThemeColors(theme).textSecondary};
  font-size: ${({ theme }) => getComponentTheme(theme, 'datePicker').weekDayFontSize};
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
  height: ${({ theme }) => getComponentTheme(theme, 'datePicker').cellHeight};
  width: 100%;
  margin: ${({ theme }) => getComponentTheme(theme, 'datePicker').cellMargin} 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => getComponentTheme(theme, 'datePicker').weekDayFontSize};
  box-sizing: border-box;
  color: ${({ theme, isSelected, isHovered }) => {
    if (isSelected || isHovered) return getComponentTheme(theme, 'datePicker').cellActiveColor
    return getThemeColors(theme).textSecondary
  }};
  background: ${({ theme, isSelected, isHovered }) => {
    if (isSelected) return getComponentTheme(theme, 'datePicker').cellActiveBg
    if (isHovered) return getComponentTheme(theme, 'datePicker').cellHoverBg
    return 'transparent'
  }};
  border-radius: ${({ theme }) => getComponentTheme(theme, 'datePicker').cellBorderRadius} 0 0
    ${({ theme }) => getComponentTheme(theme, 'datePicker').cellBorderRadius};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme, isSelected }) =>
      isSelected
        ? getComponentTheme(theme, 'datePicker').cellActiveBg
        : getComponentTheme(theme, 'datePicker').cellHoverBg};
    color: ${({ theme, isSelected }) =>
      isSelected
        ? getComponentTheme(theme, 'datePicker').cellActiveColor
        : getComponentTheme(theme, 'datePicker').cellActiveColor};
  }
`

const hexToRgba = (hex: string, opacity: number) => {
  if (!hex || !hex.startsWith('#')) return hex
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

export const StyledDay = styled.div<{
  isCurrentMonth?: boolean
  isToday?: boolean
  isSelected?: boolean
  isWeekMode?: boolean
  isWeekEnd?: boolean
  isHovered?: boolean
  isInRange?: boolean
}>`
  height: ${({ theme }) => getComponentTheme(theme, 'datePicker').cellHeight};
  width: ${({ isWeekMode, theme }) =>
    isWeekMode ? '100%' : getComponentTheme(theme, 'datePicker').cellWidth};
  margin: ${({ isWeekMode, theme }) =>
    isWeekMode
      ? `${getComponentTheme(theme, 'datePicker').cellMargin} 0`
      : `${getComponentTheme(theme, 'datePicker').cellMargin} auto`};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-sizing: border-box;
  font-size: ${({ theme }) => getComponentTheme(theme, 'datePicker').cellFontSize};
  color: ${({ theme, isCurrentMonth, isSelected, isHovered }) => {
    if (isSelected || isHovered) return getComponentTheme(theme, 'datePicker').cellActiveColor
    return isCurrentMonth
      ? getComponentTheme(theme, 'datePicker').cellColor
      : getComponentTheme(theme, 'datePicker').cellDisabledColor
  }};
  background: ${({ theme, isSelected, isHovered, isInRange }) => {
    if (isSelected) return getComponentTheme(theme, 'datePicker').cellActiveBg
    if (isHovered) return getComponentTheme(theme, 'datePicker').cellHoverBg
    if (isInRange) return hexToRgba(getThemeColors(theme).primary, 0.2)
    return 'transparent'
  }};
  border-radius: ${({ isWeekMode, isWeekEnd, theme }) =>
    isWeekMode
      ? isWeekEnd
        ? `0 ${getComponentTheme(theme, 'datePicker').cellBorderRadius} ${getComponentTheme(theme, 'datePicker').cellBorderRadius} 0`
        : '0'
      : getComponentTheme(theme, 'datePicker').cellBorderRadius};
  border: ${({ theme, isToday, isSelected, isWeekMode, isHovered }) => {
    if (isWeekMode && isHovered) return '1px solid transparent'
    return !isSelected && isToday
      ? `1px solid ${getComponentTheme(theme, 'datePicker').cellActiveBg}`
      : '1px solid transparent'
  }};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: ${({ theme, isSelected }) =>
      isSelected
        ? getComponentTheme(theme, 'datePicker').cellActiveBg
        : getComponentTheme(theme, 'datePicker').cellHoverBg};
    color: ${({ theme, isSelected }) =>
      isSelected
        ? getComponentTheme(theme, 'datePicker').cellActiveColor
        : getComponentTheme(theme, 'datePicker').cellActiveColor};
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
  background-color: ${({ theme }) => getThemeColors(theme).background};
  border: 1px solid
    ${({ theme, error, focused }) => {
      if (error) return getThemeColors(theme).error
      if (focused) return getComponentTheme(theme, 'input').activeBorderColor
      return getThemeColors(theme).border
    }};
  border-radius: ${({ theme }) => getComponentTheme(theme, 'input').borderRadius};
  padding: 4px 11px;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme, error, focused, disabled }) => {
      if (disabled) return getThemeColors(theme).border
      if (error) return getThemeColors(theme).error
      if (focused) return getComponentTheme(theme, 'input').activeBorderColor
      return getComponentTheme(theme, 'input').hoverBorderColor
    }};
  }

  ${({ disabled, theme }) =>
    disabled &&
    `
    background-color: ${getThemeColors(theme).backgroundSecondary};
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
  color: ${({ theme }) => getThemeColors(theme).text};
  font-size: 14px;
  width: 100%;
  text-align: center;

  &::placeholder {
    color: ${({ theme }) => getThemeColors(theme).textDisabled};
  }

  &:disabled {
    cursor: not-allowed;
  }
`

export const StyledSeparator = styled.span`
  color: ${({ theme }) => getThemeColors(theme).textSecondary};
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
  background-color: ${({ theme }) => getThemeColors(theme).primary};
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
  color: ${({ theme }) => getThemeColors(theme).textSecondary};
  margin-left: 8px;
  width: 16px;
  justify-content: center;
  font-size: 14px;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => getThemeColors(theme).text};
  }
`
