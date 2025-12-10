import zhCN from './zh_CN'
import enUS from './en_US'

describe('Locale', () => {
  it('should have correct structure for zh_CN', () => {
    expect(zhCN.locale).toBe('zh-CN')
    expect(zhCN.Modal).toBeDefined()
    expect(zhCN.DatePicker).toBeDefined()
    expect(zhCN.Modal.okText).toBe('确定')
  })

  it('should have correct structure for en_US', () => {
    expect(enUS.locale).toBe('en-US')
    expect(enUS.Modal).toBeDefined()
    expect(enUS.DatePicker).toBeDefined()
    expect(enUS.Modal.okText).toBe('OK')
  })
})
