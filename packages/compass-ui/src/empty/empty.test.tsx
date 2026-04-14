import React from 'react'
import { render, screen } from '@testing-library/react'

import { ThemeProvider } from '../theme'
import Empty from './empty'

describe('Empty', () => {
  it('should render title, description and action', () => {
    render(
      <ThemeProvider>
        <Empty
          title="暂无项目"
          description="创建第一个项目后，这里会显示最近访问记录。"
          action={<button type="button">立即创建</button>}
        />
      </ThemeProvider>,
    )

    expect(screen.getByText('暂无项目')).toBeInTheDocument()
    expect(screen.getByText('创建第一个项目后，这里会显示最近访问记录。')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '立即创建' })).toBeInTheDocument()
  })

  it('should fall back to default title when no content is provided', () => {
    render(
      <ThemeProvider>
        <Empty />
      </ThemeProvider>,
    )

    expect(screen.getByText('暂无内容')).toBeInTheDocument()
  })
})
