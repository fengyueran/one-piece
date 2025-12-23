import { Theme as CompassTheme } from '../theme/types'

declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface Theme extends CompassTheme {}
}
