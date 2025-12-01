import type { Meta, StoryObj } from '@storybook/react'
import { message } from './index'
import Button from '../button'

const meta: Meta = {
  title: 'Feedback/Message',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

export const Basic: Story = {
  render: () => (
    <Button onClick={() => message.info('This is a normal message')}>Display normal message</Button>
  ),
}

export const Types: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Button onClick={() => message.success('This is a success message')}>Success</Button>
      <Button onClick={() => message.error('This is an error message')}>Error</Button>
      <Button onClick={() => message.warning('This is a warning message')}>Warning</Button>
    </div>
  ),
}

export const Loading: Story = {
  render: () => (
    <Button onClick={() => message.loading('Action in progress..', 2.5)}>
      Display loading indicator
    </Button>
  ),
}

export const CustomDuration: Story = {
  render: () => (
    <Button onClick={() => message.info('This message will stay for 10 seconds', 10)}>
      Customized display duration
    </Button>
  ),
}
