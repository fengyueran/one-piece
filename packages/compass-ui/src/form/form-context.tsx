import React, { createContext, useContext, useMemo } from 'react'
import { FormStore } from './form-store'
import { FormInstance, InternalHooks, Store, FieldData, NamePath, FormProps } from './types'

const FormContext = createContext<
  | (FormInstance<unknown> & { classNames?: FormProps['classNames']; styles?: FormProps['styles'] })
  | null
>(null)

export const useFormContext = <Values = unknown,>(): FormInstance<Values> & {
  classNames?: FormProps['classNames']
  styles?: FormProps['styles']
} => {
  const context = useContext(FormContext)
  return context as FormInstance<Values> & {
    classNames?: FormProps['classNames']
    styles?: FormProps['styles']
  }
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
      getFieldValue: (name: NamePath) => defaultStore.getFieldValue(name),
      setFieldValue: (name: NamePath, value: unknown) => defaultStore.setFieldValue(name, value),
      validateFields: (nameList?: NamePath[]) =>
        defaultStore.validateFields(nameList) as Promise<Values>,
      getFieldsValue: () => defaultStore.getFieldsValue() as Values,
      setFieldsValue: (values: Store) => defaultStore.setFieldsValue(values),
      getFieldError: (name: NamePath) => defaultStore.getFieldError(name),
      isFieldsTouched: (nameList?: NamePath[]) => defaultStore.isFieldsTouched(nameList),
      isFieldTouched: (name: NamePath) => defaultStore.isFieldTouched(name),
      isFieldValidating: (name: NamePath) => defaultStore.isFieldValidating(name),
      resetFields: (fields?: NamePath[]) => defaultStore.resetFields(fields),
      setFields: (fields: FieldData[]) => defaultStore.setFields(fields),
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
