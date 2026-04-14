import React from 'react'
import { render, screen } from '@testing-library/react'

import { ThemeProvider } from '../theme'
import SpinLoading from './spin-loading'

describe('SpinLoading', () => {
  it('should render standalone spinner with tip', () => {
    render(
      <ThemeProvider>
        <SpinLoading tip="正在加载数据" />
      </ThemeProvider>,
    )

    expect(screen.getByRole('status', { name: '正在加载数据' })).toBeInTheDocument()
    expect(screen.getByText('正在加载数据')).toBeInTheDocument()
  })

  it('should render overlay when children are provided', () => {
    render(
      <ThemeProvider>
        <SpinLoading tip="加载中">
          <div>表格内容</div>
        </SpinLoading>
      </ThemeProvider>,
    )

    expect(screen.getByText('表格内容')).toBeInTheDocument()
    expect(document.querySelector('.compass-spin-loading-overlay')).toBeInTheDocument()
  })

  it('should render children only when not spinning', () => {
    render(
      <ThemeProvider>
        <SpinLoading spinning={false}>
          <div>静态内容</div>
        </SpinLoading>
      </ThemeProvider>,
    )

    expect(screen.getByText('静态内容')).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
