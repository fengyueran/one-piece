import React from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Select from './select'

// Mock floating-ui
jest.mock('@floating-ui/react', () => {
  const original = jest.requireActual('@floating-ui/react')
  return {
    ...original,
    useFloating: ({ onOpenChange, open }: any) => ({
      x: 0,
      y: 0,
      strategy: 'absolute',
      refs: {
        setReference: jest.fn(),
        setFloating: jest.fn(),
        domReference: { current: null },
      },
      floatingStyles: { position: 'absolute', top: 0, left: 0 },
      context: { onOpenChange, open },
    }),
    useInteractions: (list: any[]) => ({
      getReferenceProps: (userProps: any = {}) => {
        const interactionProps = list.reduce((acc, i) => ({ ...acc, ...(i?.reference || {}) }), {})
        return {
          ...interactionProps,
          ...userProps,
          onClick: (e: any) => {
            interactionProps.onClick?.(e)
            userProps.onClick?.(e)
          },
        }
      },
      getFloatingProps: () => ({}),
    }),
    useClick: (context: any) => ({
      reference: {
        onClick: () => context.onOpenChange?.(!context.open),
      },
    }),
    useDismiss: () => ({}),
    useRole: () => ({}),
    useHover: (context: any, { enabled }: any = {}) => ({
      reference: {
        onMouseEnter: enabled ? () => context.onOpenChange?.(true) : undefined,
        onMouseLeave: enabled ? () => context.onOpenChange?.(false) : undefined,
      },
    }),
    safePolygon: () => ({}),
    FloatingPortal: ({ children }: any) => <div>{children}</div>,
  }
})

const options = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
]

describe('Select', () => {
  describe('Rendering', () => {
    it('renders with placeholder', () => {
      render(<Select placeholder="Select option" />)
      expect(screen.getByText('Select option')).toBeInTheDocument()
    })

    it('applies custom className and style', () => {
      const { container } = render(<Select className="custom-cls" style={{ color: 'red' }} />)
      const root = container.querySelector('.compass-select')
      expect(root).toHaveClass('custom-cls')
      expect(root).toHaveStyle('color: rgb(255, 0, 0)')
    })

    it('renders children options correctly', () => {
      render(
        <Select placeholder="Select children">
          <Select.Option value="a">Option A</Select.Option>
          <Select.Option value="b">Option B</Select.Option>
        </Select>,
      )
      expect(screen.getByText('Select children')).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('opens dropdown on click and selects option (single mode)', async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()
      const { container } = render(
        <Select options={options} onChange={handleChange} placeholder="Select" />,
      )

      const trigger = container.querySelector('.compass-select')!
      await user.click(trigger)

      expect(screen.getByText('Option 1')).toBeInTheDocument()

      const option2 = screen.getByText('Option 2')
      await user.click(option2)

      expect(handleChange).toHaveBeenCalledWith(
        '2',
        expect.objectContaining({ value: '2', label: 'Option 2' }),
      )
      expect(container.textContent).toContain('Option 2')
    })

    it('controlled mode works', () => {
      const { container, rerender } = render(
        <Select options={options} value="1" onChange={() => {}} />,
      )
      expect(container.textContent).toContain('Option 1')

      rerender(<Select options={options} value="2" onChange={() => {}} />)
      expect(container.textContent).toContain('Option 2')
    })
  })

  describe('Multiple Selection', () => {
    it('selects and deselects items', async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()
      const { container, rerender } = render(
        <Select options={options} multiple onChange={handleChange} placeholder="Select" />,
      )

      const trigger = container.querySelector('.compass-select')!
      await user.click(trigger)

      // Select Option 1
      await user.click(screen.getByText('Option 1'))
      expect(handleChange).toHaveBeenLastCalledWith(['1'], expect.any(Array))

      // Deselect Option 1 (re-render with value first to simulate controlled behavior)
      rerender(
        <Select
          options={options}
          multiple
          value={['1']}
          onChange={handleChange}
          placeholder="Select"
        />,
      )

      const dropdown = container.querySelector('.compass-select-dropdown')!
      await user.click(within(dropdown as HTMLElement).getByText('Option 1'))

      expect(handleChange).toHaveBeenLastCalledWith([], expect.any(Array))

      // Verify visual tags
      rerender(<Select options={options} multiple value={['1', '2']} onChange={handleChange} />)
      const selection = container.querySelector('.compass-select-selector')!
      expect(within(selection as HTMLElement).getByText('Option 1')).toBeInTheDocument()
      expect(within(selection as HTMLElement).getByText('Option 2')).toBeInTheDocument()
    })

    it('removes tag when close icon is clicked', async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()
      render(<Select options={options} multiple value={['1']} onChange={handleChange} />)

      const tag = screen.getByText('Option 1').parentElement!
      const closeIcon = tag.querySelector('svg')!
      await user.click(closeIcon)
      expect(handleChange).toHaveBeenCalledWith([], expect.any(Array))
    })
  })

  describe('Search & Tags', () => {
    it('renders search input when showSearch is true', async () => {
      const user = userEvent.setup()
      const { container } = render(<Select showSearch options={options} />)
      const trigger = container.querySelector('.compass-select')!
      await user.click(trigger)

      const input = container.querySelector('input')
      expect(input).toBeInTheDocument()
    })

    it('filters options based on search input', async () => {
      const user = userEvent.setup()
      const { container } = render(<Select showSearch options={options} />)
      await user.click(container.querySelector('.compass-select')!)

      const input = container.querySelector('input')!
      await user.type(input, 'Option 1')

      expect(screen.getByText('Option 1')).toBeInTheDocument()
    })

    it('adds new tag in tags mode', async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()
      const { container } = render(<Select mode="tags" onChange={handleChange} />)
      const trigger = container.querySelector('.compass-select')!
      await user.click(trigger)

      const input = container.querySelector('input')!
      await user.type(input, 'New Tag{enter}')

      expect(handleChange).toHaveBeenCalledWith(['New Tag'], expect.any(Array))
    })

    it('selects existing option via Enter in tags mode', async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()
      const { container } = render(<Select mode="tags" options={options} onChange={handleChange} />)
      const trigger = container.querySelector('.compass-select')!
      await user.click(trigger)

      const input = container.querySelector('input')!
      // Type '1' to match the existing option with value '1'
      // Current implementation only searches by value
      await user.type(input, '1{enter}')
      expect(handleChange).toHaveBeenCalledWith(['1'], expect.any(Array))
    })
  })

  describe('Props Coverage', () => {
    it('disabled state prevents interaction', async () => {
      const user = userEvent.setup()
      const { container } = render(<Select disabled options={options} />)
      const trigger = container.querySelector('.compass-select')!
      expect(container.firstChild).toHaveStyle({ pointerEvents: 'none' })
      await user.click(trigger).catch(() => {})
      expect(screen.queryByRole('option')).not.toBeInTheDocument()
    })

    it('loading state renders loading icon', () => {
      render(<Select loading />)
      expect(screen.getByLabelText('loading')).toBeInTheDocument()
    })

    it('allowClear clears the value', async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()
      const { container } = render(
        <Select allowClear value="1" options={options} onChange={handleChange} />,
      )

      const clearIcon = container.querySelector('.compass-icon-close-circle')
      expect(clearIcon).toBeInTheDocument()

      const clearBtn = clearIcon!.parentElement!
      await user.click(clearBtn)

      expect(handleChange).toHaveBeenCalledWith('', expect.anything())
    })

    it('dropdownStyle and dropdownClassName are applied', async () => {
      const user = userEvent.setup()
      const { container } = render(
        <Select
          options={options}
          dropdownStyle={{ border: '5px solid red' }}
          dropdownClassName="my-dropdown"
        />,
      )
      await user.click(container.querySelector('.compass-select')!)

      const dropdown = document.querySelector('.compass-select-dropdown')
      expect(dropdown).toHaveClass('my-dropdown')
      expect(dropdown).toHaveStyle('border: 5px solid red')
    })

    it('hover trigger works (simulated)', async () => {
      const { container } = render(<Select options={options} trigger="hover" />)
      const trigger = container.querySelector('.compass-select')!
      fireEvent.mouseEnter(trigger)
    })

    it('status prop renders without crashing', () => {
      render(<Select status="error" />)
    })

    it('size prop renders without crashing', () => {
      render(<Select size="large" />)
    })
  })
})
