import React, { createContext, useContext, useMemo } from 'react'
import { FormStore } from './form-store'
import { FormInstance, InternalHooks, Store } from './types'

const FormContext = createContext<FormInstance<unknown> | null>(null)

export const useFormContext = <Values = unknown,>(): FormInstance<Values> => {
  const context = useContext(FormContext)
  return context as FormInstance<Values>
}

export const useForm = <Values extends Record<string, unknown> = Record<string, unknown>>(
  form?: FormInstance<Values>,
): [FormInstance<Values>] => {
  const [, forceUpdate] = React.useState({})
  const [defaultStore] = React.useState(() => new FormStore(forceUpdate))

  const formInstance = useMemo((): FormInstance<Values> => {
    if (form) {
      return form
    }

    return {
      getFieldValue: (name: string) => defaultStore.getFieldValue(name),
      setFieldValue: (name: string, value: unknown) => defaultStore.setFieldValue(name, value),
      validateFields: (nameList?: string[]) =>
        defaultStore.validateFields(nameList) as Promise<Values>,
      getFieldsValue: () => defaultStore.getFieldsValue() as Values,
      setFieldsValue: (values: Store) => defaultStore.setFieldsValue(values),
      getFieldError: (name: string) => defaultStore.getFieldError(name),
      isFieldsTouched: (nameList?: string[]) => defaultStore.isFieldsTouched(nameList),
      isFieldTouched: (name: string) => defaultStore.isFieldTouched(name),
      isFieldValidating: () => defaultStore.isFieldValidating(),
      resetFields: (fields?: string[]) => defaultStore.resetFields(fields),
      setFields: () => {
        console.warn('setFields not implemented')
      },
      submit: () => defaultStore.submit(),
      getInternalHooks: (secret: string): InternalHooks | null => {
        if (secret === 'COMPASS_FORM_INTERNAL_HOOKS') {
          return {
            registerField: defaultStore.registerField,
            registerWatch: defaultStore.registerWatch,
            setInitialValues: defaultStore.setInitialValues,
            setCallbacks: defaultStore.setCallbacks,
            dispatch: () => {},
            getFieldValue: defaultStore.getFieldValue,
            notifyFieldChange: defaultStore.notifyFieldChange,
          }
        }
        return null
      },
    }
  }, [form, defaultStore])

  return [formInstance]
}

export { FormContext }
