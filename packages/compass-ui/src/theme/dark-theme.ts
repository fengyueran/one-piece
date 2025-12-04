import { Theme } from './types'
import { defaultTheme } from './default-theme'

export const darkTheme: Theme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    primary: '#177ddc', // Darker blue for dark mode or maybe lighter? Usually primary needs to be adjusted for contrast. Ant Design uses #177ddc for dark.
    primaryHover: '#1765ad',
    primaryActive: '#165996',

    text: 'rgba(255, 255, 255, 0.85)',
    textSecondary: 'rgba(255, 255, 255, 0.45)',
    textTertiary: 'rgba(255, 255, 255, 0.25)',
    textDisabled: 'rgba(255, 255, 255, 0.15)',

    background: '#141414',
    backgroundSecondary: '#1f1f1f',
    backgroundTertiary: '#2f2f2f',

    border: '#434343',
    borderSecondary: '#303030',
    borderHover: '#177ddc',

    // Keep other colors same or adjust if needed
    success: '#49aa19',
    warning: '#d89614',
    error: '#a61d24',
    info: '#177ddc',
  },
  shadows: {
    ...defaultTheme.shadows,
    sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 1px 6px rgba(0, 0, 0, 0.3)',
    lg: '0 4px 12px rgba(0, 0, 0, 0.4)',
    xl: '0 8px 24px rgba(0, 0, 0, 0.4)',
  },
  components: {
    ...defaultTheme.components,
    modal: {
      ...defaultTheme.components.modal,
      contentBg: '#1f1f1f',
      boxShadow:
        '0 3px 6px -4px rgba(0, 0, 0, 0.48), 0 6px 16px 0 rgba(0, 0, 0, 0.32), 0 9px 28px 8px rgba(0, 0, 0, 0.2)',
    },
    message: {
      ...defaultTheme.components.message,
      boxShadow:
        '0 3px 6px -4px rgba(0, 0, 0, 0.48), 0 6px 16px 0 rgba(0, 0, 0, 0.32), 0 9px 28px 8px rgba(0, 0, 0, 0.2)',
    },
    progress: {
      ...defaultTheme.components.progress,
      trackColor: '#303030',
    },
    input: {
      ...defaultTheme.components.input,
      activeBorderColor: '#177ddc',
      hoverBorderColor: '#177ddc',
    },
  },
}
