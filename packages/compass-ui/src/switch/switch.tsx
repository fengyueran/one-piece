import React from 'react'

import { SwitchProps } from './types'
import {
  HiddenInput,
  SwitchInner,
  SwitchLabel,
  SwitchRoot,
  SwitchThumb,
  SwitchTrack,
} from './switch.styles'

type SwitchFormBinding = {
  valuePropName: 'checked'
  getValueFromEvent: (event: React.ChangeEvent<HTMLInputElement>) => boolean
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>((props, ref) => {
  const {
    checked,
    defaultChecked,
    size = 'medium',
    status,
    disabled,
    children,
    checkedChildren,
    uncheckedChildren,
    onChange,
    onCheckedChange,
    className,
    style,
    classNames,
    styles,
    ...rest
  } = props

  const innerRef = React.useRef<HTMLInputElement>(null)

  React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement)

  const isControlled = checked !== undefined
  const [innerChecked, setInnerChecked] = React.useState(defaultChecked ?? false)
  const currentChecked = isControlled ? checked : innerChecked

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextChecked = event.target.checked
    if (!isControlled) {
      setInnerChecked(nextChecked)
    }
    onChange?.(event)
    onCheckedChange?.(nextChecked, event)
  }

  return (
    <SwitchRoot
      $disabled={disabled}
      $size={size}
      className={`compass-switch compass-switch--${size}${status ? ` compass-switch--${status}` : ''} ${className || ''} ${classNames?.root || ''}`}
      style={{ ...style, ...styles?.root }}
    >
      <HiddenInput
        {...rest}
        ref={innerRef}
        type="checkbox"
        role="switch"
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        aria-checked={currentChecked}
        aria-invalid={status === 'error' ? 'true' : undefined}
        className={`compass-switch-input ${classNames?.input || ''}`}
        style={styles?.input}
        onChange={handleChange}
      />
      <SwitchTrack
        $checked={currentChecked}
        $disabled={disabled}
        $size={size}
        $status={status}
        aria-hidden="true"
        className={`compass-switch-track ${classNames?.track || ''}`}
        style={styles?.track}
      >
        <SwitchInner
          $checked={currentChecked}
          $size={size}
          aria-hidden="true"
          className={`compass-switch-inner ${classNames?.inner || ''}`}
          style={styles?.inner}
        >
          {currentChecked ? checkedChildren : uncheckedChildren}
        </SwitchInner>
        <SwitchThumb
          $checked={currentChecked}
          $size={size}
          aria-hidden="true"
          className={`compass-switch-thumb ${classNames?.thumb || ''}`}
          style={styles?.thumb}
        />
      </SwitchTrack>
      {children && (
        <SwitchLabel
          className={`compass-switch-label ${classNames?.label || ''}`}
          style={styles?.label}
        >
          {children}
        </SwitchLabel>
      )}
    </SwitchRoot>
  )
}) as React.ForwardRefExoticComponent<SwitchProps & React.RefAttributes<HTMLInputElement>> & {
  __COMPASS_FORM_BINDING__?: SwitchFormBinding
}

Switch.displayName = 'Switch'
Switch.__COMPASS_FORM_BINDING__ = {
  valuePropName: 'checked',
  getValueFromEvent: (event) => event.target.checked,
}

export default Switch
