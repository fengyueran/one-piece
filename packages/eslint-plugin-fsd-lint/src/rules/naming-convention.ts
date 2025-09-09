/**
 * @fileoverview Rule to enforce kebab-case naming conventions for files and directories
 * @author xinghunm
 */

import { basename, extname } from 'path'
import { Rule } from 'eslint'
import * as ESTree from 'estree'

import { BaseRuleOptions, FsdConfig } from '../utils/types'
import { validateRuleOptions } from '../utils/validation'
import { safeSync } from '../utils/safe'
import { isNonEmptyString } from '../utils/string'
import { parseFileStructure } from '../utils/fsd-path'

/**
 * Regular expression pattern for kebab-case validation
 */
const KEBAB_CASE_PATTERN = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/

function isKebabCase(name: string): boolean {
  return isNonEmptyString(name) && KEBAB_CASE_PATTERN.test(name)
}

/**
 * Validates if a file name follows the kebab-case naming convention
 * @param fileName - The file name to validate
 * @returns The invalid file name or null if valid
 */
function validateFileName(fileName: string): string | null {
  return safeSync(() => {
    if (!isNonEmptyString(fileName) || fileName.startsWith('index.')) {
      return null
    }

    const ext = extname(fileName)
    const baseName = basename(fileName, ext)

    // Handle compound extensions (e.g., .test.js, .spec.ts, .d.ts, etc.)
    const nameParts = baseName.split('.')
    const mainName = nameParts[0]

    if (!isKebabCase(mainName)) {
      return fileName
    }

    return null
  }, null)
}

/**
 * Validates if directory names in a file path follow kebab-case convention
 * @param filePath - The file path to validate
 * @returns Array of invalid directory names
 */
function validateDirectoryNames(filePath: string, config?: FsdConfig): string[] {
  return safeSync(() => {
    if (!isNonEmptyString(filePath)) {
      return []
    }

    const errors: string[] = []

    const structure = parseFileStructure(filePath, config)
    if (structure.srcIndex === -1) {
      // Only validate paths under "src"; skip otherwise
      return []
    }

    const pathParts = structure.fullPath
      .slice(structure.srcIndex)
      .filter((part) => part && part !== '.')

    for (const part of pathParts) {
      if (part.includes('.')) {
        continue
      }

      if (!isKebabCase(part)) {
        errors.push(part)
      }
    }

    return errors
  }, [])
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce kebab-case naming conventions for files and directories',
      category: 'Stylistic Issues',
      recommended: true,
    },
    fixable: undefined,
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
    messages: {
      invalidFile: 'File "{{name}}" should use kebab-case naming convention',
      invalidDir: 'Directory "{{name}}" should use kebab-case naming convention',
    },
  },

  create(context: Rule.RuleContext) {
    const filename = context.getFilename()
    const validatedOptions = validateRuleOptions(context.options[0], {
      enabled: true,
    } as BaseRuleOptions)

    const fsdConfig: FsdConfig = context.settings?.['fsd-lint'] || {}

    let hasReported = false

    return {
      Program(node: ESTree.Program) {
        if (hasReported || !validatedOptions.enabled) return
        hasReported = true

        const fileName = basename(filename)
        const invalidFile = validateFileName(fileName)
        if (invalidFile) {
          context.report({
            node,
            messageId: 'invalidFile',
            data: { name: invalidFile },
          })
        }

        const invalidDirs = validateDirectoryNames(filename, fsdConfig)
        invalidDirs.forEach((dir) => {
          context.report({
            node,
            messageId: 'invalidDir',
            data: { name: dir },
          })
        })
      },
    }
  },
}

export default rule
