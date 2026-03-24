import { useState, useEffect, useMemo } from 'react'
import { useFormContext } from './form-context'
import { getFormInternalHooks } from './internal-hooks'
import { FormInstance, NamePath, InternalNamePath } from './types'
import { getNamePath, getValue, isRelatedNamePath } from './utils'

export const useWatch = <T = unknown>(name: NamePath, form?: FormInstance): T => {
  const formContext = useFormContext()
  const targetForm = form || formContext
  const internalHooks = useMemo(() => getFormInternalHooks(targetForm), [targetForm])
  const namePathKey = useMemo(() => JSON.stringify(getNamePath(name)), [name])
  const namePath = useMemo(() => JSON.parse(namePathKey) as InternalNamePath, [namePathKey])

  const getCurrentValue = () => {
    if (targetForm) {
      const values = targetForm.getFieldsValue()
      return getValue(values as unknown as Record<string, unknown>, namePath)
    }
    return undefined
  }

  const [value, setValue] = useState(getCurrentValue)

  useEffect(() => {
    if (!targetForm || !internalHooks) return

    const syncValue = () => {
      const nextValue = targetForm.getFieldValue(namePath)
      setValue((prevValue: T | undefined) =>
        Object.is(prevValue, nextValue) ? prevValue : (nextValue as T),
      )
    }

    const callback = (changedNamePath: InternalNamePath) => {
      if (isRelatedNamePath(changedNamePath, namePath)) {
        syncValue()
      }
    }

    const unregister = internalHooks.registerWatch(callback)
    syncValue()

    return unregister
  }, [targetForm, internalHooks, namePath, namePathKey])

  return value as T
}
