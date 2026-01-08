import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Form, { FormInstance } from './index'
import { FormItem } from './form-item'
import { useForm } from './form-context'

// Helper component for testing
interface MockInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string | number | readonly string[]
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

const Input = ({ value, onChange, ...props }: MockInputProps) => (
  <input value={value || ''} onChange={(e) => onChange?.(e)} {...props} />
)

describe('Form', () => {
  describe('Rendering', () => {
    it('should render form with children', () => {
      render(
        <Form>
          <FormItem label="Username" name="username">
            <Input />
          </FormItem>
        </Form>,
      )
      expect(screen.getByText('Username')).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })
  })

  describe('Props', () => {
    it('should set initial values', async () => {
      render(
        <Form initialValues={{ username: 'admin' }}>
          <FormItem label="Username" name="username">
            <Input />
          </FormItem>
        </Form>,
      )
      // initialValues are applied via effect + store update
      await waitFor(() => {
        expect(screen.getByRole('textbox')).toHaveValue('admin')
      })
    })

    it('should call onFieldsChange when fields update', async () => {
      const onFieldsChange = jest.fn()
      render(
        <Form onFieldsChange={onFieldsChange}>
          <FormItem name="username">
            <Input aria-label="username" />
          </FormItem>
        </Form>,
      )

      const input = screen.getByLabelText('username')
      await userEvent.type(input, 'test')

      await waitFor(() => {
        expect(onFieldsChange).toHaveBeenCalled()
        const args = onFieldsChange.mock.calls[0]
        // changedFields
        expect(args[0][0]).toHaveProperty('name', 'username')
        expect(args[0][0]).toHaveProperty('value', 't')
        // allFields
        expect(args[1][0]).toHaveProperty('name', 'username')
        expect(args[1][0]).toHaveProperty('value', 't')
      })
    })

    it('should triggers onFinish when validation passes', async () => {
      const onFinish = jest.fn()

      render(
        <Form onFinish={onFinish}>
          <FormItem name="username" rules={[{ required: true, message: 'Username is required' }]}>
            <Input aria-label="username" />
          </FormItem>
          <button type="submit">Submit</button>
        </Form>,
      )

      await userEvent.type(screen.getByLabelText('username'), 'admin')
      fireEvent.click(screen.getByText('Submit'))

      await waitFor(() => {
        expect(onFinish).toHaveBeenCalledWith({ username: 'admin' })
      })
    })

    it('should triggers onFinishFailed when validation fails', async () => {
      const onFinish = jest.fn()
      const onFinishFailed = jest.fn()

      render(
        <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <FormItem name="username" rules={[{ required: true, message: 'Username is required' }]}>
            <Input aria-label="username" />
          </FormItem>
          <button type="submit">Submit</button>
        </Form>,
      )

      fireEvent.click(screen.getByText('Submit'))

      await waitFor(() => {
        expect(screen.getByText('Username is required')).toBeInTheDocument()
      })
      expect(onFinish).not.toHaveBeenCalled()
      expect(onFinishFailed).toHaveBeenCalled()
    })
  })

  describe('Interactions', () => {
    it('should update value on input change', async () => {
      render(
        <Form>
          <FormItem name="username">
            <Input aria-label="username" />
          </FormItem>
        </Form>,
      )
      const input = screen.getByLabelText('username')
      await userEvent.type(input, 'newuser')
      expect(input).toHaveValue('newuser')
    })

    it('should clear errors when input becomes valid', async () => {
      render(
        <Form>
          <FormItem name="email" rules={[{ type: 'email', message: 'Invalid email' }]}>
            <Input aria-label="email" />
          </FormItem>
          <button type="submit">Submit</button>
        </Form>,
      )

      const input = screen.getByLabelText('email')

      // Trigger invalid state
      await userEvent.type(input, 'invalid')
      fireEvent.click(screen.getByText('Submit'))

      await waitFor(() => {
        expect(screen.getByText('Invalid email')).toBeInTheDocument()
      })

      // Fix input
      await userEvent.clear(input)
      await userEvent.type(input, 'valid@email.com')

      await waitFor(() => {
        expect(screen.queryByText('Invalid email')).not.toBeInTheDocument()
      })
    })
  })

  describe('State', () => {
    it('should support dynamic setFieldsValue via instance', async () => {
      const TestComponent = () => {
        const [form] = useForm()
        return (
          <Form form={form}>
            <FormItem name="test">
              <Input aria-label="test" />
            </FormItem>
            <button onClick={() => form.setFieldsValue({ test: 'hello' })}>Set</button>
          </Form>
        )
      }

      render(<TestComponent />)
      fireEvent.click(screen.getByText('Set'))

      await waitFor(() => {
        expect(screen.getByLabelText('test')).toHaveValue('hello')
      })
    })

    it('should support resetFields', async () => {
      const TestComponent = () => {
        const [form] = useForm()
        return (
          <Form form={form} initialValues={{ test: 'initial' }}>
            <FormItem name="test">
              <Input aria-label="test" />
            </FormItem>
            <button
              onClick={() => {
                form.setFieldsValue({ test: 'changed' })
              }}
            >
              Change
            </button>
            <button onClick={() => form.resetFields()}>Reset</button>
          </Form>
        )
      }

      render(<TestComponent />)
      const input = screen.getByLabelText('test')

      expect(input).toHaveValue('initial')

      fireEvent.click(screen.getByText('Change'))
      await waitFor(() => expect(input).toHaveValue('changed'))

      fireEvent.click(screen.getByText('Reset'))
      await waitFor(() => expect(input).toHaveValue('initial'))
    })

    it('should not overwrite user input when parent re-renders with initialValues', async () => {
      const onFinish = jest.fn()
      const user = userEvent.setup()

      const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
        <input {...props} value={props.value ?? ''} />
      )

      const Wrapper = () => {
        const [tick, setTick] = React.useState(0)
        const [form] = useForm()

        return (
          <div>
            <button type="button" onClick={() => setTick((t) => t + 1)}>
              Rerender {tick}
            </button>
            <Form form={form} initialValues={{ username: 'admin' }} onFinish={onFinish}>
              <FormItem name="username">
                <Input aria-label="username" />
              </FormItem>
              <FormItem
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input aria-label="password" />
              </FormItem>
              <button type="submit">Submit</button>
            </Form>
          </div>
        )
      }

      render(<Wrapper />)

      await user.type(screen.getByLabelText('password'), '111')
      // Force a parent rerender
      fireEvent.click(screen.getByText(/Rerender/))

      fireEvent.click(screen.getByText('Submit'))

      await waitFor(() => {
        expect(onFinish).toHaveBeenCalledWith({ username: 'admin', password: '111' })
      })
    })

    it('should support useWatch', async () => {
      const Watcher = ({ control }: { control: FormInstance }) => {
        const value = Form.useWatch('test', control)
        return <div data-testid="watch-value">{value as string}</div>
      }

      const TestComponent = () => {
        const [form] = useForm()
        return (
          <Form form={form}>
            <FormItem name="test">
              <Input aria-label="test" />
            </FormItem>
            <Watcher control={form} />
          </Form>
        )
      }

      render(<TestComponent />)
      const input = screen.getByLabelText('test')

      expect(screen.getByTestId('watch-value')).toHaveTextContent('')

      await userEvent.type(input, 'hello')

      await waitFor(() => {
        expect(screen.getByTestId('watch-value')).toHaveTextContent('hello')
      })
    })

    it('should clear errors when resetFields is called', async () => {
      const TestComponent = () => {
        const [form] = useForm()
        return (
          <Form form={form}>
            <FormItem name="username" rules={[{ required: true, message: 'Username is required' }]}>
              <Input aria-label="username" />
            </FormItem>
            <button onClick={() => form.validateFields().catch(() => {})}>Validate</button>
            <button onClick={() => form.resetFields()}>Reset</button>
          </Form>
        )
      }

      render(<TestComponent />)

      // Trigger validation error
      fireEvent.click(screen.getByText('Validate'))

      await waitFor(() => {
        expect(screen.getByText('Username is required')).toBeInTheDocument()
      })

      // Reset fields
      fireEvent.click(screen.getByText('Reset'))

      await waitFor(() => {
        expect(screen.queryByText('Username is required')).not.toBeInTheDocument()
      })
    })

    it('should support setFields to manually set value and errors', async () => {
      const TestComponent = () => {
        const [form] = useForm()
        return (
          <Form form={form}>
            <FormItem name="username">
              <Input aria-label="username" />
            </FormItem>
            <button
              onClick={() => {
                form.setFields([
                  {
                    name: 'username',
                    value: 'manual_value',
                    errors: ['Manual Error'],
                  },
                ])
              }}
            >
              Set Fields
            </button>
          </Form>
        )
      }

      render(<TestComponent />)
      const input = screen.getByLabelText('username')

      expect(input).toHaveValue('')
      expect(screen.queryByText('Manual Error')).not.toBeInTheDocument()

      // Trigger setFields
      fireEvent.click(screen.getByText('Set Fields'))

      await waitFor(() => {
        expect(input).toHaveValue('manual_value')
        expect(screen.getByText('Manual Error')).toBeInTheDocument()
      })
    })

    it('should trigger onValuesChange when setFields is called', () => {
      const onValuesChange = jest.fn()
      const TestComponent = () => {
        const [form] = useForm()
        return (
          <Form form={form} onValuesChange={onValuesChange}>
            <FormItem name="test">
              <Input aria-label="test" />
            </FormItem>
            <button
              onClick={() =>
                form.setFields([{ name: 'test', value: 'new-value', errors: ['error'] }])
              }
            >
              Set
            </button>
          </Form>
        )
      }
      render(<TestComponent />)
      fireEvent.click(screen.getByText('Set'))
      expect(onValuesChange).toHaveBeenCalledWith(
        { test: 'new-value' },
        expect.objectContaining({ test: 'new-value' }),
      )
      expect(screen.getByLabelText('test')).toHaveValue('new-value')
      expect(screen.getByText('error')).toBeInTheDocument()
    })

    it('should trigger onValuesChange when setFieldsValue is called', () => {
      const onValuesChange = jest.fn()
      const TestComponent = () => {
        const [form] = useForm()
        return (
          <Form form={form} onValuesChange={onValuesChange}>
            <FormItem name="test">
              <Input aria-label="test" />
            </FormItem>
            <button onClick={() => form.setFieldsValue({ test: 'value2' })}>Set</button>
          </Form>
        )
      }
      render(<TestComponent />)
      fireEvent.click(screen.getByText('Set'))
      expect(onValuesChange).toHaveBeenCalledWith(
        { test: 'value2' },
        expect.objectContaining({ test: 'value2' }),
      )
    })

    it('should support isFieldsTouched', async () => {
      const TestComponent = () => {
        const [form] = useForm()
        const [, forceUpdate] = React.useState({})
        return (
          <Form form={form} onValuesChange={() => forceUpdate({})}>
            <FormItem name="username">
              <Input aria-label="username" />
            </FormItem>
            <button onClick={() => form.setFieldValue('username', 'touched')}>Touch</button>
            <div data-testid="touched-specific">
              {form.isFieldsTouched(['username']) ? 'Touched' : 'Untouched'}
            </div>
            <div data-testid="touched-all">
              {form.isFieldsTouched() ? 'Any Touched' : 'None Touched'}
            </div>
          </Form>
        )
      }
      render(<TestComponent />)
      expect(screen.getByTestId('touched-specific')).toHaveTextContent('Untouched')
      fireEvent.click(screen.getByText('Touch'))
      await waitFor(() => {
        expect(screen.getByTestId('touched-specific')).toHaveTextContent('Touched')
        expect(screen.getByTestId('touched-all')).toHaveTextContent('Any Touched')
      })
    })
  })

  describe('Accessibility', () => {
    it('should have correct ARIA attributes', () => {
      render(
        <Form>
          <FormItem label="Username" name="username">
            <Input aria-label="Username Input" />
          </FormItem>
        </Form>,
      )
      expect(screen.getByLabelText('Username Input')).toBeInTheDocument()
    })
  })

  describe('Boundary', () => {
    it('should handle undefined initialValues gracefully', () => {
      render(
        <Form initialValues={undefined}>
          <FormItem name="test">
            <Input aria-label="test" />
          </FormItem>
        </Form>,
      )
      expect(screen.getByLabelText('test')).toHaveValue('')
    })
  })

  describe('Dependencies', () => {
    it('should validate dependent field when dependency changes', async () => {
      const TestComponent = () => {
        const [form] = useForm()
        return (
          <Form form={form}>
            <FormItem name="password">
              <Input aria-label="password" />
            </FormItem>
            <FormItem
              name="confirm"
              dependencies={['password']}
              rules={[
                {
                  validator: async (_: any, value: any) => {
                    if (!value || form.getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('Passwords do not match'))
                  },
                } as any,
              ]}
            >
              <Input aria-label="confirm" />
            </FormItem>
          </Form>
        )
      }

      render(<TestComponent />)
      const passwordInput = screen.getByLabelText('password')
      const confirmInput = screen.getByLabelText('confirm')

      // Type matching passwords
      await userEvent.type(passwordInput, '123')
      await userEvent.type(confirmInput, '123')

      expect(screen.queryByText('Passwords do not match')).not.toBeInTheDocument()

      // Change password to mismatch
      await userEvent.clear(passwordInput)
      await userEvent.type(passwordInput, '1234')

      // Confirm field should re-validate and show error
      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
      })
    })
  })
})
