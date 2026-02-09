import { RuleItem } from 'async-validator'
import React, { ReactNode, ReactElement } from 'react'

export type InternalNamePath = (string | number)[]
export type NamePath = string | number | InternalNamePath

export type StoreValue = unknown
export type Store = Record<string, StoreValue>

export interface FieldError {
  name: InternalNamePath
  errors: string[]
}

export interface FieldData {
  name: InternalNamePath
  value?: StoreValue
  touched?: boolean
  validating?: boolean
  errors?: string[]
}

export interface Meta {
  touched: boolean
  validating: boolean
  errors: string[]
  name: InternalNamePath
}

export interface InternalFieldData extends Meta {
  value: StoreValue
}

/**
 * Interface for Field Entity (FormItem)
 */
export interface FieldEntity {
  onStoreChange: () => void
  validateRules: (options?: { triggerName?: string }) => Promise<string[] | null>
  getNamePath: () => InternalNamePath
  getErrors: () => string[]
  isFieldValidating: () => boolean
  isFieldTouched: () => boolean
  props: FormItemProps
  setErrors: (errors: string[]) => void
}

export interface Callbacks<Values = Record<string, unknown>> {
  onValuesChange?: (changedValues: Store, values: Values) => void
  onFieldsChange?: (changedFields: FieldData[], allFields: FieldData[]) => void
  onFinish?: (values: Values) => void
  onFinishFailed?: (errorInfo: ValidateErrorEntity<Values>) => void
}

export interface ValidateErrorEntity<Values = Record<string, unknown>> {
  values: Values
  errorFields: { name: InternalNamePath; errors: string[] }[]
  outOfDate: boolean
}

// Internal hooks for communication between Form and FormItem
export interface InternalHooks {
  registerField: (entity: FieldEntity) => () => void
  registerWatch: (callback: (namePath: InternalNamePath) => void) => () => void
  setInitialValues: (values: Store, init: boolean) => void
  setCallbacks: (callbacks: Callbacks) => void
  dispatch: (action: ReducerAction) => void
  getFieldValue: (name: NamePath) => StoreValue
  notifyFieldChange: (name: InternalNamePath) => void
}

export interface FormInstance<Values = Record<string, unknown>> {
  getFieldValue: (name: NamePath) => StoreValue
  getFieldsValue: () => Values
  getFieldError: (name: NamePath) => string[]
  isFieldsTouched: (nameList?: NamePath[]) => boolean
  isFieldTouched: (name: NamePath) => boolean
  isFieldValidating: (name: NamePath) => boolean
  resetFields: (fields?: NamePath[]) => void
  setFields: (fields: FieldData[]) => void
  setFieldValue: (name: NamePath, value: unknown) => void
  setFieldsValue: (values: RecursivePartial<Values>) => void
  validateFields: (nameList?: NamePath[]) => Promise<Values>
  submit: () => void
  getInternalHooks: (secret: string) => InternalHooks | null
}

/**
 * Form properties
 */
export interface FormProps<Values = Record<string, unknown>> {
  /** Form instance */
  form?: FormInstance<Values>
  /** Form layout */
  layout?: 'horizontal' | 'vertical' | 'inline'
  /** Initial values for the form */
  initialValues?: Store
  /** Form items and other content */
  children?: ReactNode
  /** Callback triggered after successfully submitting the form and validation */
  onFinish?: (values: Values) => void
  /** Callback triggered after submitting the form and validation fails */
  onFinishFailed?: (errorInfo: ValidateErrorEntity<Values>) => void
  /** Callback triggered when any field value changes */
  onValuesChange?: (changedValues: Store, values: Values) => void
  /** Callback triggered when any field state changes */
  onFieldsChange?: (changedFields: FieldData[], allFields: FieldData[]) => void
  /** Custom root element class name */
  className?: string
  /** Custom root element style */
  style?: React.CSSProperties
  /** Semantic class names for internal elements */
  classNames?: {
    /** Class name for the form element */
    form?: string
    /** Class name for the form items */
    item?: string
    /** Class name for the labels */
    label?: string
    /** Class name for the error messages */
    error?: string
  }
  /** Semantic styles for internal elements */
  styles?: {
    /** Style for the form element */
    form?: React.CSSProperties
    /** Style for the form items */
    item?: React.CSSProperties
    /** Style for the labels */
    label?: React.CSSProperties
    /** Style for the error messages */
    error?: React.CSSProperties
  }
}

/**
 * Form Item properties
 */
export interface FormItemProps {
  /** Field name */
  name?: NamePath
  /** Label text or node */
  label?: React.ReactNode
  /** Validation rules */
  rules?: RuleItem[]
  /** Field components */
  children: ReactElement
  /** Validation trigger */
  validateTrigger?: string | string[]
  /** Initial value of the field */
  initialValue?: unknown
  /** Custom root element class name */
  className?: string
  /** Custom root element style */
  style?: React.CSSProperties
  /** The prompt message. If not provided, use the validation result. */
  help?: React.ReactNode
  /** Related fields. If any related field changes, this field will be validated. */
  dependencies?: NamePath[]
}

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
      ? RecursivePartial<T[P]>
      : T[P]
}

export interface ReducerAction {
  type: string
  payload: unknown
}
