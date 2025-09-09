import { RuleError } from './error'

export interface ValidationResult<T = any> {
  isValid: boolean
  errors: RuleError[]
  data?: T | undefined
}

export function validateRuleOptions<T extends { enabled?: boolean }>(
  options: unknown,
  defaults: T,
): T {
  if (!options || typeof options !== 'object') {
    return defaults
  }

  const validatedOptions = { ...defaults, ...options }
  const optionsObj = options as Record<string, unknown>

  if ('enabled' in optionsObj && typeof optionsObj.enabled === 'boolean') {
    validatedOptions.enabled = optionsObj.enabled
  }

  return validatedOptions
}

export function createValidationResult<T = any>(
  isValid: boolean,
  errors: RuleError[] = [],
  data?: T,
): ValidationResult<T> {
  const result: ValidationResult<T> = {
    isValid,
    errors,
  }
  if (data !== undefined) {
    result.data = data
  }
  return result
}
