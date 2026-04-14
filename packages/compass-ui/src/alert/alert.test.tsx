import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import { ThemeProvider } from '../theme'
import Alert from './alert'

describe('Alert', () => {
  it('should render title and description', () => {
    render(
      <ThemeProvider>
        <Alert type="success" title="保存成功" description="配置已更新" />
      </ThemeProvider>,
    )

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText('保存成功')).toBeInTheDocument()
    expect(screen.getByText('配置已更新')).toBeInTheDocument()
  })

  it('should dismiss when closable', () => {
    const onClose = jest.fn()

    render(
      <ThemeProvider>
        <Alert title="可关闭提示" closable onClose={onClose} />
      </ThemeProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: '关闭提示' }))

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('可关闭提示')).not.toBeInTheDocument()
  })

  it('should render action area', () => {
    render(
      <ThemeProvider>
        <Alert title="待处理" action={<button type="button">查看详情</button>} />
      </ThemeProvider>,
    )

    expect(screen.getByRole('button', { name: '查看详情' })).toBeInTheDocument()
  })
})
