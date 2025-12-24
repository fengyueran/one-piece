import { Form as InternalForm } from './form'
import { FormItem } from './form-item'
import { useForm } from './form-context'

type InternalFormType = typeof InternalForm

interface FormInterface extends InternalFormType {
  Item: typeof FormItem
  useForm: typeof useForm
}

const Form = InternalForm as FormInterface & {
  Item: typeof FormItem
  useForm: typeof useForm
}

Form.Item = FormItem
Form.useForm = useForm

export type { FormProps } from './form'
export type { FormItemProps } from './form-item'
export type { FormInstance, ValidateErrorEntity, FieldData } from './types'

export default Form
