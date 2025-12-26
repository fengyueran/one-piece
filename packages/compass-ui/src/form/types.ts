import { RuleItem } from 'async-validator'

export type InternalNamePath = (string | number)[]
export type NamePath = string | number | InternalNamePath

export type StoreValue = unknown
export type Store = Record<string, StoreValue>

export interface FieldError {
  name: string
  errors: string[]
}

export interface FieldData {
  name: string
  value?: StoreValue
  touched?: boolean
  validating?: boolean
  errors?: string[]
}

export interface Meta {
  touched: boolean
  validating: boolean
  errors: string[]
  name: string
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
  getName: () => string
  getErrors: () => string[]
  isFieldValidating: () => boolean
  isFieldTouched: () => boolean
  props: {
    name?: string
    rules?: RuleItem[]
    dependencies?: string[]
    initialValue?: unknown
  }
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
  errorFields: { name: string; errors: string[] }[]
  outOfDate: boolean
}

// Internal hooks for communication between Form and FormItem
export interface InternalHooks {
  registerField: (entity: FieldEntity) => () => void
  registerWatch: (callback: (name: string) => void) => () => void
  setInitialValues: (values: Store, init: boolean) => void
  setCallbacks: (callbacks: Callbacks) => void
  dispatch: (action: ReducerAction) => void
  getFieldValue: (name: string) => StoreValue
  notifyFieldChange: (name: string) => void
}

export interface FormInstance<Values = Record<string, unknown>> {
  getFieldValue: (name: string) => StoreValue
  getFieldsValue: () => Values
  getFieldError: (name: string) => string[]
  isFieldsTouched: (nameList?: string[]) => boolean
  isFieldTouched: (name: string) => boolean
  isFieldValidating: (name: string) => boolean
  resetFields: (fields?: string[]) => void
  setFields: (fields: FieldData[]) => void
  setFieldValue: (name: string, value: unknown) => void
  setFieldsValue: (values: RecursivePartial<Values>) => void
  validateFields: (nameList?: string[]) => Promise<Values>
  submit: () => void
  getInternalHooks: (secret: string) => InternalHooks | null
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
