import React from 'react'

import { RadioGroupProps, RadioOption, RadioProps } from './types'
import { HiddenInput, RadioControl, RadioDot, RadioGroupRoot, RadioLabel, RadioRoot } from './radio.styles'

interface RadioGroupContextValue {
  value?: string | number
  name?: string
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
  status?: 'error' | 'warning'
  onValueChange?: (
    value: string | number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null)

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>((props, ref) => {
  const {
    value,
    defaultValue,
    name,
    disabled = false,
    size = 'medium',
    status,
    direction = 'vertical',
    children,
    options,
    onChange,
    className,
    style,
    classNames,
    styles,
    ...rest
  } = props
  const isControlled = value !== undefined
  const [innerValue, setInnerValue] = React.useState(defaultValue)
  const currentValue = isControlled ? value : innerValue

  const handleValueChange = React.useCallback(
    (nextValue: string | number, event: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInnerValue(nextValue)
      }
      onChange?.(nextValue, event)
    },
    [isControlled, onChange],
  )

  const contextValue = React.useMemo(
    () => ({
      value: currentValue,
      name,
      disabled,
      size,
      status,
      onValueChange: handleValueChange,
    }),
    [currentValue, name, disabled, size, status, handleValueChange],
  )

  const optionNodes = options?.map((option: RadioOption) => (
    <Radio key={option.value} value={option.value} disabled={option.disabled}>
      {option.label}
    </Radio>
  ))

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <RadioGroupRoot
        {...rest}
        ref={ref}
        role="radiogroup"
        $direction={direction}
        $size={size}
        className={`compass-radio-group compass-radio-group--${size} compass-radio-group--${direction} ${className || ''} ${classNames?.root || ''}`}
        style={{ ...style, ...styles?.root }}
      >
        {options ? optionNodes : children}
      </RadioGroupRoot>
    </RadioGroupContext.Provider>
  )
}) as React.ForwardRefExoticComponent<RadioGroupProps & React.RefAttributes<HTMLDivElement>> & {
  __COMPASS_FORM_BINDING__?: {
    valuePropName: 'value'
    getValueFromEvent: (value: string | number) => string | number
  }
}

RadioGroup.displayName = 'RadioGroup'
RadioGroup.__COMPASS_FORM_BINDING__ = {
  valuePropName: 'value',
  getValueFromEvent: (value) => value,
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>((props, ref) => {
  const {
    children,
    checked,
    defaultChecked,
    value,
    name,
    disabled,
    size = 'medium',
    status,
    onChange,
    className,
    style,
    classNames,
    styles,
    ...rest
  } = props

  const groupContext = React.useContext(RadioGroupContext)
  const isGrouped = Boolean(groupContext)
  const resolvedName = groupContext?.name ?? name
  const resolvedDisabled = groupContext?.disabled || disabled
  const resolvedSize = groupContext?.size ?? size
  const resolvedStatus = groupContext?.status ?? status
  const isControlled = checked !== undefined
  const [innerChecked, setInnerChecked] = React.useState(defaultChecked ?? false)
  const currentChecked = isGrouped
    ? groupContext?.value === value
    : isControlled
      ? checked
      : innerChecked

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (resolvedDisabled) {
      return
    }

    if (isGrouped) {
      groupContext?.onValueChange?.(value ?? event.target.value, event)
    } else if (!isControlled) {
      setInnerChecked(event.target.checked)
    }

    onChange?.(event)
  }

  return (
    <RadioRoot
      $disabled={resolvedDisabled}
      $size={resolvedSize}
      className={`compass-radio compass-radio--${resolvedSize}${resolvedStatus ? ` compass-radio--${resolvedStatus}` : ''} ${className || ''} ${classNames?.root || ''}`}
      style={{ ...style, ...styles?.root }}
    >
      <HiddenInput
        {...rest}
        ref={ref}
        type="radio"
        name={resolvedName}
        value={value}
        checked={Boolean(currentChecked)}
        defaultChecked={defaultChecked}
        disabled={resolvedDisabled}
        aria-invalid={resolvedStatus === 'error' ? 'true' : undefined}
        className={`compass-radio-input ${classNames?.input || ''}`}
        style={styles?.input}
        onChange={handleChange}
      />
      <RadioControl
        $checked={currentChecked}
        $disabled={resolvedDisabled}
        $size={resolvedSize}
        $status={resolvedStatus}
        aria-hidden="true"
        className={`compass-radio-control ${classNames?.control || ''}`}
        style={styles?.control}
      >
        <RadioDot
          $visible={currentChecked}
          $size={resolvedSize}
          aria-hidden="true"
          className={`compass-radio-dot ${classNames?.dot || ''}`}
          style={styles?.dot}
        />
      </RadioControl>
      {children && (
        <RadioLabel
          className={`compass-radio-label ${classNames?.label || ''}`}
          style={styles?.label}
        >
          {children}
        </RadioLabel>
      )}
    </RadioRoot>
  )
}) as React.ForwardRefExoticComponent<RadioProps & React.RefAttributes<HTMLInputElement>> & {
  Group?: typeof RadioGroup
}

Radio.displayName = 'Radio'
Radio.Group = RadioGroup

export default Radio
