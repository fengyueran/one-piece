import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import useModal from './use-modal'
import { ThemeProvider, defaultTheme } from '../theme'
import Button from '../button'

const Demo = ({ onReady, config }: any) => {
  const [modal, contextHolder] = useModal()

  React.useEffect(() => {
    if (onReady) onReady(modal)
  }, [modal, onReady])

  return (
    <ThemeProvider theme={defaultTheme}>
      {contextHolder}
      <Button onClick={() => modal.confirm(config)}>Confirm</Button>
    </ThemeProvider>
  )
}

const cleanupModal = async () => {
  // Wait for any pending effects
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 50))
  })

  const modalContent = document.querySelector('.compass-modal-content')
  if (modalContent) {
    await act(async () => {
      fireEvent.transitionEnd(modalContent)
    })
  }
}

describe('useModal', () => {
  it('should render modal when triggered', async () => {
    const handleOk = jest.fn()
    const config = {
      title: 'Hook Title',
      content: 'Hook Content',
      onOk: handleOk,
    }

    render(<Demo config={config} />)

    // Trigger modal
    fireEvent.click(screen.getByText('Confirm'))

    await waitFor(() => {
      expect(screen.getByText('Hook Title')).toBeInTheDocument()
    })

    // Click OK (Default locale zh_CN -> 确定)
    fireEvent.click(screen.getByText('确定'))

    expect(handleOk).toHaveBeenCalled()

    await cleanupModal()

    // Should close
    await waitFor(() => {
      expect(screen.queryByText('Hook Title')).not.toBeInTheDocument()
    })
  })

  it('should handle async onOk', async () => {
    const handleOk = jest
      .fn()
      .mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)))
    const config = {
      title: 'Async Title',
      onOk: handleOk,
    }

    render(<Demo config={config} />)
    fireEvent.click(screen.getByText('Confirm'))

    await waitFor(() => {
      expect(screen.getByText('Async Title')).toBeInTheDocument()
    })

    const okBtn = screen.getByText('确定')
    fireEvent.click(okBtn)

    expect(handleOk).toHaveBeenCalled()

    // Wait for async handler
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 150))
    })

    await cleanupModal()

    await waitFor(() => {
      expect(screen.queryByText('Async Title')).not.toBeInTheDocument()
    })
  })

  it('should support update', async () => {
    let modalInstance: any
    const onReady = (modal: any) => {
      modalInstance = modal
    }

    render(<Demo onReady={onReady} />)

    let instance: any
    await act(async () => {
      instance = modalInstance.info({
        title: 'Original Title',
      })
      await new Promise((r) => setTimeout(r, 50))
    })

    expect(screen.getByText('Original Title')).toBeInTheDocument()

    await act(async () => {
      instance.update({
        title: 'Updated Title',
      })
    })

    expect(screen.getByText('Updated Title')).toBeInTheDocument()
  })

  it('should support destroy', async () => {
    let modalInstance: any
    const onReady = (modal: any) => {
      modalInstance = modal
    }

    render(<Demo onReady={onReady} />)

    let instance: any
    await act(async () => {
      instance = modalInstance.warning({
        title: 'Warning',
      })
      await new Promise((r) => setTimeout(r, 50))
    })

    expect(screen.getByText('Warning')).toBeInTheDocument()

    await act(async () => {
      instance.destroy()
    })

    await cleanupModal()

    await waitFor(() => {
      expect(screen.queryByText('Warning')).not.toBeInTheDocument()
    })
  })
})
