import React, { useEffect } from 'react'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import useMessage from './use-message'
import { ConfigProvider } from '../index'

const HookTest = () => {
  const [msg, contextHolder] = useMessage()

  return (
    <ConfigProvider>
      {contextHolder}
      <button onClick={() => msg.info({ content: 'Message Info Obj' })}>Info Object</button>
      <button onClick={() => msg.success({ content: 'Message Success Obj' })}>
        Success Object
      </button>
      <button onClick={() => msg.error({ content: 'Message Error Obj' })}>Error Object</button>
      <button onClick={() => msg.warning({ content: 'Message Warning Obj' })}>
        Warning Object
      </button>
      <button onClick={() => msg.loading({ content: 'Message Loading Obj' })}>
        Loading Object
      </button>
      <button onClick={() => msg.open({ content: 'Message Open Obj' })}>Open Object</button>

      <button
        onClick={() => {
          msg.info('Message Info Str')
          msg.success('Message Success Str')
          msg.error('Message Error Str')
          msg.warning('Message Warning Str')
          msg.loading('Message Loading Str')
        }}
      >
        All Strings
      </button>

      <button
        onClick={() => {
          msg.open({
            content: 'Message Key Test',
            key: 'my-key',
            duration: 0,
          })
        }}
      >
        Open Key
      </button>

      <button onClick={() => msg.destroy('my-key')}>Destroy Key</button>
      <button onClick={() => msg.destroy()}>Destroy All</button>
    </ConfigProvider>
  )
}

describe('useMessage Hook', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    act(() => {
      jest.runAllTimers()
    })
    jest.useRealTimers()
  })

  it('should support object arguments for all methods', async () => {
    render(<HookTest />)

    const types = [
      { btn: 'Info Object', msg: 'Message Info Obj' },
      { btn: 'Success Object', msg: 'Message Success Obj' },
      { btn: 'Error Object', msg: 'Message Error Obj' },
      { btn: 'Warning Object', msg: 'Message Warning Obj' },
      { btn: 'Loading Object', msg: 'Message Loading Obj' },
      { btn: 'Open Object', msg: 'Message Open Obj' },
    ]

    types.forEach(({ btn, msg }) => {
      fireEvent.click(screen.getByText(btn))
      act(() => {
        jest.advanceTimersByTime(20)
      })
      expect(screen.getByText(msg)).toBeInTheDocument()
    })
  })

  it('should support string arguments for all methods', async () => {
    render(<HookTest />)
    fireEvent.click(screen.getByText('All Strings'))
    act(() => {
      jest.advanceTimersByTime(20)
    })

    expect(screen.getByText('Message Info Str')).toBeInTheDocument()
    expect(screen.getByText('Message Success Str')).toBeInTheDocument()
    expect(screen.getByText('Message Error Str')).toBeInTheDocument()
    expect(screen.getByText('Message Warning Str')).toBeInTheDocument()
    expect(screen.getByText('Message Loading Str')).toBeInTheDocument()
  })

  it('should handle manual destroy by key', async () => {
    render(<HookTest />)
    fireEvent.click(screen.getByText('Open Key'))
    act(() => {
      jest.advanceTimersByTime(20)
    })
    expect(screen.getByText('Message Key Test')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Destroy Key'))
    act(() => {
      jest.runAllTimers()
    }) // animation close

    expect(screen.queryByText('Message Key Test')).not.toBeInTheDocument()
  })

  it('should handle destroy without key (TODO check)', async () => {
    render(<HookTest />)
    fireEvent.click(screen.getByText('Open Object'))
    act(() => {
      jest.advanceTimersByTime(20)
    })
    expect(screen.getByText('Message Open Obj')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Destroy All'))
    act(() => {
      jest.runAllTimers()
    })
  })

  it('should handle open before mount (safe check)', () => {
    const TestNoHolder = () => {
      const [messageApi] = useMessage()
      useEffect(() => {
        messageApi.info('Too Early')
      }, [messageApi])
      return <div>No Holder</div>
    }
    render(<TestNoHolder />)

    // Use queryAllByText to be safe against double rendering issues, but expect 0
    const items = screen.queryAllByText('Too Early')
    expect(items.length).toBe(0)
  })
})
