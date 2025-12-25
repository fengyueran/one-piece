import React, { ReactNode, useEffect, useLayoutEffect, useRef } from 'react'
import { FormContext, useForm } from './form-context'
import { FormInstance, Store, ValidateErrorEntity, FieldData } from './types'

export interface FormProps<Values = Record<string, unknown>> {
  form?: FormInstance<Values>
  initialValues?: Store
  children?: ReactNode
  onFinish?: (values: Values) => void
  onFinishFailed?: (errorInfo: ValidateErrorEntity<Values>) => void
  onValuesChange?: (changedValues: Store, values: Values) => void
  onFieldsChange?: (changedFields: FieldData[], allFields: FieldData[]) => void
  className?: string
  style?: React.CSSProperties
}

export const Form = <Values extends Record<string, unknown> = Record<string, unknown>>({
  form,
  initialValues,
  children,
  onFinish,
  onFinishFailed,
  onValuesChange,
  onFieldsChange,
  className,
  style,
}: FormProps<Values>) => {
  const [formInstance] = useForm(form)
  const internalHooks = formInstance.getInternalHooks('COMPASS_FORM_INTERNAL_HOOKS')
  const initialValuesSetRef = useRef(false)

  useLayoutEffect(() => {
    if (!initialValuesSetRef.current && initialValues && internalHooks) {
      internalHooks.setInitialValues(initialValues, true)
      initialValuesSetRef.current = true
    }
  }, [initialValues, internalHooks])

  // Set callbacks
  useEffect(() => {
    if (internalHooks) {
      internalHooks.setCallbacks({
        onFinish: onFinish as (values: unknown) => void,
        onFinishFailed: onFinishFailed as (errorInfo: ValidateErrorEntity<unknown>) => void,
        onValuesChange: onValuesChange as (changedValues: Store, values: unknown) => void,
        onFieldsChange: onFieldsChange,
      })
    }
  }, [onFinish, onFinishFailed, onValuesChange, onFieldsChange, internalHooks])

  return (
    <FormContext.Provider value={formInstance}>
      <form
        className={`compass-form ${className || ''}`}
        style={style}
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          formInstance.submit()
        }}
      >
        {children}
      </form>
    </FormContext.Provider>
  )
}
