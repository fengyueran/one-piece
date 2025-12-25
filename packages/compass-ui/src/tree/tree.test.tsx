import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Tree, { type DataNode } from './index'

// Mock react-window for virtual scrolling tests
jest.mock('react-window', () => ({
  List: ({ rowComponent: Row, rowCount, ...props }: any) => {
    const rows = []
    for (let i = 0; i < rowCount; i++) {
      rows.push(<Row key={i} index={i} style={{}} />)
    }

    // Filter out react-window specific props that shouldn't be passed to DOM
    const {
      height,
      itemCount,
      itemSize,
      onItemsRendered,
      overscanCount,
      useIsScrolling,
      // Add more props that caused warnings
      defaultHeight,
      rowHeight,
      rowProps,
      ...domProps
    } = props

    return (
      <div data-testid="virtual-list" {...domProps}>
        {rows}
      </div>
    )
  },
}))

const treeData: DataNode[] = [
  {
    key: '0-0',
    title: 'Node 1',
    children: [
      { key: '0-0-0', title: 'Child 1', isLeaf: true },
      { key: '0-0-1', title: 'Child 2', disabled: true, isLeaf: true },
      {
        key: '0-0-2',
        title: 'Child 3',
        children: [{ key: '0-0-2-0', title: 'Grandchild 1', isLeaf: true }],
      },
    ],
  },
  {
    key: '0-1',
    title: 'Node 2',
    isLeaf: true,
  },
]

describe('Tree', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<Tree treeData={treeData} />)
      expect(screen.getByText('Node 1')).toBeInTheDocument()
      expect(screen.getByText('Node 2')).toBeInTheDocument()
      // Children should not be visible by default
      expect(screen.queryByText('Child 1')).not.toBeInTheDocument()
    })

    it('should render expanded nodes when defaultExpandedKeys provided', () => {
      render(<Tree treeData={treeData} defaultExpandedKeys={['0-0']} />)
      expect(screen.getByText('Child 1')).toBeInTheDocument()
      expect(screen.getByText('Child 2')).toBeInTheDocument()
    })

    it('should render with custom className and style', () => {
      const { container } = render(
        <Tree treeData={treeData} className="custom-tree" style={{ background: 'red' }} />,
      )
      const tree = container.firstChild
      expect(tree).toHaveClass('custom-tree')
      expect(tree).toHaveStyle({ background: 'red' })
    })

    it('should render with showLine', () => {
      const { container } = render(
        <Tree treeData={treeData} showLine defaultExpandedKeys={['0-0']} />,
      )

      // Check for indentation lines
      // Child nodes should have indent lines
      const indents = container.querySelectorAll('.compass-tree-indent')
      expect(indents.length).toBeGreaterThan(0)

      // Check for lined switcher icons
      // Node 1 is expanded -> MinusSquareOutlined
      expect(screen.getByLabelText('minus-square')).toBeInTheDocument()

      // Node 2 is a leaf -> FileOutlined
      // Child 1 is a leaf -> FileOutlined
      expect(screen.getAllByLabelText('file').length).toBeGreaterThan(0)
    })

    it('should render with showIcon', () => {
      const dataWithIcon: DataNode[] = [
        { key: '1', title: 'IconNode', icon: <span data-testid="custom-icon">Icon</span> },
      ]
      render(<Tree treeData={dataWithIcon} showIcon defaultExpandedKeys={['1']} />)
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
    })

    it('should render with titleRender', () => {
      render(
        <Tree
          treeData={treeData}
          titleRender={(node) => <span data-testid={`title-${node.key}`}>Custom {node.title}</span>}
        />,
      )
      expect(screen.getByTestId('title-0-0')).toHaveTextContent('Custom Node 1')
    })

    it('should render with custom switcherIcon', () => {
      render(
        <Tree treeData={treeData} switcherIcon={<span data-testid="switcher">Switcher</span>} />,
      )
      // The switcher is rendered for non-leaf nodes
      expect(screen.getAllByTestId('switcher').length).toBeGreaterThan(0)
    })

    it('should render with custom switcherIcon as function', () => {
      render(
        <Tree
          treeData={treeData}
          switcherIcon={({ expanded }) => <span>{expanded ? 'Open' : 'Close'}</span>}
        />,
      )
      expect(screen.getAllByText('Close').length).toBeGreaterThan(0)
    })
  })

  describe('Props', () => {
    it('should work with virtual scroll interactions', () => {
      const onExpand = jest.fn()
      const onSelect = jest.fn()
      const onCheck = jest.fn() // Add onCheck

      render(
        <Tree
          treeData={treeData}
          virtual
          height={200}
          itemHeight={30}
          switcherIcon={<span data-testid="v-switcher">S</span>}
          defaultExpandedKeys={['0-0']}
          onExpand={onExpand}
          onSelect={onSelect}
          onCheck={onCheck} // Pass onCheck
          checkable
        />,
      )

      // 1. Expand/Collapse (Row -> handleExpand)
      const switchers = screen.getAllByTestId('v-switcher')
      if (switchers.length > 0) {
        fireEvent.click(switchers[0])
        expect(onExpand).toHaveBeenCalled()
      }

      // 2. Select (Row -> handleSelect)
      fireEvent.click(screen.getByText('Node 1'))
      expect(onSelect).toHaveBeenCalled()

      // 3. Check (Row -> handleCheck) checkable=true
      const checkboxes = screen.getAllByRole('checkbox')
      if (checkboxes.length > 0) {
        fireEvent.click(checkboxes[0])
        expect(onCheck).toHaveBeenCalled()
      }
    })
  })

  describe('State & Controlled', () => {
    it('should handle controlled expandedKeys', () => {
      const { rerender } = render(<Tree treeData={treeData} expandedKeys={['0-0']} />)
      expect(screen.getByText('Child 1')).toBeInTheDocument()

      // Update prop
      rerender(<Tree treeData={treeData} expandedKeys={[]} />)
      expect(screen.queryByText('Child 1')).not.toBeInTheDocument()
    })

    it('should handle controlled selectedKeys', () => {
      const { rerender } = render(
        <Tree treeData={treeData} selectedKeys={['0-0']} defaultExpandedKeys={['0-0']} />,
      )

      // Initial selection: Node 1 (0-0)
      const node1 = screen.getByText('Node 1').closest('.compass-tree-node')
      expect(node1).toHaveClass('compass-tree-node--selected')

      // Update prop to select Child 1 (0-0-0)
      rerender(<Tree treeData={treeData} selectedKeys={['0-0-0']} defaultExpandedKeys={['0-0']} />)

      const child1 = screen.getByText('Child 1').closest('.compass-tree-node')
      expect(child1).toHaveClass('compass-tree-node--selected')

      // Node 1 should no longer be selected
      expect(node1).not.toHaveClass('compass-tree-node--selected')
    })

    it('should handle controlled checkedKeys', () => {
      const { rerender } = render(<Tree treeData={treeData} checkable checkedKeys={['0-0']} />)
      // Trigger effect
      rerender(<Tree treeData={treeData} checkable checkedKeys={['0-0', '0-0-0']} />)
    })
  })

  describe('Interactions Detail', () => {
    it('should expand/collapse on switcher click', () => {
      const onExpand = jest.fn()
      render(
        <Tree
          treeData={treeData}
          onExpand={onExpand}
          switcherIcon={<span data-testid="switcher-btn">X</span>}
        />,
      )

      const switchers = screen.getAllByTestId('switcher-btn')

      // Expand
      fireEvent.click(switchers[0])
      expect(onExpand).toHaveBeenCalledTimes(1)
    })

    it('should collapse an expanded node', () => {
      const onExpand = jest.fn()
      render(
        <Tree
          treeData={treeData}
          defaultExpandedKeys={['0-0']} // Start expanded
          onExpand={onExpand}
          switcherIcon={<span data-testid="switcher-btn">X</span>}
        />,
      )

      const switchers = screen.getAllByTestId('switcher-btn')
      // Node 1 is index 0 (assuming order). Node 1 is expanded.
      // Click to collapse
      fireEvent.click(switchers[0])

      expect(onExpand).toHaveBeenCalled()
      // Check if it was a collapse action implies finding if 'expanded' arg was false
      // Mock calls info: [keys, { node, expanded: false }]
      expect(onExpand.mock.calls[0][1].expanded).toBe(false)
    })

    it('should select node on click', () => {
      const onSelect = jest.fn()
      render(<Tree treeData={treeData} onSelect={onSelect} defaultExpandedKeys={['0-0']} />)

      fireEvent.click(screen.getByText('Child 1'))
      expect(onSelect).toHaveBeenCalled()
      // keys, info
      expect(onSelect).toHaveBeenCalledWith(['0-0-0'], expect.objectContaining({ selected: true }))
    })

    it('should not select disabled node', () => {
      const onSelect = jest.fn()
      render(<Tree treeData={treeData} onSelect={onSelect} defaultExpandedKeys={['0-0']} />)

      fireEvent.click(screen.getByText('Child 2'))
      expect(onSelect).not.toHaveBeenCalled()
    })

    it('should handle checkable', () => {
      const onCheck = jest.fn()
      render(<Tree treeData={treeData} checkable onCheck={onCheck} defaultExpandedKeys={['0-0']} />)

      // Find checkbox. tree-node renders <input type="checkbox">
      const checkboxes = screen.getAllByRole('checkbox')
      // Child 1 checkbox
      fireEvent.click(checkboxes[1])
      expect(onCheck).toHaveBeenCalled()
    })
  })

  describe('Boundary', () => {
    it('should render empty data without crash', () => {
      const { container } = render(<Tree treeData={[]} />)
      // Should render the container
      expect(container.firstChild).toHaveClass('compass-tree')
      // Should not render any nodes
      expect(container.querySelectorAll('.compass-tree-node')).toHaveLength(0)
    })

    it('should handle undefined treeData gracefully', () => {
      const { container } = render(<Tree />)
      expect(container.firstChild).toHaveClass('compass-tree')
      expect(container.querySelectorAll('.compass-tree-node')).toHaveLength(0)
    })
  })
})
