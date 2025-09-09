export async function safeAsync<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    console.warn('FSD Lint: Operation failed safely:', error)
    return fallback
  }
}

export function safeSync<T>(operation: () => T, fallback: T): T {
  try {
    return operation()
  } catch (error) {
    console.warn('FSD Lint: Operation failed safely:', error)
    return fallback
  }
}
