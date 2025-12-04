import { Theme } from './types'

export const defaultTheme: Theme = {
  colors: {
    primary: '#1890ff',
    primaryHover: '#40a9ff',
    primaryActive: '#096dd9',
    success: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f',
    info: '#1890ff',

    text: 'rgba(0, 0, 0, 0.88)',
    textSecondary: 'rgba(0, 0, 0, 0.65)',
    textTertiary: 'rgba(0, 0, 0, 0.45)',
    textDisabled: 'rgba(0, 0, 0, 0.25)',

    background: '#ffffff',
    backgroundSecondary: '#fafafa',
    backgroundTertiary: '#f5f5f5',

    border: '#d9d9d9',
    borderSecondary: '#f0f0f0',
    borderHover: '#4096ff',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  borderRadius: {
    xs: 2,
    sm: 4,
    md: 6,
    lg: 8,
    xl: 12,
  },

  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
  },

  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },

  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.03)',
    md: '0 1px 6px rgba(0, 0, 0, 0.03)',
    lg: '0 4px 12px rgba(0, 0, 0, 0.15)',
    xl: '0 8px 24px rgba(0, 0, 0, 0.15)',
  },

  transitions: {
    fast: 'all 0.1s ease-in-out',
    normal: 'all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)',
    slow: 'all 0.3s ease-in-out',
  },

  breakpoints: {
    xs: '480px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  },

  components: {
    button: {
      padding: {
        sm: '0 8px',
        md: '0 16px',
      },
      fontSize: {
        sm: '12px',
        md: '14px',
        lg: '16px',
      },
      borderRadius: {
        sm: '4px',
        md: '6px',
        lg: '8px',
      },
    },
    message: {
      contentPadding: '8px 16px',
      borderRadius: '8px',
      boxShadow:
        '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
      zIndex: 1010,
    },
    modal: {
      maskColor: 'rgba(0, 0, 0, 0.45)',
      contentBg: '#ffffff',
      borderRadius: '8px',
      boxShadow:
        '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
      headerPadding: '16px 24px',
      bodyPadding: '24px',
      footerPadding: '10px 16px',
      zIndex: 1000,
    },
    progress: {
      trackColor: '#f5f5f5',
      successColor: '#52c41a',
      errorColor: '#ff4d4f',
      warningColor: '#faad14',
      infoColor: '#1890ff',
      fontSize: '14px',
    },
    input: {
      padding: {
        sm: '4px 8px',
        md: '6px 12px',
        lg: '8px 16px',
      },
      fontSize: {
        sm: '12px',
        md: '14px',
        lg: '16px',
      },
      borderRadius: '4px',
      activeBorderColor: '#40a9ff',
      hoverBorderColor: '#4096ff',
    },
  },
}
