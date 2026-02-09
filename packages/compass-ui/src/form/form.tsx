import React, { useEffect, useLayoutEffect, useRef } from 'react'
import { FormContext, useForm } from './form-context'
import { FormProps, Store, ValidateErrorEntity } from './types'
import { StyledForm } from './form.styles'

export const Form = React.forwardRef<HTMLFormElement, FormProps<Record<string, unknown>>>(
  (
    {
      form,
      layout = 'vertical',
      initialValues,
      children,
      onFinish,
      onFinishFailed,
      onValuesChange,
      onFieldsChange,
      className,
      style,
      classNames,
      styles,
    },
    ref,
  ) => {
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
      <FormContext.Provider value={{ ...formInstance, classNames, styles }}>
        <StyledForm
          ref={ref}
          className={`compass-form compass-form--${layout} ${className || ''} ${classNames?.form || ''}`}
          style={{ ...style, ...styles?.form }}
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            formInstance.submit()
          }}
        >
          {children}
        </StyledForm>
      </FormContext.Provider>
    )
  },
)

Form.displayName = 'Form'
