import React, { useRef, useState } from 'react'

import { CloseCircleIcon } from '../icons'
import {
  Adornment,
  ClearButton,
  Container,
  StyledTextarea,
  TextareaWrapper,
} from './textarea.styles'
import { TextareaProps } from './types'

/**
 * Standard multi-line text input component.
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => {
  const {
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
    rows = 4,
    ...rest
  } = props

  const innerRef = useRef<HTMLTextAreaElement>(null)
  React.useImperativeHandle(ref, () => innerRef.current as HTMLTextAreaElement)

  const [focused, setFocused] = useState(false)
  const [internalValue, setInternalValue] = useState(defaultValue || '')
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  const handleFocus = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    setFocused(true)
    onFocus?.(event)
  }

  const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    setFocused(false)
    onBlur?.(event)
  }

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isControlled) {
      setInternalValue(event.target.value)
    }
    onChange?.(event)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
    } as React.ChangeEvent<HTMLTextAreaElement>

    if (!isControlled) {
      setInternalValue('')
    }

    onChange?.(changeEvent)
    innerRef.current?.focus()
  }

  const showClear = allowClear && !disabled && currentValue && String(currentValue).length > 0

  return (
    <Container
      fullWidth={fullWidth}
      className={`compass-textarea ${className || ''} ${classNames?.root || ''}`}
      style={{ ...style, ...styles?.root }}
    >
      <TextareaWrapper
        disabled={disabled}
        focused={focused}
        size={size}
        status={status}
        className={`compass-textarea-wrapper compass-textarea--${size}${status ? ` compass-textarea--${status}` : ''}`}
      >
        {prefix && (
          <Adornment
            $position="start"
            className={`compass-textarea-prefix ${classNames?.prefix || ''}`}
            style={styles?.prefix}
          >
            {prefix}
          </Adornment>
        )}
        <StyledTextarea
          ref={innerRef}
          disabled={disabled}
          value={currentValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          rows={rows}
          $size={size}
          className={`compass-textarea-input ${classNames?.textarea || ''}`}
          style={styles?.textarea}
          {...rest}
        />
        {allowClear && !disabled && (
          <ClearButton
            type="button"
            className={`compass-textarea-clear ${classNames?.clear || ''}`}
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
        {suffix && (
          <Adornment
            $position="end"
            className={`compass-textarea-suffix ${classNames?.suffix || ''}`}
            style={styles?.suffix}
          >
            {suffix}
          </Adornment>
        )}
      </TextareaWrapper>
    </Container>
  )
})

Textarea.displayName = 'Textarea'

export default Textarea
