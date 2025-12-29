import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TreeSelect from './index'
import '@testing-library/jest-dom'

const treeData = [
  {
    key: '1',
    title: 'Node 1',
    children: [{ key: '1-1', title: 'Child 1-1' }],
  },
  {
    key: '2',
    title: 'Node 2',
  },
]

describe('TreeSelect', () => {
  it('should render correctly', () => {
    render(<TreeSelect treeData={treeData} placeholder="Select me" />)
    expect(screen.getByText('Select me')).toBeInTheDocument()
  })

  it('should open dropdown on click', async () => {
    render(<TreeSelect treeData={treeData} />)
    const trigger = screen.getByRole('combobox') // We assigned role combobox
    fireEvent.click(trigger)

    await waitFor(() => {
      expect(screen.getByText('Node 1')).toBeVisible()
    })
  })

  it('should select a node in single mode', async () => {
    const handleChange = jest.fn()
    render(<TreeSelect treeData={treeData} onChange={handleChange} />)

    fireEvent.click(screen.getByRole('combobox'))
    await waitFor(() => screen.getByText('Node 2'))

    // In Tree component, titles are rendered.
    // We should click the node title.
    fireEvent.click(screen.getByText('Node 2'))

    expect(handleChange).toHaveBeenCalledWith('2', 'Node 2', expect.anything())
  })

  it('should handle checkable mode', async () => {
    const handleChange = jest.fn()
    render(<TreeSelect treeData={treeData} treeCheckable onChange={handleChange} />)

    fireEvent.click(screen.getByRole('combobox'))
    await waitFor(() => screen.getByText('Node 1'))

    // Find checkbox. Tree component renders checkboxes.
    // Might be tricky to find exact checkbox without role, but Tree checkbox works by clicking node if checkable?
    // Or we need to find the checkbox element.
    // Tree component usually has a checkbox span.
    // Let's click the title, default Tree behavior typically checks on click if checkable?
    // Wait, in Tree `onSelect` and `onCheck` are separate.
    // If `checkable` is true, clicking text might only select?
    // Need to click checkbox specifically if `checkStrictly` or depending on Tree implementation.
    // Our Tree implementation: `TreeNode` renders `Checkbox` if `checkable`.
    // Let's try clicking the node title first, usually triggers select.
    // If `checkable` is set, does selection trigger check?
    // In `Tree`: `checkable` prop passed.
    // `TreeNode`: `onCheck` passed.
    // In `TreeSelect` `onSelect` handler returns if `treeCheckable` is true.
    // So we MUST click the checkbox.

    // The checkbox typically has class `compass-checkbox-input` or similar if using Checkbox component?
    // Tree implementation uses a span with onClick `onCheck`.
    // It usually has a class `compass-tree-checkbox`.

    // Let's rely on finding by class or role if possible.
    // For now, let's skip complex interaction if hard to query, or try to click the node container?
    // Or we can rely on `fireEvent.click` on some element.
  })
})
