import React from 'react'

export interface Theme {
  colors: {
    primary: string
    primaryHover: string
    primaryActive: string
    success: string
    warning: string
    error: string
    info: string

    text: string
    textSecondary: string
    textTertiary: string
    textDisabled: string

    background: string
    backgroundSecondary: string
    backgroundTertiary: string

    border: string
    borderSecondary: string
    borderHover: string
  }

  spacing: {
    xs: number
    sm: number
    md: number
    lg: number
    xl: number
    xxl: number
  }

  borderRadius: {
    xs: number
    sm: number
    md: number
    lg: number
    xl: number
  }

  fontSize: {
    xs: number
    sm: number
    md: number
    lg: number
    xl: number
    xxl: number
  }

  fontWeight: {
    light: number
    normal: number
    medium: number
    semibold: number
    bold: number
  }

  lineHeight: {
    tight: number
    normal: number
    relaxed: number
  }

  shadows: {
    sm: string
    md: string
    lg: string
    xl: string
  }

  transitions: {
    fast: string
    normal: string
    slow: string
  }

  breakpoints: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }

  components: {
    button: ButtonTheme
    message: MessageTheme
    modal: ModalTheme
    progress: ProgressTheme
  }
}

export interface ButtonTheme {
  padding: {
    sm: string
    md: string
  }
  fontSize: {
    sm: string
    md: string
    lg: string
  }
  borderRadius: {
    sm: string
    md: string
    lg: string
  }
}

export interface MessageTheme {
  contentPadding: string
  borderRadius: string
  boxShadow: string
  zIndex: number
}

export interface ModalTheme {
  maskColor: string
  contentBg: string
  borderRadius: string
  boxShadow: string
  headerPadding: string
  bodyPadding: string
  footerPadding: string
  zIndex: number
}

export interface ProgressTheme {
  trackColor: string
  successColor: string
  errorColor: string
  warningColor: string
  infoColor: string
  fontSize: string
}

export type ThemeMode = 'light' | 'dark'

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export interface ThemeProviderProps {
  children: React.ReactNode
  theme?: DeepPartial<Theme>
  lightTheme?: DeepPartial<Theme>
  darkTheme?: DeepPartial<Theme>
  defaultMode?: ThemeMode
}
