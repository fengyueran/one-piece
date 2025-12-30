import React, {
  cloneElement,
  ReactElement,
  useState,
  useLayoutEffect,
  useCallback,
  useRef,
  useEffect,
} from 'react'
import Schema, { Rules, RuleItem, ValidateError } from 'async-validator'
import { useFormContext } from './form-context'
import { ItemWrapper, Label, ErrorMessage } from './form-item.styles'

export interface FormItemProps {
  name?: string
  label?: string
  rules?: RuleItem[]
  children: ReactElement
  validateTrigger?: string | string[]
  initialValue?: unknown
  className?: string
  style?: React.CSSProperties
  help?: React.ReactNode
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
  const [errors, setErrors] = useState<string[]>([])
  const [validating, setValidating] = useState(false)
  const errorsRef = useRef(errors)
  const validatingRef = useRef(validating)

  useEffect(() => {
    errorsRef.current = errors
    validatingRef.current = validating
    if (name && context) {
      const hooks = context.getInternalHooks('COMPASS_FORM_INTERNAL_HOOKS')
      hooks?.notifyFieldChange(name)
    }
  }, [errors, validating, name, context])

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
        'triggerName' in options ? context?.getFieldValue(name) : context?.getFieldValue(name)
      const descriptor: Rules = { [name]: rules }
      const validator = new Schema(descriptor)

      setValidating(true)
      try {
        await validator.validate({ [name]: value }, { suppressWarning: true })
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
    [context, name, rules],
  )

  const getErrors = useCallback(() => errorsRef.current, [])
  const getName = useCallback(() => name || '', [name])
  const isFieldValidating = useCallback(() => validatingRef.current, [])
  const isFieldTouched = useCallback(
    () => (name ? context?.isFieldTouched(name) || false : false),
    [name, context],
  )

  useLayoutEffect(() => {
    if (name && context) {
      const register = context.getInternalHooks('COMPASS_FORM_INTERNAL_HOOKS')?.registerField
      const unregister = register?.({
        onStoreChange,
        validateRules,
        getName,
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
    getName,
    getErrors,
    isFieldValidating,
    isFieldTouched,
    props,
  ])

  if (!name || !context) {
    return (
      <ItemWrapper className={`compass-form-item ${className || ''}`} style={style}>
        {label && <Label>{label}</Label>}
        {children}
      </ItemWrapper>
    )
  }

  const value = context.getFieldValue(name)

  // Handle events
  const getControlled = (child: ReactElement) => {
    const mergeProps: Record<string, unknown> = { ...child.props }

    mergeProps.value = value === undefined ? '' : value

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
          context.setFieldValue(name, newValue)

          const hooks = context.getInternalHooks('COMPASS_FORM_INTERNAL_HOOKS')
          hooks?.notifyFieldChange(name)
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
      className={`compass-form-item ${className || ''}`}
      style={style}
      hasError={hasError}
    >
      {label && <Label>{label}</Label>}
      {getControlled(children)}
      {hasError && (
        <ErrorMessage className="compass-form-item-error-message">{errorMessage}</ErrorMessage>
      )}
    </ItemWrapper>
  )
}
