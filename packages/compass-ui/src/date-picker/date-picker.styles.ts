import styled from '@emotion/styled'
import { token } from '../theme/token-utils'

export const StyledDatePicker = styled.div<{ fullWidth?: boolean }>`
  position: relative;
  display: inline-block;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
`

export const StyledCalendar = styled.div`
  background: ${token('colors.background', '#fff')};
  border: 1px solid ${token('components.datePicker.borderColor', token('colors.border', '#d9d9d9'))};
  border-radius: ${token('borderRadius.lg', '8px')};
  box-shadow: ${token(
    'components.datePicker.boxShadow',
    token('shadows.lg', '0 6px 16px 0 rgba(0, 0, 0, 0.08)'),
  )};
  width: auto;
  user-select: none;
  overflow: hidden;
`

export const StyledPickerBody = styled.div`
  display: flex;
  border-top: 1px solid
    ${token('components.datePicker.borderColor', token('colors.border', '#d9d9d9'))};
`

export const StyledDatePanel = styled.div`
  width: 280px;
`

export const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${token('components.datePicker.headerPadding', '11px 16px')};
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
  color: ${token('colors.textSecondary', 'rgba(0, 0, 0, 0.45)')};
  font-size: 14px;
  line-height: 1;
  transition: all 0.2s;
  min-width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${token('colors.text', 'rgba(0, 0, 0, 0.88)')};
    background: ${token('colors.backgroundSecondary', 'rgba(0, 0, 0, 0.04)')};
  }
`

export const StyledHeaderTitle = styled.div`
  font-weight: 500;
  cursor: pointer;
  font-size: ${token('components.datePicker.headerFontSize', '16px')};
  transition: color 0.2s;

  &:hover {
    color: ${token('colors.primary', '#1890ff')};
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
  color: ${token('colors.textSecondary', 'rgba(0, 0, 0, 0.45)')};
  font-size: ${token('components.datePicker.weekDayFontSize', '12px')};
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
  height: ${token('components.datePicker.cellHeight', '24px')};
  width: 100%;
  margin: ${token('components.datePicker.cellMargin', '3px')} 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${token('components.datePicker.weekDayFontSize', '12px')};
  box-sizing: border-box;
  color: ${({ isSelected, isHovered }) => {
    if (isSelected || isHovered)
      return token('components.datePicker.cellActiveColor', token('colors.primary', '#1890ff'))
    return token('colors.textSecondary', 'rgba(0, 0, 0, 0.45)')
  }};
  background: ${({ isSelected, isHovered }) => {
    if (isSelected) return token('components.datePicker.cellActiveBg', '#e6f7ff')
    if (isHovered) return token('components.datePicker.cellHoverBg', '#f0f0f0')
    return 'transparent'
  }};
  border-radius: ${token('components.datePicker.cellBorderRadius', '2px')} 0 0
    ${token('components.datePicker.cellBorderRadius', '2px')};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ isSelected }) =>
      isSelected
        ? token('components.datePicker.cellActiveBg', '#e6f7ff')
        : token('components.datePicker.cellHoverBg', '#f0f0f0')};
    color: ${({ isSelected }) =>
      isSelected
        ? token('components.datePicker.cellActiveColor', '#1890ff')
        : token('components.datePicker.cellActiveColor', '#1890ff')};
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
  height: ${token('components.datePicker.cellHeight', '24px')};
  width: ${({ isWeekMode }) =>
    isWeekMode ? '100%' : token('components.datePicker.cellWidth', '36px')};
  margin: ${({ isWeekMode }) =>
    isWeekMode
      ? `${token('components.datePicker.cellMargin', '3px')} 0`
      : `${token('components.datePicker.cellMargin', '3px')} auto`};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-sizing: border-box;
  font-size: ${token('components.datePicker.cellFontSize', '14px')};
  color: ${({ isCurrentMonth, isSelected, isHovered }) => {
    if (isSelected || isHovered)
      return token('components.datePicker.cellActiveColor', token('colors.primary', '#1890ff'))
    return isCurrentMonth
      ? token('components.datePicker.cellColor', token('colors.text', 'rgba(0, 0, 0, 0.88)'))
      : token('components.datePicker.cellDisabledColor', 'rgba(0, 0, 0, 0.25)')
  }};
  background: ${({ isSelected, isHovered, isInRange }) => {
    if (isSelected) return token('components.datePicker.cellActiveBg', '#e6f7ff')
    if (isHovered) return token('components.datePicker.cellHoverBg', '#f0f0f0')
    if (isInRange) return hexToRgba(token('colors.primary', '#1890ff'), 0.2) // Note: token() returns string like var(...), not hex, so hexToRgba might fail if no fallback is used or if var is returned. For simplicity, we assume primary color fallback here or improvement in token util. Ideally, we shouldn't mix JS and CSS var for colors if we can avoid it.
    return 'transparent'
  }};
  border-radius: ${({ isWeekMode, isWeekEnd }) =>
    isWeekMode
      ? isWeekEnd
        ? `0 ${token('components.datePicker.cellBorderRadius', '2px')} ${token('components.datePicker.cellBorderRadius', '2px')} 0`
        : '0'
      : token('components.datePicker.cellBorderRadius', '2px')};
  border: ${({ isToday, isSelected, isWeekMode, isHovered }) => {
    if (isWeekMode && isHovered) return '1px solid transparent'
    return !isSelected && isToday
      ? `1px solid ${token('components.datePicker.cellActiveBg', '#e6f7ff')}`
      : '1px solid transparent'
  }};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: ${({ isSelected }) =>
      isSelected
        ? token('components.datePicker.cellActiveBg', '#e6f7ff')
        : token('components.datePicker.cellHoverBg', '#f0f0f0')};
    color: ${({ isSelected }) =>
      isSelected
        ? token('components.datePicker.cellActiveColor', '#1890ff')
        : token('components.datePicker.cellActiveColor', '#1890ff')};
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
  background-color: ${token('colors.background', '#fff')};
  border: 1px solid
    ${({ error, focused }) => {
      if (error) return token('colors.error', '#ff4d4f')
      if (focused)
        return token('components.input.activeBorderColor', token('colors.primary', '#1890ff'))
      return token('colors.border', '#d9d9d9')
    }};
  border-radius: ${token('components.input.borderRadius', '4px')};
  padding: 4px 11px;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ error, focused, disabled }) => {
      if (disabled) return token('colors.border', '#d9d9d9')
      if (error) return token('colors.error', '#ff4d4f')
      if (focused)
        return token('components.input.activeBorderColor', token('colors.primary', '#1890ff'))
      return token('components.input.hoverBorderColor', token('colors.primary', '#1890ff'))
    }};
  }

  ${({ disabled }) =>
    disabled &&
    `
    background-color: ${token('colors.backgroundSecondary', 'rgba(0, 0, 0, 0.04)')};
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
  color: ${token('colors.text', 'rgba(0, 0, 0, 0.88)')};
  font-size: 14px;
  width: 100%;
  text-align: center;

  &::placeholder {
    color: ${token('colors.textDisabled', 'rgba(0, 0, 0, 0.25)')};
  }

  &:disabled {
    cursor: not-allowed;
  }
`

export const StyledSeparator = styled.span`
  color: ${token('colors.textSecondary', 'rgba(0, 0, 0, 0.45)')};
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
  background-color: ${token('colors.primary', '#1890ff')};
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
  color: ${token('colors.textSecondary', 'rgba(0, 0, 0, 0.45)')};
  margin-left: 8px;
  width: 16px;
  justify-content: center;
  font-size: 14px;
  transition: color 0.2s;

  &:hover {
    color: ${token('colors.text', 'rgba(0, 0, 0, 0.88)')};
  }
`
