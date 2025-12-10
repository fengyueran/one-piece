import React, { useContext } from 'react'
import { render, screen } from '@testing-library/react'
import { ConfigProvider, useConfig } from './index'
import { ConfigContext } from './context'

describe('ConfigProvider', () => {
  it('should provide default context when not used', () => {
    const Consumer = () => {
      const { locale } = useConfig()
      return <div>{locale ? 'Has Locale' : 'No Locale'}</div>
    }
    render(<Consumer />)
    expect(screen.getByText('No Locale')).toBeInTheDocument()
  })

  it('should provide locale via ConfigProvider', () => {
    const locale = { locale: 'en-US' } as any
    const Consumer = () => {
      const { locale } = useConfig()
      return <div>{locale?.locale}</div>
    }
    render(
      <ConfigProvider locale={locale}>
        <Consumer />
      </ConfigProvider>,
    )
    expect(screen.getByText('en-US')).toBeInTheDocument()
  })

  it('should wrap ThemeProvider', () => {
    // Basic check if children are rendered
    render(
      <ConfigProvider>
        <div>Content</div>
      </ConfigProvider>,
    )
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
})
