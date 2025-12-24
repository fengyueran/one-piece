import { renderHook } from '@testing-library/react'
import { useClickAway } from './use-click-away'

describe('useClickAway', () => {
  let container: HTMLDivElement
  let outsideElement: HTMLDivElement
  let targetElement: HTMLDivElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)

    outsideElement = document.createElement('div')
    outsideElement.setAttribute('data-testid', 'outside')
    container.appendChild(outsideElement)

    targetElement = document.createElement('div')
    targetElement.setAttribute('data-testid', 'target')
    container.appendChild(targetElement)
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  it('should call handler when clicking outside', () => {
    const handler = jest.fn()
    const ref = { current: targetElement }

    renderHook(() => useClickAway(ref, handler))

    // Simulate click on outside element
    outsideElement.click()

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('should not call handler when clicking inside', () => {
    const handler = jest.fn()
    const ref = { current: targetElement }

    renderHook(() => useClickAway(ref, handler))

    // Simulate click on target element
    targetElement.click()

    expect(handler).not.toHaveBeenCalled()
  })

  it('should not call handler when clicking on child of target', () => {
    const handler = jest.fn()
    const ref = { current: targetElement }

    const childElement = document.createElement('span')
    targetElement.appendChild(childElement)

    renderHook(() => useClickAway(ref, handler))

    // Simulate click on child element
    childElement.click()

    expect(handler).not.toHaveBeenCalled()
  })
})
