import React, { useMemo } from 'react'

import { OptionProps } from './types'
import { useSelectContext } from './context'
import { StyledOption } from './select.styles'
import { CheckIcon } from '../icons'

const Option: React.FC<OptionProps> = ({
  id,
  value,
  children,
  disabled,
  className,
  style,
  label,
}) => {
  const {
    value: selectedValue,
    onSelect,
    multiple,
    menuItemSelectedIcon,
    activeValue,
    setActiveValue,
  } = useSelectContext()

  const isSelected = useMemo(() => {
    if (multiple && Array.isArray(selectedValue)) {
      return selectedValue.includes(value)
    }
    return selectedValue === value
  }, [selectedValue, value, multiple])
  const isActive = activeValue === value

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return
    e.preventDefault()
    e.stopPropagation()
    // pass label if available, otherwise children
    const optionLabel = label || children
    onSelect(value, { value, label: optionLabel, disabled })
  }

  return (
    <StyledOption
      id={id}
      className={`compass-select-option ${isSelected ? 'compass-select-option-selected' : ''} ${className || ''}`}
      style={style}
      onClick={handleClick}
      onMouseEnter={() => {
        if (!disabled) {
          setActiveValue(value)
        }
      }}
      selected={isSelected}
      active={isActive}
      disabled={disabled}
      role="option"
      aria-selected={isSelected}
    >
      <span className="compass-select-option-content">{children}</span>
      {isSelected && (menuItemSelectedIcon || <CheckIcon />)}
    </StyledOption>
  )
}

export default Option
