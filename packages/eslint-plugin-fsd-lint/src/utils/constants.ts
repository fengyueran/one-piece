// FSD layer definitions, ordered from lowest to highest
export const LAYERS = ['shared', 'entities', 'features', 'widgets', 'pages', 'app'] as const

export const LAYER_WEIGHTS = {
  shared: 1,
  entities: 2,
  features: 3,
  widgets: 4,
  pages: 5,
  app: 6,
} as const

export const LAYERS_REQUIRE_INDEX = ['shared', 'entities', 'features', 'widgets'] as const

export type Layer = (typeof LAYERS)[number]
