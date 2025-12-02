declare module 'prettier-v2/standalone' {
  import { Options } from 'prettier'
  export function format(source: string, options?: Options): string
}

declare module 'prettier-v2/parser-babel' {
  const parser: any
  export default parser
}

declare module 'prettier-v2/parser-typescript' {
  const parser: any
  export default parser
}
