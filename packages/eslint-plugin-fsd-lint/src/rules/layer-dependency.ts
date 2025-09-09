/**
 * @fileoverview Rule to enforce FSD layer dependency constraints
 * @author xinghunm
 */

import { Rule } from 'eslint'
import * as ESTree from 'estree'

import { parseFileStructure, parseImportStructure } from '../utils/fsd-path'
import { createImportCheckVisitors } from '../utils/import-checker'
import { FsdConfig } from '../utils/types'

/**
 * FSD layer definitions with hierarchy levels
 * Lower numbers indicate lower layers in the dependency hierarchy
 */
const LAYERS = {
  shared: 1,
  entities: 2,
  features: 3,
  widgets: 4,
  pages: 5,
  app: 6,
} as const

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce fsd layer dependency constraints',
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
    const layers = { ...LAYERS, ...options.layers }
    const filename = context.getFilename()
    const fsdConfig: FsdConfig = context.settings?.['fsd-lint'] || {}

    /**
     * Checks if the import violates layer dependency constraints
     * @param node - The AST node of the import/require statement
     * @param importPath - The path being imported
     * @param actionType - Whether it's an import or require statement
     */
    const checkLayerDependency = (
      node: ESTree.Node,
      importPath: string,
      actionType: 'import' | 'require',
    ) => {
      const currentLayer = parseFileStructure(filename, fsdConfig).layer
      if (!currentLayer) {
        return
      }

      const { structure: importStructure } = parseImportStructure(importPath, filename, fsdConfig)
      const importLayer = importStructure.layer
      if (!importLayer) {
        return
      }

      const currentLayerLevel = layers[currentLayer]
      const importLayerLevel = layers[importLayer]

      if (currentLayerLevel < importLayerLevel) {
        context.report({
          node,
          message: `Layer "${currentLayer}" (level ${currentLayerLevel}) cannot ${actionType} from higher layer "${importLayer}" (level ${importLayerLevel}). Lower layers should not depend on higher layers.`,
        })
      }
    }

    return createImportCheckVisitors(checkLayerDependency, { enabled })
  },
}

export default rule
