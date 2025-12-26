import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import Tabs from './tabs'
import TabPane from './tab-pane'

describe('Tabs', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(
        <Tabs>
          <TabPane tab="Tab 1" key="1">
            Content 1
          </TabPane>
          <TabPane tab="Tab 2" key="2">
            Content 2
          </TabPane>
        </Tabs>,
      )
      expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: 'Tab 2' })).toBeInTheDocument()
      expect(screen.getByText('Content 1')).toBeVisible()
      expect(screen.queryByText('Content 2')).not.toBeVisible()
    })

    it('should render with items prop', () => {
      const items = [
        { key: '1', label: 'Tab 1', children: 'Content 1' },
        { key: '2', label: 'Tab 2', children: 'Content 2' },
      ]
      render(<Tabs items={items} />)
      expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument()
      expect(screen.getByText('Content 1')).toBeVisible()
    })
  })

  describe('Props', () => {
    it('should respect defaultActiveKey', () => {
      render(
        <Tabs defaultActiveKey="2">
          <TabPane tab="Tab 1" key="1">
            Content 1
          </TabPane>
          <TabPane tab="Tab 2" key="2">
            Content 2
          </TabPane>
        </Tabs>,
      )
      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'true')
      expect(screen.getByText('Content 2')).toBeVisible()
      expect(screen.queryByText('Content 1')).not.toBeVisible()
    })

    it('should respect activeKey (controlled)', () => {
      const { rerender } = render(
        <Tabs activeKey="1">
          <TabPane tab="Tab 1" key="1">
            Content 1
          </TabPane>
          <TabPane tab="Tab 2" key="2">
            Content 2
          </TabPane>
        </Tabs>,
      )
      expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'true')
      expect(screen.getByText('Content 1')).toBeVisible()

      rerender(
        <Tabs activeKey="2">
          <TabPane tab="Tab 1" key="1">
            Content 1
          </TabPane>
          <TabPane tab="Tab 2" key="2">
            Content 2
          </TabPane>
        </Tabs>,
      )
      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'true')
      expect(screen.getByText('Content 2')).toBeVisible()
    })

    it('should handle disabled tabs', () => {
      const handleChange = jest.fn()
      render(
        <Tabs onChange={handleChange}>
          <TabPane tab="Tab 1" key="1">
            Content 1
          </TabPane>
          <TabPane tab="Tab 2" key="2" disabled>
            Content 2
          </TabPane>
        </Tabs>,
      )
      const tab2 = screen.getByRole('tab', { name: 'Tab 2' })
      expect(tab2).toHaveAttribute('aria-disabled', 'true')

      fireEvent.click(tab2)
      expect(handleChange).not.toHaveBeenCalled()
      expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'true')
    })
  })

  describe('Interactions', () => {
    it('should call onChange and switch tab when clicked', () => {
      const handleChange = jest.fn()
      render(
        <Tabs defaultActiveKey="1" onChange={handleChange}>
          <TabPane tab="Tab 1" key="1">
            Content 1
          </TabPane>
          <TabPane tab="Tab 2" key="2">
            Content 2
          </TabPane>
        </Tabs>,
      )

      fireEvent.click(screen.getByRole('tab', { name: 'Tab 2' }))
      expect(handleChange).toHaveBeenCalledWith('2')
      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'true')
      expect(screen.getByText('Content 2')).toBeVisible()
    })
  })
})
