import React, {
  cloneElement,
  ReactElement,
  useState,
  useLayoutEffect,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from 'react'
import Schema, { Rules, ValidateError } from 'async-validator'
import { useFormContext } from './form-context'
import { getFormInternalHooks } from './internal-hooks'
import { ItemWrapper, Label, ErrorMessage, MarginOffset } from './form-item.styles'
import { FormItemProps } from './types'
import { defaultGetValueFromEvent, getNamePath } from './utils'

interface FormBindingConfig {
  valuePropName?: string
  changePropName?: string
  getValueFromEvent?: (...args: unknown[]) => unknown
  getControlledValue?: (value: unknown, childProps: Record<string, unknown>) => unknown
}

interface FormAwareElementType {
  __COMPASS_FORM_BINDING__?: FormBindingConfig
}

export const FormItem: React.FC<FormItemProps> = (props) => {
  const {
    name,
    label,
    rules = [],
    children,
    validateTrigger = 'onChange',
    className,
    style,
    help,
  } = props

  const context = useFormContext()
  const { classNames: globalClassNames, styles: globalStyles } = context || {}
  const [errors, setErrors] = useState<string[]>([])
  const [validating, setValidating] = useState(false)
  const errorsRef = useRef(errors)
  const validatingRef = useRef(validating)
  const namePath = useMemo(() => getNamePath(name || []), [name])
  const internalHooks = useMemo(() => getFormInternalHooks(context), [context])

  const updateErrors = useCallback((nextErrors: string[]) => {
    errorsRef.current = nextErrors
    setErrors(nextErrors)
  }, [])

  const updateValidating = useCallback((nextValidating: boolean) => {
    validatingRef.current = nextValidating
    setValidating(nextValidating)
  }, [])

  useEffect(() => {
    if (name && internalHooks) {
      internalHooks.notifyFieldChange(namePath)
    }
  }, [errors, validating, name, namePath, internalHooks])

  // Force update to re-render when store changes
  const [, forceUpdate] = useState({})

  const onStoreChange = useCallback(() => {
    forceUpdate({})
  }, [])

  const validateRules = useCallback(
    async (
      options: { triggerName?: string; validateOnly?: boolean } = {},
    ): Promise<string[] | null> => {
      if (!name || !rules || rules.length === 0) {
        return null
      }

      const value = context?.getFieldValue(namePath)
      const nameStr = namePath.join('.')
      const descriptor: Rules = { [nameStr]: rules }
      const validator = new Schema(descriptor)
      const { validateOnly = false } = options

      if (!validateOnly) {
        updateValidating(true)
      }
      try {
        await validator.validate({ [nameStr]: value }, { suppressWarning: true })
        if (!validateOnly) {
          updateErrors([])
        }
        return null
      } catch (e) {
        if (e && typeof e === 'object' && 'errors' in e) {
          const errorList = (e as { errors: ValidateError[] }).errors.map(
            (err) => err.message || '',
          )
          if (!validateOnly) {
            updateErrors(errorList)
          }
          return errorList
        }
        console.error('[FormItem] Validation error:', e)
        const fallbackErrors = [e instanceof Error ? e.message : String(e)]
        if (!validateOnly) {
          updateErrors(fallbackErrors)
        }
        return fallbackErrors
      } finally {
        if (!validateOnly) {
          updateValidating(false)
        }
      }
    },
    [context, name, namePath, rules, updateErrors, updateValidating],
  )

  const getErrors = useCallback(() => errorsRef.current, [])
  const getNamePathFunc = useCallback(() => namePath, [namePath])
  const isFieldValidating = useCallback(() => validatingRef.current, [])
  const isFieldTouched = useCallback(
    () => (name ? context?.isFieldTouched(namePath) || false : false),
    [name, namePath, context],
  )

  useLayoutEffect(() => {
    if (name && internalHooks) {
      const register = internalHooks.registerField
      const unregister = register?.({
        onStoreChange,
        validateRules,
        getNamePath: getNamePathFunc,
        getErrors,
        isFieldValidating,
        isFieldTouched,
        setErrors: updateErrors,
        props,
      })
      return unregister
    }
  }, [
    name,
    internalHooks,
    onStoreChange,
    validateRules,
    getNamePathFunc,
    getErrors,
    isFieldValidating,
    isFieldTouched,
    updateErrors,
    props,
  ])

  if (!name || !context) {
    return (
      <ItemWrapper
        className={`compass-form-item ${className || ''} ${globalClassNames?.item || ''}`}
        style={{ ...style, ...globalStyles?.item }}
      >
        {label && (
          <Label
            className={`compass-form-item-label ${globalClassNames?.label || ''}`}
            style={globalStyles?.label}
          >
            {label}
          </Label>
        )}
        {children}
      </ItemWrapper>
    )
  }

  const value = context.getFieldValue(namePath)

  // Handle events
  const getControlled = (child: ReactElement) => {
    const mergeProps: Record<string, unknown> = { ...child.props }
    const childType = child.type as FormAwareElementType
    const formBinding = childType.__COMPASS_FORM_BINDING__ || {}
    const valuePropName = formBinding.valuePropName || 'value'
    const changePropName = formBinding.changePropName || 'onChange'

    mergeProps[valuePropName] = formBinding.getControlledValue
      ? formBinding.getControlledValue(value, child.props as Record<string, unknown>)
      : value === undefined
        ? valuePropName === 'checked'
          ? false
          : ''
        : value
    // Pass name to child component for browser password manager recognition
    // Join with dots for string representation
    mergeProps.name = namePath.join('.')

    // Pass validatation status to child component
    if (errors.length > 0) {
      mergeProps.status = 'error'
    }

    const triggers = Array.isArray(validateTrigger) ? validateTrigger : [validateTrigger]
    const originOnChange = mergeProps[changePropName] as ((...args: unknown[]) => void) | undefined

    mergeProps[changePropName] = (...args: unknown[]) => {
      originOnChange?.(...args)

      const newValue = formBinding.getValueFromEvent
        ? formBinding.getValueFromEvent(...args)
        : defaultGetValueFromEvent(valuePropName, ...args)
      context.setFieldValue(namePath, newValue)

      if (triggers.includes('onChange') && rules.length > 0) {
        validateRules({ triggerName: 'onChange' })
      }
    }

    triggers.forEach((trigger) => {
      if (trigger === 'onChange') {
        return
      }

      const originTrigger = mergeProps[trigger] as (...args: unknown[]) => void

      mergeProps[trigger] = (...args: unknown[]) => {
        originTrigger?.(...args)

        if (rules.length > 0) {
          validateRules({ triggerName: trigger })
        }
      }
    })

    return cloneElement(child, mergeProps)
  }

  const errorMessage = help !== undefined ? help : errors.length > 0 ? errors[0] : null
  const hasError = !!errorMessage

  return (
    <ItemWrapper
      className={`compass-form-item ${className || ''} ${globalClassNames?.item || ''}`}
      style={{ ...style, ...globalStyles?.item }}
      hasError={hasError}
    >
      {label && (
        <Label
          className={`compass-form-item-label ${globalClassNames?.label || ''}`}
          style={globalStyles?.label}
        >
          {label}
        </Label>
      )}
      {getControlled(children)}
      {hasError && (
        <>
          <ErrorMessage
            className={`compass-form-item-error-message ${globalClassNames?.error || ''}`}
            style={globalStyles?.error}
          >
            {errorMessage}
          </ErrorMessage>
          <MarginOffset />
        </>
      )}
    </ItemWrapper>
  )
}

FormItem.displayName = 'FormItem'
