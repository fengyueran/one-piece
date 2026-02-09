import { useState, useEffect, useRef, useMemo } from 'react'
import { useFormContext } from './form-context'
import { FormInstance, NamePath, InternalNamePath } from './types'
import { getNamePath, matchNamePath, getValue } from './utils'

export const useWatch = <T = unknown>(name: NamePath, form?: FormInstance): T => {
  const formContext = useFormContext()
  const targetForm = form || formContext

  const namePath = useMemo(() => {
    return getNamePath(name)
  }, [name])

  const getCurrentValue = () => {
    if (targetForm) {
      const values = targetForm.getFieldsValue()
      return getValue(values as unknown as Record<string, unknown>, namePath)
    }
    return undefined
  }

  const [value, setValue] = useState(getCurrentValue)
  const valueRef = useRef(value)
  valueRef.current = value

  useEffect(() => {
    if (!targetForm) return

    const hooks = targetForm.getInternalHooks('COMPASS_FORM_INTERNAL_HOOKS')
    if (!hooks) return

    const callback = (changedNamePath: InternalNamePath) => {
      // Check if changedNamePath affects our watched path
      // If changedNamePath is same as namePath
      // OR if changedNamePath is a parent of namePath (e.g. user changed, we watch user.name)
      // OR if changedNamePath is a child of namePath (e.g. user.name changed, we watch user)

      if (
        matchNamePath(changedNamePath, namePath) ||
        (namePath.length > changedNamePath.length &&
          matchNamePath(namePath.slice(0, changedNamePath.length), changedNamePath)) ||
        (changedNamePath.length > namePath.length &&
          matchNamePath(changedNamePath.slice(0, namePath.length), namePath))
      ) {
        const newValue = targetForm.getFieldValue(namePath)
        setValue(newValue)
      }
    }

    const unregister = hooks.registerWatch(callback)

    // Check if value changed during mount
    const currentValue = targetForm.getFieldValue(namePath)
    if (JSON.stringify(currentValue) !== JSON.stringify(valueRef.current)) {
      setValue(currentValue)
    }

    return unregister
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetForm, namePath.join('.')])

  return value as T
}
