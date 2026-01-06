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
    backgroundHover: '#262626',

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
    steps: {
      ...defaultTheme.components.steps,
      descriptionColor: 'rgba(255, 255, 255, 0.45)',
      titleColor: 'rgba(255, 255, 255, 0.65)',
      subTitleColor: 'rgba(255, 255, 255, 0.45)',
      waitIconColor: 'rgba(255, 255, 255, 0.25)',
      processIconColor: '#177ddc',
      finishIconColor: '#177ddc',
      errorIconColor: '#a61d24',
      waitTitleColor: 'rgba(255, 255, 255, 0.45)',
      processTitleColor: 'rgba(255, 255, 255, 0.85)',
      finishTitleColor: 'rgba(255, 255, 255, 0.65)',
      errorTitleColor: '#a61d24',
      waitDescriptionColor: 'rgba(255, 255, 255, 0.45)',
      processDescriptionColor: 'rgba(255, 255, 255, 0.65)',
      finishDescriptionColor: 'rgba(255, 255, 255, 0.45)',
      errorDescriptionColor: '#a61d24',
    },
    input: {
      ...defaultTheme.components.input,
      activeBorderColor: '#177ddc',
      hoverBorderColor: '#177ddc',
    },
    form: {
      ...defaultTheme.components.form,
      labelColor: 'rgba(255, 255, 255, 0.85)',
      errorColor: '#a61d24',
    },
    table: {
      headerBg: '#1f1f1f',
      headerColor: 'rgba(255, 255, 255, 0.85)',
      rowHoverBg: '#262626',
      borderColor: '#303030',
      bodyBg: '#141414',
      color: 'rgba(255, 255, 255, 0.85)',
      cellPadding: '16px 16px',
    },
  },
}
