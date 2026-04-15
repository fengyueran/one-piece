import React from 'react'

import { CheckIcon } from '../icons'
import { CheckboxProps } from './types'
import {
  CheckboxControl,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
  HiddenInput,
} from './checkbox.styles'

type CheckboxFormBinding = {
  valuePropName: 'checked'
  getValueFromEvent: (event: React.ChangeEvent<HTMLInputElement>) => boolean
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>((props, ref) => {
  const {
    children,
    className,
    style,
    classNames,
    styles,
    size = 'medium',
    status,
    indeterminate = false,
    checked,
    defaultChecked,
    disabled,
    onChange,
    ...rest
  } = props
  const innerRef = React.useRef<HTMLInputElement>(null)

  React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement)

  React.useEffect(() => {
    if (innerRef.current) {
      innerRef.current.indeterminate = indeterminate
    }
  }, [indeterminate, checked])

  const isChecked = checked ?? false
  const isIndicatorVisible = Boolean(isChecked || indeterminate)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const patchedEvent = {
      ...event,
      target: { ...event.target, checked: event.target.checked },
      currentTarget: { ...event.currentTarget, checked: event.currentTarget.checked },
    } as React.ChangeEvent<HTMLInputElement>

    onChange?.(patchedEvent)
  }

  return (
    <CheckboxRoot
      $disabled={disabled}
      $size={size}
      className={`compass-checkbox compass-checkbox--${size}${status ? ` compass-checkbox--${status}` : ''} ${className || ''} ${classNames?.root || ''}`}
      style={{ ...style, ...styles?.root }}
    >
      <HiddenInput
        {...rest}
        ref={innerRef}
        type="checkbox"
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        aria-invalid={status === 'error' ? 'true' : undefined}
        className={`compass-checkbox-input ${classNames?.input || ''}`}
        style={styles?.input}
        onChange={handleChange}
      />
      <CheckboxControl
        $checked={isChecked}
        $disabled={disabled}
        $indeterminate={indeterminate}
        $size={size}
        $status={status}
        aria-hidden="true"
        className={`compass-checkbox-control ${classNames?.control || ''}`}
        style={styles?.control}
      >
        <CheckboxIndicator
          $visible={isIndicatorVisible}
          $indeterminate={indeterminate}
          aria-hidden="true"
          className={`compass-checkbox-indicator ${classNames?.indicator || ''}`}
          style={styles?.indicator}
        >
          <CheckIcon />
        </CheckboxIndicator>
      </CheckboxControl>
      {children && (
        <CheckboxLabel
          className={`compass-checkbox-label ${classNames?.label || ''}`}
          style={styles?.label}
        >
          {children}
        </CheckboxLabel>
      )}
    </CheckboxRoot>
  )
}) as React.ForwardRefExoticComponent<CheckboxProps & React.RefAttributes<HTMLInputElement>> & {
  __COMPASS_FORM_BINDING__?: CheckboxFormBinding
}

Checkbox.displayName = 'Checkbox'
Checkbox.__COMPASS_FORM_BINDING__ = {
  valuePropName: 'checked',
  getValueFromEvent: (event) => event.target.checked,
}

export default Checkbox
