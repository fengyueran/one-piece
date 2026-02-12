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
    status,
    classNames,
    styles,
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
        className={`compass-input-field-clear ${classNames?.clear || ''}`}
        style={{ marginLeft: 8, ...styles?.clear }}
        onClick={handleTogglePassword}
        tabIndex={-1}
      >
        {showPassword ? <EyeIcon /> : <EyeInvisibleIcon />}
      </ClearButton>
    )
  } else if (type === 'search' && !suffix) {
    renderedSuffix = <SearchIcon />
  }

  return (
    <Container
      fullWidth={fullWidth}
      className={`compass-input-field ${className || ''} ${classNames?.root || ''}`}
      style={{ ...style, ...styles?.root }}
    >
      <InputWrapper
        disabled={disabled}
        focused={focused}
        size={size}
        status={status}
        className={`compass-input-field-wrapper compass-input-field--${size}${status ? ` compass-input-field--${status}` : ''}`}
      >
        {renderedPrefix && (
          <Adornment
            $position="start"
            className={`compass-input-field-prefix ${classNames?.prefix || ''}`}
            style={styles?.prefix}
          >
            {renderedPrefix}
          </Adornment>
        )}
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
          className={`compass-input-field-input ${classNames?.input || ''}`}
          style={styles?.input}
          {...rest}
        />
        {allowClear && !disabled && (
          <ClearButton
            type="button"
            className={`compass-input-field-clear ${classNames?.clear || ''}`}
            style={styles?.clear}
            visible={!!showClear}
            $isHoverShow={true}
            data-visible={!!showClear}
            onClick={handleClear}
            tabIndex={-1}
          >
            <CloseCircleIcon />
          </ClearButton>
        )}
        {renderedSuffix && (
          <Adornment
            $position="end"
            className={`compass-input-field-suffix ${classNames?.suffix || ''}`}
            style={styles?.suffix}
          >
            {renderedSuffix}
          </Adornment>
        )}
      </InputWrapper>
    </Container>
  )
})

InputField.displayName = 'InputField'

export default InputField
