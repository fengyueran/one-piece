import React, { useState, useEffect, useRef } from 'react'

import { InputNumberProps } from './types'
import {
  InputWrapper,
  StyledInput,
  Container,
  Label,
  HelperText,
  Adornment,
  StepperWrapper,
  StepperButton,
} from './input-number.styles'

const InputNumber = React.forwardRef<HTMLInputElement, InputNumberProps>((props, ref) => {
  const {
    value,
    defaultValue,
    onChange,
    min,
    max,
    step = 1,
    precision,
    controls = true,
    keyboard = true,
    disabled,
    onBlur,
    onPressEnter,
    onFocus,
    label,
    error,
    helperText,
    prefix,
    suffix,
    size = 'medium',
    fullWidth = false,
    className,
    style,
    ...rest
  } = props

  const innerRef = useRef<HTMLInputElement>(null)
  React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement)

  const [focused, setFocused] = useState(false)

  const isControlled = value !== undefined

  const [internalValue, setInternalValue] = useState<number | null>(
    defaultValue !== undefined && defaultValue !== null ? defaultValue : null,
  )

  const currentValue = isControlled ? (value === undefined ? null : value) : internalValue

  const [inputValue, setInputValue] = useState<string>('')

  const formatValue = React.useCallback(
    (val: number | null): string => {
      if (val === null) return ''
      if (precision !== undefined) {
        return val.toFixed(precision)
      }
      return String(val)
    },
    [precision],
  )

  const parseValue = (text: string): number | null => {
    if (!text.trim()) return null
    const parsed = parseFloat(text)
    return isNaN(parsed) ? null : parsed
  }

  useEffect(() => {
    // Only update display value if not focused to avoid interrupting typing
    const isFocused = innerRef.current && document.activeElement === innerRef.current
    if (!isFocused) {
      const formatted = formatValue(currentValue)
      setInputValue(formatted)
    }
  }, [currentValue, precision, formatValue])

  const getValidValue = (val: number): number => {
    let newVal = val
    if (min !== undefined && newVal < min) newVal = min
    if (max !== undefined && newVal > max) newVal = max
    return newVal
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true)
    onFocus?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let num = parseValue(inputValue)
    if (num !== null) {
      num = getValidValue(num)
    }

    // Update internal/external value with the validated/formatted number
    if (!isControlled) {
      setInternalValue(num)
    }
    onChange?.(num)

    // Explicitly format the display value on blur
    const formatted = formatValue(num)
    setInputValue(formatted)

    onBlur?.(e)

    setFocused(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = e.target.value.trim()
    const reg = /^-?(\d+(\.\d*)?)?$/

    if (reg.test(userInput) || userInput === '' || userInput === '-') {
      // Block negative sign if min >= 0
      if (userInput === '-' && min !== undefined && min >= 0) {
        return
      }

      const num = parseValue(userInput)

      // Block if > max
      if (num !== null && max !== undefined && num > max) {
        return
      }

      setInputValue(userInput)

      if (!isControlled) {
        setInternalValue(num)
      }
      onChange?.(num)
    }
  }

  const handleStep = (direction: 'up' | 'down') => {
    const currentNum = currentValue ?? 0
    const stepValue = direction === 'up' ? step : -step

    let newNum = currentNum + stepValue

    if (precision !== undefined) {
      newNum = parseFloat(newNum.toFixed(precision))
    } else {
      newNum = parseFloat(newNum.toFixed(10))
    }

    newNum = getValidValue(newNum)

    if (!isControlled) {
      setInternalValue(newNum)
    }
    onChange?.(newNum)
    setInputValue(formatValue(newNum))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      let num = parseValue(inputValue)
      if (num !== null) {
        num = getValidValue(num)
      }

      if (!isControlled) {
        setInternalValue(num)
      }
      onChange?.(num)

      setInputValue(formatValue(num))

      onPressEnter?.(e)
    }

    if (keyboard && !disabled) {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        handleStep('up')
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        handleStep('down')
      }
    }
  }

  return (
    <Container fullWidth={fullWidth} className={className} style={style}>
      {label && <Label>{label}</Label>}
      <InputWrapper
        error={!!error}
        disabled={disabled}
        focused={focused}
        size={size}
        controls={controls}
        className={`compass-input-number compass-input-number--${size}`}
      >
        {prefix && <Adornment $position="start">{prefix}</Adornment>}
        <StyledInput
          ref={innerRef}
          type="text"
          role="spinbutton"
          aria-valuenow={currentValue ?? undefined}
          aria-valuemin={min}
          aria-valuemax={max}
          inputMode="decimal"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          $size={size}
          {...rest}
        />
        {suffix && <Adornment $position="end">{suffix}</Adornment>}
        {controls && !disabled && (
          <StepperWrapper size={size}>
            <StepperButton
              type="button"
              disabled={max !== undefined && currentValue !== null && currentValue >= max}
              onClick={() => handleStep('up')}
              onMouseDown={(e) => e.preventDefault()}
              $size={size}
            >
              <svg viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 3l4 4H2z" />
              </svg>
            </StepperButton>
            <StepperButton
              type="button"
              disabled={min !== undefined && currentValue !== null && currentValue <= min}
              onClick={() => handleStep('down')}
              onMouseDown={(e) => e.preventDefault()}
              $size={size}
            >
              <svg viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 9l4-4H2z" />
              </svg>
            </StepperButton>
          </StepperWrapper>
        )}
      </InputWrapper>
      {(helperText || error) && (
        <HelperText error={!!error}>
          {error && typeof error !== 'boolean' ? error : helperText}
        </HelperText>
      )}
    </Container>
  )
})

InputNumber.displayName = 'InputNumber'

export default InputNumber
