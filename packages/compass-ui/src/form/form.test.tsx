import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Form } from './form'
import { FormItem } from './form-item'
import { useForm } from './form-context'
import userEvent from '@testing-library/user-event'

interface MockInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // eslint-disable-next-line react/require-default-props
  value?: string | number | readonly string[]
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

const Input = ({ value, onChange, ...props }: MockInputProps) => (
  <input value={value || ''} onChange={(e) => onChange?.(e)} {...props} />
)

describe('Form', () => {
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

  it('should set initial values', () => {
    render(
      <Form initialValues={{ username: 'admin' }}>
        <FormItem label="Username" name="username">
          <Input />
        </FormItem>
      </Form>,
    )
    // initialValues are applied via effect + store update
    return waitFor(() => {
      expect(screen.getByRole('textbox')).toHaveValue('admin')
    })
  })

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

  it('should validate required fields', async () => {
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

  it('should call onFinish when validation passes', async () => {
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

    // Trigger validation again (onChange or blur depending on trigger, here assuming default)
    // Note: async-validator validation on change might happen,
    // but in our implementation we trigger validation on change if rules exist

    await waitFor(() => {
      expect(screen.queryByText('Invalid email')).not.toBeInTheDocument()
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

    const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />

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
    // Force a parent rerender (simulates Storybook/docs rerender behavior)
    fireEvent.click(screen.getByText(/Rerender/))

    fireEvent.click(screen.getByText('Submit'))

    await waitFor(() => {
      expect(onFinish).toHaveBeenCalledWith({ username: 'admin', password: '111' })
    })
  })
})
