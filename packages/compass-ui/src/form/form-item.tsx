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
import { ItemWrapper, Label, ErrorMessage, MarginOffset } from './form-item.styles'
import { FormItemProps } from './types'
import { getNamePath } from './utils'

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

  useEffect(() => {
    errorsRef.current = errors
    validatingRef.current = validating
    if (name && context) {
      const hooks = context.getInternalHooks('COMPASS_FORM_INTERNAL_HOOKS')
      hooks?.notifyFieldChange(namePath)
    }
  }, [errors, validating, name, namePath, context])

  // Force update to re-render when store changes
  const [, forceUpdate] = useState({})

  const onStoreChange = useCallback(() => {
    forceUpdate({})
  }, [])

  const validateRules = useCallback(
    async (options: { triggerName?: string } = {}): Promise<string[] | null> => {
      if (!name || !rules || rules.length === 0) {
        return null
      }

      const value =
        'triggerName' in options
          ? context?.getFieldValue(namePath)
          : context?.getFieldValue(namePath)

      const nameStr = namePath.join('.')
      const descriptor: Rules = { [nameStr]: rules }
      const validator = new Schema(descriptor)

      setValidating(true)
      try {
        await validator.validate({ [nameStr]: value }, { suppressWarning: true })
        setErrors([])
        return null
      } catch (e) {
        if (e && typeof e === 'object' && 'errors' in e) {
          const errorList = (e as { errors: ValidateError[] }).errors.map(
            (err) => err.message || '',
          )
          setErrors(errorList)
          return errorList
        }
        console.error('[FormItem] Validation error:', e)
        return [e instanceof Error ? e.message : String(e)]
      } finally {
        setValidating(false)
      }
    },
    [context, name, namePath, rules],
  )

  const getErrors = useCallback(() => errorsRef.current, [])
  const getNamePathFunc = useCallback(() => namePath, [namePath])
  const isFieldValidating = useCallback(() => validatingRef.current, [])
  const isFieldTouched = useCallback(
    () => (name ? context?.isFieldTouched(namePath) || false : false),
    [name, namePath, context],
  )

  useLayoutEffect(() => {
    if (name && context) {
      const register = context.getInternalHooks('COMPASS_FORM_INTERNAL_HOOKS')?.registerField
      const unregister = register?.({
        onStoreChange,
        validateRules,
        getNamePath: getNamePathFunc,
        getErrors,
        isFieldValidating,
        isFieldTouched,
        setErrors: (newErrors: string[]) => setErrors(newErrors),
        props,
      })
      return unregister
    }
  }, [
    name,
    context,
    onStoreChange,
    validateRules,
    getNamePathFunc,
    getErrors,
    isFieldValidating,
    isFieldTouched,
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

    mergeProps.value = value === undefined ? '' : value
    // Pass name to child component for browser password manager recognition
    // Join with dots for string representation
    mergeProps.name = namePath.join('.')

    // Pass validatation status to child component
    if (errors.length > 0) {
      mergeProps.status = 'error'
    }

    const triggers = Array.isArray(validateTrigger) ? validateTrigger : [validateTrigger]

    triggers.forEach((trigger) => {
      const originTrigger = mergeProps[trigger] as (...args: unknown[]) => void

      mergeProps[trigger] = (...args: unknown[]) => {
        originTrigger?.(...args)

        let newValue: unknown

        if (trigger === 'onChange') {
          const event = args[0]
          let val = event
          if (
            event &&
            typeof event === 'object' &&
            (event as { target?: { value?: unknown } }).target
          ) {
            val = (event as { target: { value: unknown } }).target.value
          }

          newValue = val
          context.setFieldValue(namePath, newValue)

          const hooks = context.getInternalHooks('COMPASS_FORM_INTERNAL_HOOKS')
          hooks?.notifyFieldChange(namePath)
        }

        if (rules.length > 0) {
          validateRules(trigger === 'onChange' ? { triggerName: 'onChange' } : {})
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
