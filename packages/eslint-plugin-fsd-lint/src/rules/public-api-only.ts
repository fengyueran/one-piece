/**
 * @fileoverview Rule to enforce the use of Public APIs (index files)
 * @author xinghunm
 */

import { resolve, dirname, join, sep, relative, parse } from 'path'
import { Rule } from 'eslint'
import * as ESTree from 'estree'

import { parseFileStructure, parseImportStructure } from '../utils/fsd-path'
import { createImportCheckVisitors } from '../utils/import-checker'
import { FsdConfig } from '../utils/types'

/** Convert a file path to POSIX-style (for import specifiers) */
function toPosix(p: string): string {
  return p.split('\\').join('/')
}

/**
 * Checks if an import violates the public API rule
 * @param importPath - The path being imported
 * @param currentFilePath - The current file making the import
 * @param config - FSD configuration
 * @returns Violation details or null if no violation
 */
function checkPublicApiViolation(importPath: string, currentFilePath: string, config?: FsdConfig) {
  const currentFileStructure = parseFileStructure(currentFilePath, config)

  const currentDir = dirname(currentFilePath)

  // Resolve import using unified helper (alias + srcRoot aware)
  const { resolution, structure: importFileStructure } = parseImportStructure(
    importPath,
    currentFilePath,
    config,
  )

  if (!importFileStructure.layer || !importFileStructure.slice) {
    return null
  }

  if (
    (currentFileStructure.layer === 'app' && importFileStructure.layer === 'app') ||
    (currentFileStructure.layer === 'shared' && importFileStructure.layer === 'shared')
  ) {
    return null
  }

  if (
    currentFileStructure.layer === importFileStructure.layer &&
    currentFileStructure.slice === importFileStructure.slice
  ) {
    return null
  }

  // Check if this is a direct import of an internal file (not via index)
  const importPathSegments = resolution.resolvedAbs.split(sep)
  const fileName = importPathSegments[importPathSegments.length - 1]

  if (!fileName.match(/^index(\.js|\.ts|\.jsx|\.tsx)?$/) && importFileStructure.layerIndex >= 0) {
    const layerSegmentIndex = importFileStructure.layerIndex
    const sliceSegmentIndex = layerSegmentIndex + 1

    if (sliceSegmentIndex + 1 < importPathSegments.length) {
      const internalPathSegments = importPathSegments.slice(sliceSegmentIndex + 1)
      const suggestedPathSegments = importPathSegments.slice(0, sliceSegmentIndex + 1)

      // Build absolute target for public API entry (preserve drive/root)
      const root = parse(resolution.resolvedAbs).root
      const suggestedAbs = root
        ? join(root, ...suggestedPathSegments.filter(Boolean))
        : join(...suggestedPathSegments)

      // Build suggestion string in the same style as original import
      let suggestedImportPath: string
      let canFix = true

      if (resolution.kind === 'relative') {
        const relToCurrent = relative(currentDir, suggestedAbs)
        let posixRel = toPosix(relToCurrent)
        if (!posixRel.startsWith('.')) posixRel = './' + posixRel
        suggestedImportPath = posixRel
      } else if (resolution.kind === 'alias' || resolution.kind === 'atAlias') {
        const aliasTargetAbs = resolution.aliasTargetAbs
        const aliasPrefix = resolution.aliasPrefix
        if (!aliasTargetAbs || !aliasPrefix) {
          canFix = false
          suggestedImportPath = toPosix(suggestedAbs)
        } else {
          // Ensure both paths are normalized
          const normalizedAliasTarget = resolve(aliasTargetAbs)
          const normalizedSuggested = resolve(suggestedAbs)

          // Check if suggested path is within alias target directory
          if (normalizedSuggested.startsWith(normalizedAliasTarget)) {
            // Calculate relative path from alias target to suggested path
            const relFromAliasTarget = normalizedSuggested.substring(normalizedAliasTarget.length)
            // Remove leading separator if present
            const cleanRel = relFromAliasTarget.startsWith(sep)
              ? relFromAliasTarget.substring(1)
              : relFromAliasTarget
            const layerSlicePath = toPosix(cleanRel)

            // Check if alias already includes the layer (e.g., @shared/ vs @/)
            const aliasWithoutSlash = aliasPrefix.endsWith('/')
              ? aliasPrefix.slice(0, -1)
              : aliasPrefix
            const pathSegments = layerSlicePath.split('/')
            const layerName = pathSegments[0]

            if (aliasWithoutSlash.endsWith(layerName)) {
              // Alias already includes layer (e.g., @shared/), only add slice
              const slicePart = pathSegments.slice(1).join('/')
              suggestedImportPath = `${aliasPrefix}${slicePart}`
            } else {
              // Alias is generic (e.g., @/), add full layer/slice path
              suggestedImportPath = `${aliasPrefix}${layerSlicePath}`
            }
          } else {
            // suggestedAbs is outside alias scope, fallback to relative path
            canFix = false
            const relToCurrent = relative(currentDir, normalizedSuggested)
            let posixRel = toPosix(relToCurrent)
            if (!posixRel.startsWith('.')) posixRel = './' + posixRel
            suggestedImportPath = posixRel
          }
        }
      } else {
        // bare import: keep bare module style suggestion like "entities/user"
        suggestedImportPath = `${importFileStructure.layer}/${importFileStructure.slice}`
      }

      return {
        layer: importFileStructure.layer,
        module: importFileStructure.slice,
        internalPath: join(...internalPathSegments),
        suggestedPath: suggestedImportPath,
        canFix,
      }
    }
  }

  return null
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce usage of Public API only (index files)',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          enabled: {
            type: 'boolean',
            default: true,
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context: Rule.RuleContext) {
    const options = context.options[0] || {}
    const enabled = options.enabled !== false
    const filename = context.filename
    const fsdConfig: FsdConfig = context.settings?.['fsd-lint'] || {}

    /**
     * Checks if the import violates public API constraints and provides auto-fix
     * @param node - The AST node of the import statement
     * @param importPath - The path being imported
     */
    const checkPublicApiImport = (node: ESTree.Node, importPath: string) => {
      const violation = checkPublicApiViolation(importPath, filename, fsdConfig)

      if (violation) {
        context.report({
          node,
          message: `Direct import from "${violation.internalPath}" in module "${violation.module}" is not allowed. Use the public API instead: "${violation.suggestedPath}".`,
          fix(fixer: any) {
            if (!violation.canFix) return null
            if (node.type === 'ImportDeclaration') {
              return fixer.replaceTextRange(
                [node.source.range![0] + 1, node.source.range![1] - 1],
                violation.suggestedPath,
              )
            }
            if (node.type === 'CallExpression' && node.arguments.length > 0) {
              const arg = node.arguments[0]
              if (arg.type === 'Literal' && typeof arg.value === 'string' && arg.range) {
                return fixer.replaceTextRange(
                  [arg.range[0] + 1, arg.range[1] - 1],
                  violation.suggestedPath,
                )
              }
              return null
            }
            return null
          },
        })
      }
    }

    return createImportCheckVisitors(checkPublicApiImport, { enabled })
  },
}

export default rule
