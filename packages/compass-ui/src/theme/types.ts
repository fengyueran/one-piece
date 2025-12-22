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
    steps: StepsTheme
    input: InputTheme
    dropdown: DropdownTheme
    menu: MenuTheme
    datePicker: DatePickerTheme
    select: SelectTheme
    pagination: PaginationTheme
    tree: TreeTheme
  }
}

export interface TreeTheme {
  nodeSelectedBg: string
  nodeHoverBg: string
  nodeColor: string
  nodeSelectedColor: string
  switcherColor: string
  switcherHoverColor: string
  fontSize: string
  borderRadius: string
  indentSize: string
}

export interface SelectTheme {
  borderRadius: string
  backgroundColor: string
  borderColor: string
  hoverBorderColor: string
  activeBorderColor: string
  placeholderColor: string

  optionSelectedBg: string
  optionHoverBg: string
  optionColor: string
  optionSelectedColor: string

  tagBg: string
  tagColor: string
  tagBorderColor: string

  padding: {
    sm: string
    md: string
    lg: string
  }
  fontSize: {
    sm: string
    md: string
    lg: string
  }
}

export interface DatePickerTheme {
  cellWidth: string
  cellHeight: string
  cellPadding: string
  cellMargin: string
  cellFontSize: string
  cellBorderRadius: string

  headerPadding: string
  headerHeight: string
  headerFontSize: string

  weekDayFontSize: string

  cellActiveBg: string
  cellHoverBg: string
  cellColor: string
  cellActiveColor: string
  cellDisabledColor: string

  borderColor: string
  boxShadow: string
  zIndex: number
}

export interface PaginationTheme {
  itemSize: string
  itemBg: string
  itemActiveBg: string
  itemBorderRadius: string
  itemColor: string
  itemActiveColor: string
  itemHoverBg: string
  itemHoverColor: string
  fontSize: string
}

export interface MenuTheme {
  itemHoverBg: string
  itemColor: string
  itemHeight: string
  itemPadding: string
  fontSize: string
  borderRadius: string
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

export interface StepsTheme {
  descriptionColor: string
  titleColor: string
  subTitleColor: string
  waitIconColor: string
  processIconColor: string
  finishIconColor: string
  errorIconColor: string
  waitTitleColor: string
  processTitleColor: string
  finishTitleColor: string
  errorTitleColor: string
  waitDescriptionColor: string
  processDescriptionColor: string
  finishDescriptionColor: string
  errorDescriptionColor: string
  iconSize: string
  dotSize: string
  titleFontSize: string
  descriptionFontSize: string
}

export interface InputTheme {
  padding: {
    sm: string
    md: string
    lg: string
  }
  fontSize: {
    sm: string
    md: string
    lg: string
  }
  borderRadius: string
  activeBorderColor: string
  hoverBorderColor: string
}

export interface DropdownTheme {
  zIndex: number
  backgroundColor: string
  boxShadow: string
  borderRadius: string
  padding: string
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
