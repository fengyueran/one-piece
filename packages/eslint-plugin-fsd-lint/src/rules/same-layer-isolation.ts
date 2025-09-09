/**
 * @fileoverview Rule to enforce isolation between modules within the same FSD layer
 * @author xinghunm
 */

import { Rule } from 'eslint'
import * as ESTree from 'estree'

import { parseFileStructure, parseImportStructure } from '../utils/fsd-path'
import { createImportCheckVisitors } from '../utils/import-checker'
import { FsdConfig } from '../utils/types'

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce isolation between modules in the same fsd layer',
      category: 'Possible Errors',
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
  },

  create(context: Rule.RuleContext) {
    const options = context.options[0] || {}
    const enabled = options.enabled !== false
    const filename = context.getFilename()
    const fsdConfig: FsdConfig = context.settings?.['fsd-lint'] || {}
    const currentInfo = parseFileStructure(filename, fsdConfig)

    /**
     * Checks if the import violates same-layer isolation rules
     * @param node - The AST node of the import/require statement
     * @param importPath - The path being imported
     * @param actionType - Whether it's an import or require statement
     */
    const checkSameLayerIsolation = (node: ESTree.Node, importPath: string) => {
      const isolatedLayers = ['features', 'widgets', 'pages']
      if (!currentInfo.layer || !isolatedLayers.includes(currentInfo.layer)) {
        return
      }

      const { structure: importInfo } = parseImportStructure(importPath, filename, fsdConfig)
      if (!importInfo.layer || !importInfo.slice) {
        return
      }

      if (currentInfo.layer === importInfo.layer && currentInfo.slice !== importInfo.slice) {
        context.report({
          node,
          message: `Module "${currentInfo.slice}" in layer "${currentInfo.layer}" cannot import from sibling module "${importInfo.slice}" in the same layer. Modules in the same layer should be isolated from each other.`,
        })
      }
    }

    return createImportCheckVisitors(checkSameLayerIsolation, { enabled })
  },
}

export default rule
