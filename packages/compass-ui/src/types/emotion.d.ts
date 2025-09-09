import { Theme as CompassTheme } from '../theme/types'

declare module '@emotion/react' {
  export interface Theme extends CompassTheme {}
}
