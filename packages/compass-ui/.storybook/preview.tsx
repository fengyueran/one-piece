import type { Preview, StoryFn } from '@storybook/react'

import { transformSource } from './source-transform'

const preview: Preview = {
  decorators: [(Story: StoryFn) => <Story />],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,

      source: {
        state: 'open',
        excludeDecorators: true,
        transform: (code: string, storyContext: any) => {
          return transformSource(code, storyContext)
        },
      },

      canvas: {
        sourceState: 'shown',
      },

      codePanel: true,
    },
  },
}

export default preview
