/**
 * @fileoverview Common utilities for handling import/require statements in ESLint rules
 * @author xinghunm
 */

import { Rule } from 'eslint'
import * as ESTree from 'estree'

export type ImportCheckCallback = (
  node: ESTree.Node,
  importPath: string,
  importType: 'import' | 'require',
) => void

export interface ImportCheckOptions {
  checkImports?: boolean
  checkRequires?: boolean
  enabled?: boolean
}

const DEFAULT_OPTIONS: Required<ImportCheckOptions> = {
  checkImports: true,
  checkRequires: true,
  enabled: true,
}

function isValidRequireCall(node: ESTree.CallExpression): boolean {
  return (
    node.callee.type === 'Identifier' &&
    node.callee.name === 'require' &&
    node.arguments.length === 1 &&
    node.arguments[0].type === 'Literal' &&
    typeof node.arguments[0].value === 'string'
  )
}

/**
 * Extracts import path from require call expression
 */
function getRequireImportPath(node: ESTree.CallExpression): string | null {
  if (!isValidRequireCall(node)) {
    return null
  }
  const arg = node.arguments[0]
  if (arg.type === 'Literal' && typeof arg.value === 'string') {
    return arg.value
  }
  return null
}

/**
 * Creates ESLint rule visitors for handling import/require statements
 * This utility reduces code duplication across multiple rules
 *
 * @param callback - Function to call when an import/require is found
 * @param options - Configuration options for import checking
 * @returns ESLint rule visitors object
 */
export function createImportCheckVisitors(
  callback: ImportCheckCallback,
  options: ImportCheckOptions = {},
): Rule.RuleListener {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  if (!opts.enabled) {
    return {}
  }

  const visitors: Rule.RuleListener = {}

  // Handle ES6 import declarations
  if (opts.checkImports) {
    visitors.ImportDeclaration = (node: ESTree.ImportDeclaration) => {
      const importPath = node.source.value
      if (typeof importPath === 'string') {
        callback(node, importPath, 'import')
      }
    }
  }

  // Handle CommonJS require calls
  if (opts.checkRequires) {
    visitors.CallExpression = (node: ESTree.CallExpression) => {
      const importPath = getRequireImportPath(node)
      if (importPath) {
        callback(node, importPath, 'require')
      }
    }
  }

  return visitors
}
