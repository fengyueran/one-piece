export enum RuleErrorType {
  LAYER_DEPENDENCY = 'layer-dependency',
  SAME_LAYER_ISOLATION = 'same-layer-isolation',
  PUBLIC_API_VIOLATION = 'public-api-violation',
  FOLDER_STRUCTURE = 'folder-structure',
  NAMING_CONVENTION = 'naming-convention',
}

export interface RuleError {
  type: RuleErrorType
  message: string
  severity: 'error' | 'warning' | 'info'
  fixable?: boolean
  data?: Record<string, any>
}

export function createRuleError(
  type: RuleErrorType,
  message: string,
  severity: 'error' | 'warning' | 'info' = 'error',
  options: Partial<RuleError> = {},
): RuleError {
  return {
    type,
    message,
    severity,
    fixable: false,
    ...options,
  }
}
