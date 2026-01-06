import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Table } from './index'
import type { ColumnType } from './types'

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
表格组件，用于展示行列数据。

## 主题变量 (Design Token)

<details>
<summary>全局 Token</summary>

| Token Name | Description |
| --- | --- |
| \`colors.border\` | 边框颜色 |
| \`colors.background\` | 背景颜色 |
| \`colors.text\` | 文本颜色 |
| \`colors.backgroundSecondary\` | 表头背景色 |
| \`colors.backgroundHover\` | 悬停背景色 |

</details>
`,
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: '表格尺寸',
    },
    bordered: {
      control: 'boolean',
      description: '是否显示边框',
    },
    loading: {
      control: 'boolean',
      description: '是否加载中',
    },
  },
}

export default meta
type Story = StoryObj<typeof Table>

interface DataType {
  key: string
  name: string
  age: number
  address: string
  tags: string[]
}

const columns: ColumnType<DataType>[] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text as string}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => (
          <span
            key={tag}
            style={{
              marginRight: 8,
              padding: '2px 4px',
              border: '1px solid #d9d9d9',
              borderRadius: 2,
              fontSize: 12,
            }}
          >
            {tag.toUpperCase()}
          </span>
        ))}
      </>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <a style={{ color: '#1890ff', cursor: 'pointer' }}>Delete {record.name}</a>
    ),
  },
]

const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
]

export const Basic: Story = {
  args: {
    columns,
    dataSource: data,
  },
}

export const Small: Story = {
  args: {
    columns,
    dataSource: data,
    size: 'small',
    bordered: true,
  },
}

export const WithPagination: Story = {
  args: {
    columns,
    dataSource: Array.from({ length: 46 }).map((_, i) => ({
      key: i.toString(),
      name: `User ${i}`,
      age: 20 + (i % 30),
      address: `London Park no. ${i}`,
      tags: i % 2 === 0 ? ['nice'] : ['cool'],
    })),
    pagination: {
      total: 46,
      pageSize: 10,
      onChange: (page) => console.log('Page:', page),
    },
  },
}

export const WithSelection: Story = {
  render: () => {
    const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([])

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
      console.log('selectedRowKeys changed: ', newSelectedRowKeys)
      setSelectedRowKeys(newSelectedRowKeys)
    }

    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
    }

    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          {selectedRowKeys.length > 0 ? `Selected ${selectedRowKeys.length} items` : ''}
        </div>
        <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
      </div>
    )
  },
}

export const Loading: Story = {
  args: {
    columns,
    dataSource: [],
    loading: true,
  },
}

export const Scroll: Story = {
  args: {
    columns,
    dataSource: Array.from({ length: 100 }).map((_, i) => ({
      key: i.toString(),
      name: `User ${i}`,
      age: 20 + (i % 30),
      address: `London Park no. ${i}`,
      tags: i % 2 === 0 ? ['nice'] : ['cool'],
    })),
    scroll: { y: 240 },
  },
  parameters: {
    docs: {
      description: {
        story: '通过设置 `scroll.y` 属性，可以指定表格内容区域的高度，实现内部滚动。',
      },
    },
  },
}
