import { extractBodyContent, extractRenderInfo, cleanEmptyHandlers } from './source-transform'

describe('source-transform', () => {
  describe('extractBodyContent', () => {
    it('should extract simple block content', () => {
      const code = '{ return 1 }'
      expect(extractBodyContent(code)).toBe('{ return 1 }')
    })

    it('should extract simple parentheses content', () => {
      const code = '( 1 + 2 )'
      expect(extractBodyContent(code)).toBe('1 + 2')
    })

    it('should handle strings with braces inside block', () => {
      const code = `{ const str = "}"; return str }`
      expect(extractBodyContent(code)).toBe('{ const str = "}"; return str }')
    })

    it('should handle strings with parentheses inside parentheses', () => {
      const code = '( " ) " )'
      expect(extractBodyContent(code)).toBe('" ) "')
    })

    it('should handle escaped quotes in strings', () => {
      const code = `{ const str = "\\"}" }`
      expect(extractBodyContent(code)).toBe('{ const str = "\\"}" }')
    })

    it('should handle single line comments with braces', () => {
      const code = `{
        // }
        return true
      }`
      expect(extractBodyContent(code)).toBe(`{
        // }
        return true
      }`)
    })

    it('should handle multi-line comments with braces', () => {
      const code = `{
        /*
         }
        */
        return true
      }`
      expect(extractBodyContent(code)).toBe(`{
        /*
         }
        */
        return true
      }`)
    })

    it('should stop at the correct closing brace for extra content', () => {
      const code = '{ return 1 }, parameters: {}'
      // extractBodyContent expects the string to start with the opening char
      // It returns the balanced part
      expect(extractBodyContent(code)).toBe('{ return 1 }')
    })
  })

  describe('extractRenderInfo', () => {
    it('should extract simple arrow function', () => {
      const code = 'render: () => <div />'
      const { renderCode, functionArgs } = extractRenderInfo(code)
      expect(functionArgs).toBe('()')
      expect(renderCode).toBe('<div />')
    })

    it('should extract block arrow function', () => {
      const code = 'render: (args) => { return <Button {...args} /> }'
      const { renderCode, functionArgs } = extractRenderInfo(code)
      expect(functionArgs).toBe('(args)')
      expect(renderCode).toBe('{ return <Button {...args} /> }')
    })

    it('should handle component with complex props containing strings and comments', () => {
      const code = `render: () => (
        <Dropdown
          onVisibleChange={(visible) => console.log('Visibility changed: )', visible)}
          overlay={MenuContent}
          // comment with )
        >
          <Button>Check Console</Button>
        </Dropdown>
      )`
      const { renderCode } = extractRenderInfo(code)
      expect(renderCode).toContain('<Dropdown')
      expect(renderCode).toContain('</Dropdown>')
      // Should not contain the outer params since it should stop at the closing paren of render
    })

    it('should correctly handle the user reported case', () => {
      const input = `{
        render: () => (
          <Dropdown
            onVisibleChange={(visible) => console.log('Visibility changed:', visible)}
            overlay={MenuContent}
          >
            <Button>Check Console</Button>
          </Dropdown>
        ),
        parameters: {
          docs: { description: { story: 'desc' } }
    }}
      `
      const { renderCode } = extractRenderInfo(input.trim())

      // It should NOT include parameters
      expect(renderCode).not.toContain('parameters:')
      expect(renderCode.trim().endsWith('</Dropdown>')).toBe(true)
    })
  })
})
