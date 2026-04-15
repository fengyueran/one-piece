import React, { useRef, useState } from 'react'

import { CloseCircleIcon, EyeIcon, EyeInvisibleIcon, SearchIcon } from '../icons'
import { Adornment, ClearButton, Container, InputWrapper, StyledInput } from './input.styles'
import { InputProps } from './types'

/**
 * Standard single-line input component.
 *
 * This is the recommended public text entry facade for `compass-ui`.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
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

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true)
    onFocus?.(event)
  }

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false)
    onBlur?.(event)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalValue(event.target.value)
    }
    onChange?.(event)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onPressEnter?.(event)
    }
    onKeyDown?.(event)
  }

  const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    const changeEvent = {
      target: { value: '' },
      currentTarget: { value: '' },
    } as React.ChangeEvent<HTMLInputElement>

    if (!isControlled) {
      setInternalValue('')
    }

    onChange?.(changeEvent)
    innerRef.current?.focus()
  }

  const handleTogglePassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setShowPassword((current) => !current)
    innerRef.current?.focus()
  }

  const showClear = allowClear && !disabled && currentValue && String(currentValue).length > 0
  const inputType = type === 'password' && showPassword ? 'text' : type

  let renderedSuffix = suffix
  if (type === 'password') {
    renderedSuffix = (
      <ClearButton
        type="button"
        visible={true}
        className={`compass-input-clear ${classNames?.clear || ''}`}
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
      className={`compass-input ${className || ''} ${classNames?.root || ''}`}
      style={{ ...style, ...styles?.root }}
    >
      <InputWrapper
        disabled={disabled}
        focused={focused}
        size={size}
        status={status}
        className={`compass-input-wrapper compass-input--${size}${status ? ` compass-input--${status}` : ''}`}
      >
        {prefix && (
          <Adornment
            $position="start"
            className={`compass-input-prefix ${classNames?.prefix || ''}`}
            style={styles?.prefix}
          >
            {prefix}
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
          className={`compass-input-input ${classNames?.input || ''}`}
          style={styles?.input}
          {...rest}
        />
        {allowClear && !disabled && (
          <ClearButton
            type="button"
            className={`compass-input-clear ${classNames?.clear || ''}`}
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
            className={`compass-input-suffix ${classNames?.suffix || ''}`}
            style={styles?.suffix}
          >
            {renderedSuffix}
          </Adornment>
        )}
      </InputWrapper>
    </Container>
  )
})

Input.displayName = 'Input'

export default Input
