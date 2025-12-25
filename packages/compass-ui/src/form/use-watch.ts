import { useState, useEffect, useRef } from 'react'
import { useFormContext } from './form-context'
import { FormInstance } from './types'

export const useWatch = <T = unknown>(name: string | string[], form?: FormInstance): T => {
  const formContext = useFormContext()
  const targetForm = form || formContext

  const getCurrentValue = () => {
    if (targetForm) {
      if (Array.isArray(name)) {
        return name.map((n) => targetForm.getFieldValue(n))
      }
      return targetForm.getFieldValue(name)
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

    const callback = (changedName: string) => {
      let shouldUpdate = false
      if (Array.isArray(name)) {
        if (name.includes(changedName)) {
          shouldUpdate = true
        }
      } else if (name === changedName) {
        shouldUpdate = true
      }

      if (shouldUpdate) {
        const newValue = getCurrentValue()
        setValue(newValue)
      }
    }

    const unregister = hooks.registerWatch(callback)

    // Check if value changed during mount
    const currentValue = getCurrentValue()
    if (JSON.stringify(currentValue) !== JSON.stringify(valueRef.current)) {
      setValue(currentValue)
    }

    return unregister
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetForm, Array.isArray(name) ? name.join(',') : name])

  return value as T
}
