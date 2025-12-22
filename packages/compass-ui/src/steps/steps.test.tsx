import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Steps from './steps'
import { ThemeProvider } from '../theme'
import { InfoIcon } from '../icons'

describe('Steps', () => {
  const items = [
    {
      title: 'Step 1',
      description: 'Description 1',
    },
    {
      title: 'Step 2',
      description: 'Description 2',
    },
    {
      title: 'Step 3',
      description: 'Description 3',
    },
  ]

  const renderWithTheme = (ui: React.ReactElement) => {
    return render(<ThemeProvider>{ui}</ThemeProvider>)
  }

  describe('Rendering', () => {
    it('should render with items', () => {
      renderWithTheme(<Steps items={items} />)
      expect(screen.getByRole('list')).toBeInTheDocument()
      expect(screen.getAllByRole('listitem')).toHaveLength(3)
    })

    it('should render with children', () => {
      renderWithTheme(
        <Steps>
          <Steps.Step title="Step 1" />
          <Steps.Step title="Step 2" />
        </Steps>,
      )
      expect(screen.getAllByRole('listitem')).toHaveLength(2)
    })
  })

  describe('Props', () => {
    it('should render correct current step', () => {
      renderWithTheme(<Steps items={items} current={1} />)
      const steps = screen.getAllByRole('listitem')
      expect(steps[1]).toHaveClass('compass-steps-item--process')
      expect(steps[0]).toHaveClass('compass-steps-item--finish')
      expect(steps[2]).toHaveClass('compass-steps-item--wait')
    })

    it('should render correct status', () => {
      renderWithTheme(<Steps items={items} current={1} status="error" />)
      const steps = screen.getAllByRole('listitem')
      expect(steps[1]).toHaveClass('compass-steps-item--error')
    })

    it('should render vertical direction', () => {
      renderWithTheme(<Steps items={items} direction="vertical" />)
      expect(screen.getByRole('list')).toHaveClass('compass-steps--vertical')
    })

    it('should render custom icon', () => {
      const customItems = [
        {
          title: 'Step 1',
          icon: <span data-testid="custom-icon">Icon</span>,
        },
      ]
      renderWithTheme(<Steps items={customItems} />)
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
    })

    it('should render labelPlacement vertical', () => {
      renderWithTheme(<Steps items={items} labelPlacement="vertical" />)
      expect(screen.getByRole('list')).toHaveClass('compass-steps--label-vertical')
    })

    it('should render dot variant', () => {
      renderWithTheme(<Steps items={items} variant="dot" />)
      expect(screen.getByRole('list')).toHaveClass('compass-steps--dot')
      const steps = screen.getAllByRole('listitem')
      expect(steps[0].querySelector('.compass-steps-icon')).toHaveClass('compass-steps-icon--dot')
    })

    it('should apply custom className and style', () => {
      const style = { marginTop: '10px' }
      renderWithTheme(<Steps items={items} className="custom-class" style={style} />)
      const stepsContainer = screen.getByRole('list')
      expect(stepsContainer).toHaveClass('custom-class')
      expect(stepsContainer).toHaveStyle('margin-top: 10px')
    })

    it('should render subTitle and description', () => {
      const itemsWithDetails = [
        {
          title: 'Step 1',
          subTitle: 'Sub 1',
          description: 'Desc 1',
        },
      ]
      renderWithTheme(<Steps items={itemsWithDetails} />)
      expect(screen.getByText('Sub 1')).toBeInTheDocument()
      expect(screen.getByText('Desc 1')).toBeInTheDocument()
    })

    it('should apply individual step props', () => {
      const itemsWithProps = [
        {
          title: 'Step 1',
          className: 'step-class',
          style: { color: 'red' },
        },
      ]
      renderWithTheme(<Steps items={itemsWithProps} />)
      const step = screen.getAllByRole('listitem')[0]
      expect(step).toHaveClass('step-class')
      expect(step).toHaveStyle('color: rgb(255, 0, 0)')
    })
  })

  describe('Interactions', () => {
    it('should call onChange when step is clicked', () => {
      const handleChange = jest.fn()
      renderWithTheme(<Steps items={items} current={0} onChange={handleChange} />)
      fireEvent.click(screen.getAllByRole('listitem')[1])
      expect(handleChange).toHaveBeenCalledWith(1)
    })

    it('should not call onChange when disabled step is clicked', () => {
      const handleChange = jest.fn()
      const disabledItems = [{ title: 'Step 1' }, { title: 'Step 2', disabled: true }]
      renderWithTheme(<Steps items={disabledItems} current={0} onChange={handleChange} />)
      fireEvent.click(screen.getAllByRole('listitem')[1])
      expect(handleChange).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('should have correct roles', () => {
      renderWithTheme(<Steps items={items} />)
      expect(screen.getByRole('list')).toBeInTheDocument()
      expect(screen.getAllByRole('listitem')).toHaveLength(3)
    })
  })

  describe('Boundary', () => {
    it('should render nothing if no items or children', () => {
      const { container } = renderWithTheme(<Steps />)
      expect(container.firstChild).toBeInTheDocument() // It renders the container but empty
      expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
    })
  })
})
