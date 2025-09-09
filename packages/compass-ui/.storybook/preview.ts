import type { Preview } from '@storybook/react'

const preview: Preview = {
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
        type: 'code',
      },
      canvas: {
        sourceState: 'shown',
      },
    },
  },
}

export default preview
