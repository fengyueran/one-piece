import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Pagination from './index'
import { PaginationProps } from './types'
import ConfigProvider from '../config-provider'

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  argTypes: {
    current: {
      control: 'number',
      description: '当前页数',
    },
    defaultCurrent: {
      control: 'number',
      description: '默认的当前页数',
    },
    total: {
      control: 'number',
      description: '数据总数',
    },
    pageSize: {
      control: 'number',
      description: '每页条数',
    },
    defaultPageSize: {
      control: 'number',
      description: '默认的每页条数',
    },
    onChange: {
      description: '页码或 pageSize 改变的回调',
    },
    disabled: {
      control: 'boolean',
      description: '禁用分页',
    },
    showSizeChanger: {
      control: 'boolean',
      description: '是否展示 pageSize 切换器',
    },
    pageSizeOptions: {
      description: '指定每页可以显示多少条',
    },
    showQuickJumper: {
      control: 'boolean',
      description: '是否可以快速跳转至某页',
    },
    showTotal: {
      description: '用于显示数据总量和当前数据范围',
    },
    simple: {
      control: 'boolean',
      description: '是否使用简单模式',
    },
    size: {
      control: 'radio',
      options: ['default', 'small'],
      description: '当为 small 时，是小尺寸分页',
    },
    totalAlign: {
      control: 'radio',
      options: ['left', 'right'],
      description: '指定总数文字的对齐方式',
    },
    className: {
      description: '自定义类名',
    },
    style: {
      description: '自定义样式',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
分页组件。当数据量过多时，使用分页分解数据。

## 主题变量 (Design Token)

<details>
<summary>组件 Token</summary>

| Token Name | Description | Default |
| --- | --- | --- |
| \`components.pagination.itemSize\` | 页码按钮大小 | 32px |
| \`components.pagination.fontSize\` | 字体大小 | 14px |
| \`components.pagination.itemBg\` | 按钮背景色 | #ffffff |
| \`components.pagination.itemActiveBg\` | 选中项背景色 | #ffffff |
| \`components.pagination.itemBorderRadius\` | 按钮圆角 | 4px |
| \`components.pagination.itemColor\` | 按钮文字颜色 | rgba(0, 0, 0, 0.88) |
| \`components.pagination.itemActiveColor\` | 选中项文字颜色 | #1890ff |
| \`components.pagination.itemHoverColor\` | 悬停文字颜色 | #1890ff |
| \`components.pagination.itemHoverBg\` | 悬停背景色 | - |

</details>

<details>
<summary>全局 Token</summary>

| Token Name | Description |
| --- | --- |
| \`colors.primary\` | 主色调 |
| \`colors.border\` | 边框颜色 |
| \`colors.primaryHover\` | 主色调悬停 |

</details>
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Pagination>

export const Basic: Story = {
  args: {
    total: 50,
  },
}

export const MorePages: Story = {
  args: {
    defaultCurrent: 6,
    total: 500,
  },
}

export const ShowSizeChanger: Story = {
  args: {
    total: 500,
    showSizeChanger: true,
  },
}

export const Mini: Story = {
  args: {
    size: 'small',
    total: 50,
    showSizeChanger: true,
  },
}

export const Controlled: Story = {
  args: {
    total: 50,
    current: 3,
  },
  render: (args: PaginationProps) => {
    const [current, setCurrent] = React.useState(3)
    const onChange = (page: number) => {
      console.log('Page:', page)
      setCurrent(page)
    }
    return <Pagination {...args} current={current} onChange={onChange} />
  },
  parameters: {
    docs: {
      description: {
        story: '受控模式：通过 `current` 和 `onChange` 控制当前页码。',
      },
      source: {
        code: `const App = () => {
  const [current, setCurrent] = React.useState(3);

  const onChange = (page: number) => {
    console.log('Page:', page);
    setCurrent(page);
  };

  return <Pagination current={current} onChange={onChange} total={50} />;
};`,
      },
    },
  },
}

export const ShowTotal: Story = {
  args: {
    total: 85,
    pageSize: 20,
    defaultCurrent: 1,
  },
  render: (args) => (
    <Pagination
      {...args}
      showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: '通过 `showTotal` 属性显示总数和当前数据范围。',
      },
    },
  },
}

export const ShowTotalRight: Story = {
  args: {
    total: 85,
    pageSize: 20,
    defaultCurrent: 1,
    totalAlign: 'right',
  },
  render: (args) => (
    <Pagination
      {...args}
      showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: '通过 `totalAlign="right"` 将总数显示在右侧。',
      },
    },
  },
}

export const ShowQuickJumper: Story = {
  args: {
    total: 500,
    showQuickJumper: true,
  },
}

export const Disabled: Story = {
  args: {
    total: 50,
    disabled: true,
    showSizeChanger: true,
    showQuickJumper: true,
  },
  parameters: {
    docs: {
      description: {
        story: '**禁用状态** - 设置 `disabled` 属性来禁用分页导航。',
      },
    },
  },
}

export const Simple: Story = {
  args: {
    total: 50,
    simple: true,
  },
  parameters: {
    docs: {
      description: {
        story: '**简单模式** - 设置 `simple` 属性启用简单模式，适用于空间有限的场景。',
      },
    },
  },
}

export const DefaultValues: Story = {
  args: {
    total: 500,
    defaultCurrent: 20,
    defaultPageSize: 20,
  },
  parameters: {
    docs: {
      description: {
        story: '**默认值** - 通过 `defaultCurrent` 和 `defaultPageSize` 设置初始选中页和每页条数。',
      },
    },
  },
}

export const PageSizeOptions: Story = {
  args: {
    total: 500,
    showSizeChanger: true,
    pageSizeOptions: [20, 40, 60, 80],
    defaultPageSize: 40,
    onChange: (page, pageSize) => console.log(page, pageSize),
  },
  parameters: {
    docs: {
      description: {
        story: '**自定义页大小选项** - 通过 `pageSizeOptions` 自定义每页显示条数的选项列表。',
      },
    },
  },
}

export const CustomStyle: Story = {
  args: {
    total: 50,
    className: 'custom-pagination-class',
    style: {
      backgroundColor: '#f5f5f5',
      padding: '10px',
      borderRadius: '4px',
    },
  },
  parameters: {
    docs: {
      description: {
        story: '**自定义样式** - 支持 `className` 和 `style` 属性进行样式覆盖。',
      },
    },
  },
}

export const CustomTheme: Story = {
  args: {
    total: 50,
    current: 1,
  },
  render: (args: PaginationProps) => (
    <ConfigProvider
      theme={{
        components: {
          pagination: {
            itemSize: '40px',
            itemActiveBg: '#e6f7ff',
            itemActiveColor: '#1890ff',
            itemBorderRadius: '50%',
            fontSize: '16px',
            itemHoverColor: '#40a9ff',
          },
        },
      }}
    >
      <Pagination {...args} />
    </ConfigProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '**自定义主题** - 通过 ConfigProvider 覆盖主题变量。例如将页码按钮设为圆形，增大尺寸。',
      },
    },
  },
}
