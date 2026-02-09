import { InternalNamePath, NamePath, Store } from './types'

export const getNamePath = (path: NamePath | null): InternalNamePath => {
  if (!path) {
    return []
  }
  return Array.isArray(path) ? path : [path]
}

export const containsNamePath = (nameList: NamePath[], name: NamePath): boolean => {
  const list = nameList.map(getNamePath)
  const path = getNamePath(name)
  return list.some((item) => matchNamePath(item, path))
}

export const matchNamePath = (nameA: InternalNamePath, nameB: InternalNamePath): boolean => {
  if (nameA.length !== nameB.length) {
    return false
  }
  return nameA.every((unit, index) => unit === nameB[index])
}

export const getValue = (store: Store, namePath: InternalNamePath): any => {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  let current: any = store // eslint-disable-line @typescript-eslint/no-explicit-any

  for (let i = 0; i < namePath.length; i++) {
    if (current === undefined || current === null) {
      return undefined
    }
    current = current[namePath[i]]
  }

  return current
}

export const setValue = (
  store: Store,
  namePath: InternalNamePath,
  value: any, // eslint-disable-line @typescript-eslint/no-explicit-any
): Store => {
  const newStore = { ...store }
  let current: any = newStore // eslint-disable-line @typescript-eslint/no-explicit-any

  for (let i = 0; i < namePath.length; i++) {
    const key = namePath[i]
    if (i === namePath.length - 1) {
      current[key] = value
    } else {
      // Ensure path exists and is an object/array
      if (!current[key] || typeof current[key] !== 'object') {
        const nextKey = namePath[i + 1]
        current[key] = typeof nextKey === 'number' ? [] : {}
      }
      // Clone for immutability
      if (Array.isArray(current[key])) {
        current[key] = [...current[key]]
      } else {
        current[key] = { ...current[key] }
      }
      current = current[key]
    }
  }

  return newStore
}

export function defaultGetValueFromEvent(valuePropName: string, ...args: any[]) {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  const event = args[0]
  if (event && event.target && valuePropName in event.target) {
    return (event.target as any)[valuePropName] // eslint-disable-line @typescript-eslint/no-explicit-any
  }
  return event
}
