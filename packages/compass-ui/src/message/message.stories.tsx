import type { Meta, StoryObj } from '@storybook/react'
import message from './index'
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
      <Button onClick={() => message.info('This is a normal message')}>Info</Button>
      <Button onClick={() => message.success('This is a success message')}>Success</Button>
      <Button onClick={() => message.error('This is an error message')}>Error</Button>
      <Button onClick={() => message.warning('This is a warning message')}>Warning</Button>
      <Button onClick={() => message.loading('This is a loading message')}>Loading</Button>
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

export const LongText: Story = {
  render: () => (
    <Button
      onClick={() =>
        message.info(
          'This is a very long message that should demonstrate how the component handles large amounts of text. It might wrap to multiple lines or expand the container width depending on the implementation. We want to ensure it looks good and readable even with verbose content like this.',
        )
      }
    >
      Display long message
    </Button>
  ),
}
