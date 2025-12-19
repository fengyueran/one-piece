import type { Meta, StoryObj } from '@storybook/react'
import Menu from './menu'
import ConfigProvider from '../config-provider'
import { SearchIcon, CloseIcon } from '../icons'

const meta: Meta<typeof Menu> = {
  title: 'Components/Menu',
  component: Menu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
菜单组件。

## 何时使用
- 结合 Dropdown 组件使用，作为下拉菜单的内容。
- 提供标准化的菜单项样式和交互。

## 主题变量 (Design Token)

<details>
<summary>组件 Token</summary>

| Token Name | Description |
| --- | --- |
| \`components.menu.itemHoverBg\` | 悬停背景色 |
| \`components.menu.itemColor\` | 文字颜色 |
| \`components.menu.itemHeight\` | 菜单项高度 |
| \`components.menu.itemPadding\` | 菜单项内边距 |
| \`components.menu.fontSize\` | 字体大小 |
| \`components.menu.borderRadius\` | 菜单项圆角 |

</details>

<details>
<summary>全局 Token</summary>

| Token Name | Description |
| --- | --- |
| \`colors.error\` | 错误色 (用于危险项) |
| \`colors.text\` | 默认文字颜色 |

</details>
        `,
      },
    },
  },
  argTypes: {
    items: {
      control: 'object',
      description: '菜单项配置 (数据驱动)',
      table: {
        type: {
          summary: 'ItemType[]',
          detail: `interface ItemType {
  /** 唯一标识 */
  key: string | number
  /** 菜单项内容 */
  label: ReactNode
  /** 图标元素 */
  icon?: ReactNode
  /** 是否禁用 */
  disabled?: boolean
  /** 危险状态 */
  danger?: boolean
  /** 点击事件 */
  onClick?: (e: React.MouseEvent) => void
  /** 自定义类名 */
  className?: string
  /** 自定义样式 */
  style?: React.CSSProperties
}`,
        },
      },
    },
    children: {
      control: 'text',
      description: '菜单内容 (JSX)',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    className: {
      control: 'text',
      description: '自定义类名',
    },
    style: {
      control: 'object',
      description: '自定义样式',
    },
  },
}

export default meta
type Story = StoryObj<typeof Menu>

export const Basic: Story = {
  render: () => (
    <div style={{ width: 200, border: '1px solid #eee' }}>
      <Menu>
        <Menu.Item>Menu Item 1</Menu.Item>
        <Menu.Item>Menu Item 2</Menu.Item>
        <Menu.Item>Menu Item 3</Menu.Item>
      </Menu>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '**基本用法** - 最简单的菜单列表。',
      },
    },
  },
}

export const WithIcons: Story = {
  render: () => (
    <div style={{ width: 200, border: '1px solid #eee' }}>
      <Menu>
        <Menu.Item icon={<SearchIcon />}>Search</Menu.Item>
        <Menu.Item icon={<CloseIcon />}>Close</Menu.Item>
      </Menu>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '**带图标** - 通过 `icon` 属性添加图标。',
      },
    },
  },
}

export const Disabled: Story = {
  render: () => (
    <div style={{ width: 200, border: '1px solid #eee' }}>
      <Menu>
        <Menu.Item>Active Item</Menu.Item>
        <Menu.Item disabled>Disabled Item</Menu.Item>
        <Menu.Item disabled icon={<SearchIcon />}>
          Disabled with Icon
        </Menu.Item>
      </Menu>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '**禁用状态** - 设置 `disabled` 属性可禁用菜单项。',
      },
    },
  },
}

export const Danger: Story = {
  render: () => (
    <div style={{ width: 200, border: '1px solid #eee' }}>
      <Menu>
        <Menu.Item>Normal Item</Menu.Item>
        <Menu.Item danger>Delete</Menu.Item>
        <Menu.Item danger icon={<CloseIcon />}>
          Delete with Icon
        </Menu.Item>
      </Menu>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '**危险项** - 设置 `danger` 属性表示危险操作。',
      },
    },
  },
}

export const Styled: Story = {
  render: () => (
    <div style={{ width: 200 }}>
      <Menu style={{ border: '2px dashed #1890ff', padding: 8 }} className="custom-menu">
        <Menu.Item className="custom-menu-item">Styled Menu</Menu.Item>
        <Menu.Item style={{ color: 'red', fontWeight: 'bold' }}>Styled Item</Menu.Item>
      </Menu>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '**自定义样式** - 支持 `className` 和 `style` 属性自定义样式。',
      },
    },
  },
}

export const Interactive: Story = {
  render: () => (
    <div style={{ width: 200, border: '1px solid #eee' }}>
      <Menu>
        <Menu.Item onClick={() => alert('Clicked Item 1')}>Click Me (Alert)</Menu.Item>
        <Menu.Item onClick={(e: React.MouseEvent) => console.log('Clicked Item 2', e)}>
          Click Me (Log)
        </Menu.Item>
      </Menu>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '**交互** - 支持 `onClick` 事件处理。',
      },
    },
  },
}

export const ChildrenContent: Story = {
  render: () => (
    <div style={{ width: 200, border: '1px solid #eee' }}>
      <Menu>
        <div style={{ padding: '8px 12px', color: '#999', fontSize: '12px' }}>Group Title</div>
        <Menu.Item>Item 1</Menu.Item>
        <Menu.Item>Item 2</Menu.Item>
        <div style={{ borderTop: '1px solid #eee', margin: '4px 0' }} />
        <Menu.Item>Item 3</Menu.Item>
      </Menu>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '**自定义内容** - `children` 属性支持任意 React 节点，可用于添加分组标题或分割线。',
      },
    },
  },
}

export const DataDriven: Story = {
  args: {
    items: [
      { key: '1', label: 'Menu Item 1' },
      {
        key: '2',
        label: 'Menu Item 2 (Disabled)',
        disabled: true,
        icon: <span style={{ marginRight: 8 }}>😊</span>,
      },
      { key: '3', label: 'Menu Item 3 (Danger)', danger: true },
      {
        key: '4',
        label: (
          <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
            Link Item
          </a>
        ),
      },
    ],
  },
  render: (args) => (
    <div style={{ width: 200, border: '1px solid #eee' }}>
      <Menu {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '**数据驱动** - 通过 `items` 属性配置菜单项，支持 `key`, `label`, `icon`, `disabled`, `danger` 等属性。',
      },
    },
  },
}

export const CustomTheme: Story = {
  render: () => (
    <ConfigProvider
      theme={{
        token: {
          components: {
            menu: {
              itemHoverBg: '#e6f7ff',
              itemColor: '#1890ff',
              borderRadius: '8px',
            },
          },
        },
      }}
    >
      <div style={{ width: 200, border: '1px solid #eee' }}>
        <Menu>
          <Menu.Item>Custom Theme Item 1</Menu.Item>
          <Menu.Item>Custom Theme Item 2</Menu.Item>
        </Menu>
      </div>
    </ConfigProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: '**自定义主题** - 通过 ConfigProvider 覆盖主题变量',
      },
    },
  },
}
