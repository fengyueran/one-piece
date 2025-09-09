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
}
