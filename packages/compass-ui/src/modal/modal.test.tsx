import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
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

  describe('Static Methods', () => {
    beforeEach(() => {
      document.body.innerHTML = ''
    })

    it('should render confirm modal', async () => {
      Modal.confirm({
        title: 'Confirm Title',
        content: 'Confirm Content',
      })

      await waitFor(() => {
        expect(screen.getByText('Confirm Title')).toBeInTheDocument()
        expect(screen.getByText('Confirm Content')).toBeInTheDocument()
      })

      const modal = document.querySelector('.compass-modal')
      expect(modal).toBeInTheDocument()
    })

    it('should render info modal', async () => {
      Modal.info({
        title: 'Info Title',
      })

      await waitFor(() => {
        expect(screen.getByText('Info Title')).toBeInTheDocument()
      })
    })
  })
})
