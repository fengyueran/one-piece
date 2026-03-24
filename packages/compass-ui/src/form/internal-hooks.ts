import { FormInstance, InternalHooks } from './types'

export const FORM_INTERNAL_HOOKS = 'COMPASS_FORM_INTERNAL_HOOKS'

export const getFormInternalHooks = (
  form?: Pick<FormInstance, 'getInternalHooks'> | null,
): InternalHooks | null => {
  return form?.getInternalHooks(FORM_INTERNAL_HOOKS) ?? null
}
