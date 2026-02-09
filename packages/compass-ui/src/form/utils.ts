import { InternalNamePath, NamePath, Store, StoreValue } from './types'

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

export const getValue = (store: Store, namePath: InternalNamePath): StoreValue => {
  let current: StoreValue = store

  for (let i = 0; i < namePath.length; i++) {
    if (current === undefined || current === null) {
      return undefined
    }
    current = (current as Record<string | number, StoreValue>)[namePath[i]]
  }

  return current
}

export const setValue = (store: Store, namePath: InternalNamePath, value: StoreValue): Store => {
  const newStore = { ...store }
  let current: StoreValue = newStore

  for (let i = 0; i < namePath.length; i++) {
    const key = namePath[i]
    const currentRecord = current as Record<string | number, StoreValue>

    if (i === namePath.length - 1) {
      currentRecord[key] = value
    } else {
      // Ensure path exists and is an object/array
      if (!currentRecord[key] || typeof currentRecord[key] !== 'object') {
        const nextKey = namePath[i + 1]
        currentRecord[key] = typeof nextKey === 'number' ? [] : {}
      }
      // Clone for immutability
      if (Array.isArray(currentRecord[key])) {
        currentRecord[key] = [...(currentRecord[key] as StoreValue[])]
      } else {
        currentRecord[key] = { ...(currentRecord[key] as Record<string, StoreValue>) }
      }
      current = currentRecord[key]
    }
  }

  return newStore
}

export function defaultGetValueFromEvent(valuePropName: string, ...args: unknown[]) {
  const event = args[0]
  if (
    event &&
    typeof event === 'object' &&
    'target' in event &&
    event.target &&
    typeof event.target === 'object' &&
    valuePropName in event.target
  ) {
    return (event.target as Record<string, unknown>)[valuePropName]
  }
  return event
}
