import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import TreeSelect from './index'
import { SelectValue } from './types'
import { InfoIcon, CheckIcon } from '../icons'

const treeData = [
  {
    key: 'parent 1',
    title: 'parent 1',
    children: [
      {
        key: 'parent 1-0',
        title: 'parent 1-0',
        children: [
          { key: 'leaf1', title: 'leaf1' },
          { key: 'leaf2', title: 'leaf2' },
        ],
      },
      {
        key: 'parent 1-1',
        title: 'parent 1-1',
        children: [{ key: 'leaf3', title: 'leaf3' }],
      },
    ],
  },
]

const physicsTreeData = [
  {
    key: 'heat',
    title: 'Heat equation',
    children: [
      {
        key: '1d-forward',
        title: '1D Forward heat equation',
        isLeaf: true,
      },
      {
        key: '1d-backward',
        title: '1D Backward heat equation',
        isLeaf: true,
      },
      {
        key: '1d-variable',
        title: '1D Forward heat equation with variable coefficient',
        isLeaf: true,
      },
      {
        key: '2d-forward',
        title: '2D Forward heat equation',
        isLeaf: true,
      },
      {
        key: '2d-backward',
        title: '2D Backward heat equation',
        isLeaf: true,
      },
    ],
  },
  {
    key: 'advection',
    title: 'Advection equation',
    children: [],
  },
  {
    key: 'black-scholes',
    title: 'Black-Scholes equation',
    children: [],
  },
]

const meta: Meta<typeof TreeSelect> = {
  title: 'Components/TreeSelect',
  component: TreeSelect,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    treeData: { control: 'object' },
    disabled: { control: 'boolean' },
    multiple: { control: 'boolean' },
    treeCheckable: { control: 'boolean' },
    showSearch: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof TreeSelect>

export const Basic: Story = {
  args: {
    treeData,
    placeholder: 'Please select',
    style: { width: 300 },
  },
}

export const Multiple: Story = {
  args: {
    treeData,
    multiple: true,
    placeholder: 'Please select multiple',
    style: { width: 300 },
  },
}

export const Checkable: Story = {
  args: {
    treeData,
    treeCheckable: true,
    placeholder: 'Please select',
    style: { width: 300 },
  },
}

export const Searchable: Story = {
  args: {
    treeData,
    showSearch: true,
    placeholder: 'Search...',
    style: { width: 300 },
  },
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<SelectValue>()
    return (
      <TreeSelect
        style={{ width: 300 }}
        value={value}
        onChange={(newValue: SelectValue) => {
          console.log('onChange', newValue)
          setValue(newValue)
        }}
        treeData={treeData}
        placeholder="Controlled mode"
      />
    )
  },
}

const chineseTreeData = [
  {
    key: '1',
    title: '嘎大哥',
    children: [
      { key: '1-1', title: '发生过' },
      { key: '1-2', title: '嘎多少' },
    ],
  },
  {
    key: '2',
    title: '发生过',
  },
  {
    key: '3',
    title: '嘎大哥',
  },
  {
    key: '4',
    title: '嘎多少',
  },
  {
    key: '5',
    title: '嘎达',
  },
]

export const ChineseSearchable: Story = {
  render: () => {
    const [value, setValue] = useState<SelectValue>()
    return (
      <div>
        <TreeSelect
          style={{ width: 300 }}
          value={value}
          onChange={(newValue: SelectValue) => {
            console.log('onChange', newValue)
            setValue(newValue)
          }}
          treeData={chineseTreeData}
          showSearch
          placeholder="输入中文测试..."
        />
        <div style={{ marginTop: 20, color: '#666' }}>当前值: {JSON.stringify(value)}</div>
      </div>
    )
  },
}

export const CustomStyle: Story = {
  render: () => {
    const [value, setValue] = useState<SelectValue>('1d-forward')
    return (
      <div
        style={{
          padding: 40,
        }}
      >
        <style>
          {`
        .custom-dark-dropdown {
          border: 1px solid #303030 !important;
          padding: 4px;
          border-radius: 8px;
          box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.32);
        }
        .custom-dark-dropdown .compass-tree-node {
          padding: 8px 12px;
          margin-bottom: 2px;
          border-radius: 4px;
          transition: all 0.2s;
        }
   
   
        .custom-node-content {
          display: flex;
          justify-content: space-between;
          width: 100%;
          align-items: center;
        }
        .custom-node-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 12px;
        }
        .circle-icon {
          width: 16px; 
          height: 16px;
          border: 1px solid rgba(255, 255, 255, 0.45);
          border-radius: 50%;
          display: block;
        }
        .check-icon {
          display: none;

          font-size: 14px;
        }
        .compass-tree-node--selected .circle-icon {
          display: none;
        }
        .compass-tree-node--selected .check-icon {
          display: block;
        }
        
   
  
        `}
        </style>
        <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span>Select type*</span>
          <span
            style={{ color: '#999', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            title="Help info"
          >
            <InfoIcon />
          </span>
        </div>

        <TreeSelect
          style={{ width: '100%' }}
          dropdownStyle={{ minWidth: 400 }}
          value={value}
          onChange={setValue}
          treeData={physicsTreeData}
          treeDefaultExpandedKeys={['heat']}
          dropdownClassName="custom-dark-dropdown"
          placeholder="Select equation type"
          showSearch={true}
          treeSelectedIcon={<CheckIcon />}
        />
      </div>
    )
  },
}
