import React, { useState, useRef } from 'react'

import { InputFieldProps } from './types'
import { Container, InputWrapper, StyledInput, Adornment, ClearButton } from './input-field.styles'

import { CloseCircleIcon, EyeIcon, EyeInvisibleIcon, SearchIcon } from '../icons'

/**
 * InputField component for user input.
 */
const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>((props, ref) => {
  const {
    type = 'text',
    fullWidth = false,
    prefix,
    suffix,
    size = 'medium',
    allowClear,
    className,
    style,
    disabled,
    value,
    defaultValue,
    onChange,
    onFocus,
    onBlur,
    onPressEnter,
    onKeyDown,
    ...rest
  } = props

  const innerRef = useRef<HTMLInputElement>(null)
  React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement)

  const [focused, setFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [internalValue, setInternalValue] = useState(defaultValue || '')
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true)
    onFocus?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false)
    onBlur?.(e)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalValue(e.target.value)
    }
    onChange?.(e)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onPressEnter?.(e)
    }
    onKeyDown?.(e)
  }

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const event = {
      target: { value: '' },
      currentTarget: { value: '' },
    } as React.ChangeEvent<HTMLInputElement>

    if (!isControlled) {
      setInternalValue('')
    }

    onChange?.(event)

    // Focus back to input after clear
    innerRef.current?.focus()
  }

  const handleTogglePassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setShowPassword(!showPassword)
    // Keep focus on input
    innerRef.current?.focus()
  }

  const showClear = allowClear && !disabled && currentValue && String(currentValue).length > 0
  const inputType = type === 'password' && showPassword ? 'text' : type

  // Determine prefix
  const renderedPrefix = prefix

  // Determine suffix
  let renderedSuffix = suffix
  if (type === 'password') {
    renderedSuffix = (
      <ClearButton
        type="button"
        visible={true}
        onClick={handleTogglePassword}
        tabIndex={-1}
        style={{ marginLeft: 8 }}
      >
        {showPassword ? <EyeIcon /> : <EyeInvisibleIcon />}
      </ClearButton>
    )
  } else if (type === 'search' && !suffix) {
    renderedSuffix = <SearchIcon />
  }

  return (
    <Container fullWidth={fullWidth} className={className} style={style}>
      <InputWrapper
        disabled={disabled}
        focused={focused}
        size={size}
        className={`compass-input-field compass-input-field--${size}`}
      >
        {renderedPrefix && <Adornment $position="start">{renderedPrefix}</Adornment>}
        <StyledInput
          ref={innerRef}
          type={inputType}
          disabled={disabled}
          value={currentValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          $size={size}
          {...rest}
        />
        {allowClear && !disabled && (
          <ClearButton
            type="button"
            className="compass-input-clear-button"
            visible={!!showClear}
            $isHoverShow={true}
            data-visible={!!showClear}
            onClick={handleClear}
            tabIndex={-1}
          >
            <CloseCircleIcon />
          </ClearButton>
        )}
        {renderedSuffix && <Adornment $position="end">{renderedSuffix}</Adornment>}
      </InputWrapper>
    </Container>
  )
})

InputField.displayName = 'InputField'

export default InputField
