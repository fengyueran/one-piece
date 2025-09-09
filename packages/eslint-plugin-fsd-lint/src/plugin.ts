import { Rule } from 'eslint'
import layerDependency from './rules/layer-dependency'
import sameLayerIsolation from './rules/same-layer-isolation'
import publicApiOnly from './rules/public-api-only'
import folderStructure from './rules/folder-structure'
import namingConvention from './rules/naming-convention'

interface PluginConfig {
  rules: Record<string, Rule.RuleModule>
  configs: {
    recommended: {
      plugins: string[]
      rules: Record<string, 'error' | 'warn'>
    }
    strict: {
      plugins: string[]
      rules: Record<string, 'error' | 'warn'>
    }
  }
}

const plugin: PluginConfig = {
  rules: {
    'layer-dependency': layerDependency,
    'same-layer-isolation': sameLayerIsolation,
    'public-api-only': publicApiOnly,
    'folder-structure': folderStructure,
    'naming-convention': namingConvention,
  },
  configs: {
    recommended: {
      plugins: ['@xinghunm/fsd-lint'],
      rules: {
        '@xinghunm/fsd-lint/layer-dependency': 'error',
        '@xinghunm/fsd-lint/same-layer-isolation': 'error',
        '@xinghunm/fsd-lint/public-api-only': 'error',
        '@xinghunm/fsd-lint/folder-structure': 'warn',
        '@xinghunm/fsd-lint/naming-convention': 'warn',
      },
    },
    strict: {
      plugins: ['@xinghunm/fsd-lint'],
      rules: {
        '@xinghunm/fsd-lint/layer-dependency': 'error',
        '@xinghunm/fsd-lint/same-layer-isolation': 'error',
        '@xinghunm/fsd-lint/public-api-only': 'error',
        '@xinghunm/fsd-lint/folder-structure': 'error',
        '@xinghunm/fsd-lint/naming-convention': 'error',
      },
    },
  },
}

export default plugin
