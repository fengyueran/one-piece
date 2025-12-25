import { Form as InternalForm } from './form'
import { FormItem } from './form-item'
import { useForm } from './form-context'
import { useWatch } from './use-watch'

type InternalFormType = typeof InternalForm

interface FormInterface extends InternalFormType {
  Item: typeof FormItem
  useForm: typeof useForm
  useWatch: typeof useWatch
}

const Form = InternalForm as FormInterface & {
  Item: typeof FormItem
  useForm: typeof useForm
  useWatch: typeof useWatch
}

Form.Item = FormItem
Form.useForm = useForm
Form.useWatch = useWatch

export type { FormProps } from './form'
export type { FormItemProps } from './form-item'
export type { FormInstance, ValidateErrorEntity, FieldData } from './types'

export default Form
