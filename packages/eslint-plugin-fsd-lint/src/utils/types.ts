/**
 * @fileoverview Common type definitions and error handling utilities
 * @author xinghunm
 */

/**
 * Configuration for FSD (Feature-Sliced Design) linting
 */
export interface FsdConfig {
  /**
   * The absolute path of the src directory, e.g.: '/Users/xinghunm/project/apps/web/src'
   * If not configured, it will look for a directory named 'src' by default
   */
  srcRootDir?: string
  /**
   * Optional path aliases mapping. Key should be the alias prefix (e.g. '@/'),
   * value should be an absolute path that the alias points to (e.g. '/abs/project/src/')
   */
  pathAliases?: Record<string, string>
}

export interface BaseRuleOptions {
  /** Whether the rule is enabled */
  enabled?: boolean
}
