import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Popconfirm from './popconfirm'

describe('Popconfirm', () => {
  it('should confirm and close', async () => {
    const user = userEvent.setup()
    const onConfirm = jest.fn()
    render(
      <Popconfirm title="确认删除？" onConfirm={onConfirm}>
        <button>Delete</button>
      </Popconfirm>,
    )

    await user.click(screen.getByRole('button', { name: 'Delete' }))
    expect(await screen.findByText('确认删除？')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '确定' }))

    expect(onConfirm).toHaveBeenCalledTimes(1)
    await waitFor(() => {
      expect(screen.queryByText('确认删除？')).not.toBeInTheDocument()
    })
  })

  it('should cancel and close', async () => {
    const user = userEvent.setup()
    const onCancel = jest.fn()
    render(
      <Popconfirm title="确认删除？" onCancel={onCancel}>
        <button>Delete</button>
      </Popconfirm>,
    )

    await user.click(screen.getByRole('button', { name: 'Delete' }))
    await user.click(screen.getByRole('button', { name: '取消' }))

    expect(onCancel).toHaveBeenCalledTimes(1)
    await waitFor(() => {
      expect(screen.queryByText('确认删除？')).not.toBeInTheDocument()
    })
  })

  it('should keep loading state while confirm promise is pending', async () => {
    const user = userEvent.setup()
    let resolveConfirm: (() => void) | undefined
    const onConfirm = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveConfirm = resolve
        }),
    )

    render(
      <Popconfirm title="异步确认" onConfirm={onConfirm}>
        <button>Async Delete</button>
      </Popconfirm>,
    )

    await user.click(screen.getByRole('button', { name: 'Async Delete' }))
    await user.click(screen.getByRole('button', { name: '确定' }))

    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(screen.getByText('确定').closest('button')).toBeDisabled()

    resolveConfirm?.()

    await waitFor(() => {
      expect(screen.queryByText('异步确认')).not.toBeInTheDocument()
    })
  })
})
