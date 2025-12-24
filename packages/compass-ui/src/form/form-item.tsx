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
  } = props

  const context = useFormContext()
  const [errors, setErrors] = useState<string[]>([])
  const errorsRef = useRef(errors)

  useEffect(() => {
    errorsRef.current = errors
  }, [errors])

  // Force update to re-render when store changes
  const [, forceUpdate] = useState({})

  const onStoreChange = useCallback(() => {
    forceUpdate({})
  }, [])

  const validateRules = useCallback(
    async (options: { triggerValue?: unknown } = {}): Promise<string[] | null> => {
      if (!name || !rules || rules.length === 0) {
        return null
      }

      const value = 'triggerValue' in options ? options.triggerValue : context?.getFieldValue(name)
      const descriptor: Rules = { [name]: rules }
      const validator = new Schema(descriptor)

      try {
        await validator.validate({ [name]: value })
        setErrors([])
        return null
      } catch (e) {
        if (e && typeof e === 'object' && 'errors' in e) {
          const errorList = (e as { errors: ValidateError[] }).errors.map(
            (err) => err.message || '',
          )
          setErrors(errorList)
          // Do not reject here: validateRules is also called from event handlers
          // (e.g. onChange). Rejecting would create unhandled promise rejections.
          return errorList
        }
        // If validation fails with other errors (not validation errors), we should probably not swallow them silently
        console.error('[FormItem] Validation error:', e)
        return [e instanceof Error ? e.message : String(e)]
      }
    },
    [context, name, rules],
  )

  const getErrors = useCallback(() => errorsRef.current, [])
  const getName = useCallback(() => name || '', [name])

  useLayoutEffect(() => {
    if (name && context) {
      const register = context.getInternalHooks('COMPASS_FORM_INTERNAL_HOOKS')?.registerField
      const unregister = register?.({
        onStoreChange,
        validateRules,
        getName,
        getErrors,
        props,
      })
      return unregister
    }
  }, [name, context, onStoreChange, validateRules, getName, getErrors, props])

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

    // Controlled value
    if (value !== undefined) {
      mergeProps.value = value
    }

    // Triggers
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
        }

        if (rules.length > 0) {
          validateRules(trigger === 'onChange' ? { triggerValue: newValue } : {})
        }
      }
    })

    return cloneElement(child, mergeProps)
  }

  return (
    <ItemWrapper className={`compass-form-item ${className || ''}`} style={style}>
      {label && <Label>{label}</Label>}
      {getControlled(children)}
      <ErrorMessage>{errors.length > 0 ? errors[0] : '\u00A0'}</ErrorMessage>
    </ItemWrapper>
  )
}
