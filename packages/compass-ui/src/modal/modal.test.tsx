import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Modal from './index'
import { ThemeProvider, defaultTheme } from '../theme'

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={defaultTheme}>{ui}</ThemeProvider>)
}

describe('Modal', () => {
  describe('Rendering', () => {
    it('should render children when open', () => {
      renderWithTheme(
        <Modal isOpen={true}>
          <div>Modal Content</div>
        </Modal>,
      )
      expect(screen.getByText('Modal Content')).toBeInTheDocument()
    })

    it('should not render when isOpen is false', () => {
      renderWithTheme(
        <Modal isOpen={false}>
          <div>Modal Content</div>
        </Modal>,
      )
      expect(screen.getByText('Modal Content')).not.toBeVisible()
    })
  })

  describe('Props', () => {
    it('should apply custom className and style', () => {
      renderWithTheme(
        <Modal isOpen={true} className="custom-class" style={{ top: '100px' }}>
          <div>Modal Content</div>
        </Modal>,
      )
      const modalRoot = document.querySelector('.compass-modal')
      expect(modalRoot).toHaveClass('custom-class')
      expect(modalRoot).toHaveStyle({ top: '100px' })
    })

    it('should not render mask when maskVisible is false', () => {
      renderWithTheme(
        <Modal isOpen={true} maskVisible={false}>
          <div>Modal Content</div>
        </Modal>,
      )
      const mask = document.querySelector('.compass-modal-mask')
      expect(mask).not.toBeInTheDocument()
    })

    it('should render custom footer', () => {
      renderWithTheme(
        <Modal isOpen={true} footer={<div>Custom Footer</div>}>
          <div>Modal Content</div>
        </Modal>,
      )
      expect(screen.getByText('Custom Footer')).toBeInTheDocument()
      expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument()
    })

    it('should render title', () => {
      renderWithTheme(
        <Modal isOpen={true} title="Test Title">
          <div>Content</div>
        </Modal>,
      )
      expect(screen.getByText('Test Title')).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('should call onCancel when mask is clicked', () => {
      const handleCancel = jest.fn()
      renderWithTheme(
        <Modal isOpen={true} onCancel={handleCancel}>
          <div>Modal Content</div>
        </Modal>,
      )
      const mask = document.querySelector('.compass-modal-mask')
      expect(mask).toBeInTheDocument()
      if (mask) {
        fireEvent.click(mask)
        expect(handleCancel).toHaveBeenCalledTimes(1)
      }
    })

    it('should call onCancel when Close button is clicked', () => {
      const handleCancel = jest.fn()
      renderWithTheme(
        <Modal isOpen={true} onCancel={handleCancel} closable={true}>
          <div>Modal Content</div>
        </Modal>,
      )
      const closeButton = screen.getByLabelText('Close')
      fireEvent.click(closeButton)
      expect(handleCancel).toHaveBeenCalledTimes(1)
    })

    it('should call onCancel when Cancel button in footer is clicked', () => {
      const handleCancel = jest.fn()
      renderWithTheme(
        <Modal isOpen={true} onCancel={handleCancel}>
          <div>Content</div>
        </Modal>,
      )
      const cancelButton = screen.getByText('取消')
      fireEvent.click(cancelButton)
      expect(handleCancel).toHaveBeenCalledTimes(1)
    })

    it('should call onOk when OK button is clicked', () => {
      const handleOk = jest.fn()
      renderWithTheme(
        <Modal isOpen={true} onOk={handleOk}>
          <div>Content</div>
        </Modal>,
      )
      const okButton = screen.getByText('确定')
      fireEvent.click(okButton)
      expect(handleOk).toHaveBeenCalledTimes(1)
    })

    it('should call afterClose when transition ends', () => {
      const handleAfterClose = jest.fn()
      const { rerender } = renderWithTheme(
        <Modal isOpen={true} afterClose={handleAfterClose}>
          <div>Content</div>
        </Modal>,
      )

      // Close the modal
      rerender(
        <ThemeProvider theme={defaultTheme}>
          <Modal isOpen={false} afterClose={handleAfterClose}>
            <div>Content</div>
          </Modal>
        </ThemeProvider>,
      )

      const modalContent = document.querySelector('.compass-modal-content')
      if (modalContent) {
        fireEvent.transitionEnd(modalContent)
      }

      expect(handleAfterClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility', () => {
    it('should have correct ARIA attributes', () => {
      renderWithTheme(
        <Modal isOpen={true}>
          <div>Modal Content</div>
        </Modal>,
      )
      const modal = document.querySelector('.compass-modal')
      expect(modal).toHaveAttribute('role', 'dialog')
      expect(modal).toHaveAttribute('aria-modal', 'true')
    })
  })

  describe('Branches & Edge Cases', () => {
    it('should handle onOk without callback', () => {
      render(
        <ThemeProvider>
          <Modal isOpen title="Test" onCancel={jest.fn()}>
            Content
          </Modal>
        </ThemeProvider>,
      )
      // Should not throw
      fireEvent.click(screen.getByText('确定'))
    })

    it('should call onCancel when onOk returns plain value', () => {
      const onCancel = jest.fn()
      const onOk = jest.fn().mockReturnValue(true) // Not a promise
      render(
        <ThemeProvider>
          <Modal isOpen title="Test" onOk={onOk} onCancel={onCancel}>
            Content
          </Modal>
        </ThemeProvider>,
      )
      fireEvent.click(screen.getByText('确定'))
      expect(onOk).toHaveBeenCalled()
      expect(onCancel).toHaveBeenCalled()
    })

    it('should render proper text with custom locale props', () => {
      render(
        <ThemeProvider>
          <Modal isOpen okText="Custom OK" cancelText="Custom Cancel" onCancel={jest.fn()}>
            Content
          </Modal>
        </ThemeProvider>,
      )
      expect(screen.getByText('Custom OK')).toBeInTheDocument()
      expect(screen.getByText('Custom Cancel')).toBeInTheDocument()
    })

    it('should not render mask when maskVisible is false', () => {
      const { container } = render(
        <ThemeProvider>
          <Modal isOpen maskVisible={false} onCancel={jest.fn()}>
            Content
          </Modal>
        </ThemeProvider>,
      )
      expect(container.querySelector('.compass-modal-mask')).not.toBeInTheDocument()
    })

    it('should not render close button when closable is false', () => {
      render(
        <ThemeProvider>
          <Modal isOpen closable={false} onCancel={jest.fn()}>
            Content
          </Modal>
        </ThemeProvider>,
      )
      expect(screen.queryByLabelText('Close')).not.toBeInTheDocument()
    })

    it('should not render header when title is missing and closable is false', () => {
      const { container } = render(
        <ThemeProvider>
          <Modal isOpen closable={false} onCancel={jest.fn()}>
            Content
          </Modal>
        </ThemeProvider>,
      )
      expect(container.querySelector('.compass-modal-header')).not.toBeInTheDocument()
    })

    it('should render custom footer', () => {
      render(
        <ThemeProvider>
          <Modal isOpen footer={<div>Custom Footer</div>} onCancel={jest.fn()}>
            Content
          </Modal>
        </ThemeProvider>,
      )
      expect(screen.getByText('Custom Footer')).toBeInTheDocument()
      expect(screen.queryByText('确定')).not.toBeInTheDocument()
    })

    it('should call afterClose when transition ends', () => {
      const afterClose = jest.fn()
      const { rerender } = render(
        <ThemeProvider>
          <Modal isOpen={true} afterClose={afterClose} onCancel={jest.fn()}>
            Content
          </Modal>
        </ThemeProvider>,
      )

      // Close modal
      rerender(
        <ThemeProvider>
          <Modal isOpen={false} afterClose={afterClose} onCancel={jest.fn()}>
            Content
          </Modal>
        </ThemeProvider>,
      )

      // Trigger transition end
      const content = document.querySelector('.compass-modal-content')
      if (content) {
        fireEvent.transitionEnd(content)
      }

      expect(afterClose).toHaveBeenCalled()
    })
  })
})
