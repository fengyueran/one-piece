import type { Preview } from '@storybook/react-vite'
import React from 'react'
import { ThemeProvider } from '../src/theme'

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
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

      codePanel: true,
    },
  },
}

export default preview
