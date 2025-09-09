/**
 * @fileoverview Rule to validate FSD folder structure
 * @author xinghunm
 */

import { existsSync } from 'fs'
import { sep, join } from 'path'
import { Rule } from 'eslint'
import * as ESTree from 'estree'

import { parseFileStructure, ParsedFileStructure } from '../utils/fsd-path'
import { LAYERS, LAYERS_REQUIRE_INDEX } from '../utils/constants'
import { BaseRuleOptions, FsdConfig } from '../utils/types'
import { RuleError, RuleErrorType, createRuleError } from '../utils/error'
import { ValidationResult, createValidationResult, validateRuleOptions } from '../utils/validation'
import { safeSync } from '../utils/safe'

interface FolderStructureOptions extends BaseRuleOptions {
  requirePublicApi?: boolean
  strictLayerStructure?: boolean
}

/**
 * Validates the parsed file structure against FSD rules
 * @param structure - The parsed file structure to validate
 * @returns Validation result with success status and any errors
 */
function validateStructure(structure: ParsedFileStructure): ValidationResult {
  const errors: RuleError[] = []

  if (structure.srcIndex === -1) {
    errors.push(
      createRuleError(RuleErrorType.FOLDER_STRUCTURE, 'File must be under a "src" directory'),
    )
    return createValidationResult(false, errors)
  }

  // Check if this is a file directly in src root directory
  const isRootFile =
    structure.layerIndex === structure.srcIndex + 1 && structure.layer === structure.fileName

  // Skip validation for files directly in src root
  if (isRootFile) {
    return createValidationResult(true, [])
  }

  // Validate layer structure
  if (structure.layer && !LAYERS.includes(structure.layer)) {
    errors.push(
      createRuleError(
        RuleErrorType.FOLDER_STRUCTURE,
        `"${structure.layer || 'undefined'}" is not a valid FSD layer. Must be one of: ${LAYERS.join(', ')}`,
      ),
    )
  }

  return createValidationResult(errors.length === 0, errors)
}

/**
 * Validates the folder structure of a file path
 * @param filePath - The file path to validate
 * @param _options - Rule options (currently unused)
 * @param config - FSD configuration
 * @returns Array of rule errors or null if valid
 */
function validateFolderStructure(
  filePath: string,
  _options: FolderStructureOptions = {},
  config?: FsdConfig,
): RuleError[] | null {
  return safeSync(() => {
    const structure = parseFileStructure(filePath, config)
    const validation = validateStructure(structure)
    return validation.errors.length > 0 ? validation.errors : null
  }, null)
}

/**
 * Check if required index files exist with caching for better performance
 */
function checkRequiredIndexFiles(filePath: string, config?: FsdConfig): RuleError[] | null {
  return safeSync(() => {
    const structure = parseFileStructure(filePath, config)
    const { layer, slice, fullPath, layerIndex } = structure
    const errors: RuleError[] = []
    const indexFiles = ['index.js', 'index.ts']

    if (
      slice &&
      layer &&
      LAYERS_REQUIRE_INDEX.includes(layer as (typeof LAYERS_REQUIRE_INDEX)[number])
    ) {
      const slicePathSegments = fullPath.slice(0, layerIndex + 2)
      const sliceDir = slicePathSegments.join(sep)

      // Use cached file existence check for better performance
      const hasModuleIndex = indexFiles.some((indexFile) => {
        const indexPath = join(sliceDir, indexFile)
        return existsSync(indexPath)
      })

      if (!hasModuleIndex) {
        errors.push(
          createRuleError(
            RuleErrorType.FOLDER_STRUCTURE,
            `Module "${slice}" in layer "${layer}" must have an index file for public API`,
          ),
        )
      }
    }

    return errors.length > 0 ? errors : null
  }, null)
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'validate fsd folder structure',
      category: 'Possible Errors',
      recommended: true,
    },
    messages: {},
    schema: [
      {
        type: 'object',
        properties: {
          requirePublicApi: {
            type: 'boolean',
            default: true,
            description: 'Whether to require public API (index files) for modules',
          },
          strictLayerStructure: {
            type: 'boolean',
            default: true,
            description: 'Whether to enforce strict layer structure rules',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context: Rule.RuleContext) {
    const validatedOptions = validateRuleOptions(context.options[0], {
      enabled: true,
      requirePublicApi: true,
      strictLayerStructure: true,
    } as FolderStructureOptions)

    const filename = context.getFilename()
    const fsdConfig: FsdConfig = context.settings?.['fsd-lint'] || {}

    let hasReported = false

    return {
      Program(node: ESTree.Program) {
        if (hasReported || !validatedOptions.enabled) return
        hasReported = true

        if (validatedOptions.strictLayerStructure) {
          const structureErrors = validateFolderStructure(filename, validatedOptions, fsdConfig)
          if (structureErrors) {
            structureErrors.forEach((error) => {
              context.report({
                node,
                message: `Folder structure violation: ${error.message}`,
              })
            })
          }
        }

        if (validatedOptions.requirePublicApi) {
          const indexErrors = checkRequiredIndexFiles(filename, fsdConfig)
          if (indexErrors) {
            indexErrors.forEach((error) => {
              context.report({
                node,
                message: `Missing required file: ${error.message}`,
              })
            })
          }
        }
      },
    }
  },
}

export default rule
