import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import ConfigProvider from '../config-provider'
import Tabs from './tabs'
import TabPane from './tab-pane'
import { CalendarOutlined } from '../icons'

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
选项卡切换组件。

## 何时使用

提供平级的区域将大块内容进行收纳和展现，保持界面整洁。

## 主题变量 (Design Token)

<details>
<summary>组件 Token</summary>

| Token Name | Description |
| --- | --- |
| \`components.tabs.tabBarBorderColor\` | 标签栏边框颜色 |
| \`components.tabs.tabBarBorderWidth\` | 标签栏边框宽度 |
| \`components.tabs.tabBarBackgroundColor\` | 标签栏背景色 |
| \`components.tabs.tabItemColor\` | 标签项文字颜色 |
| \`components.tabs.tabItemActiveColor\` | 激活标签项文字颜色 |
| \`components.tabs.tabItemHoverColor\` | 悬停标签项文字颜色 |
| \`components.tabs.tabItemDisabledColor\` | 禁用标签项文字颜色 |
| \`components.tabs.tabItemFontSize\` | 标签项字体大小 |
| \`components.tabs.tabItemPadding\` | 标签项内边距 (控制文字与边框距离) |
| \`components.tabs.tabItemHorizontalGutter\` | 标签项水平间距 |
| \`components.tabs.tabItemVerticalGutter\` | 标签项垂直间距 |
| \`components.tabs.inkBarColor\` | 指示条颜色 |
| \`components.tabs.inkBarHeight\` | 指示条高度 |

</details>
        `,
      },
    },
  },
  argTypes: {
    activeKey: {
      control: 'text',
      description: '当前激活 tab 面板的 key',
    },
    defaultActiveKey: {
      control: 'text',
      description: '初始化选中面板的 key，如果没有设置 activeKey',
    },
    onChange: {
      action: 'changed',
      description: '切换面板的回调',
    },
    tabPosition: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
      description: '页签位置',
    },
    type: {
      control: 'select',
      options: ['line', 'card', 'editable-card'],
      description: '页签的基本样式',
    },
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
      description: '大小',
    },
    items: {
      description: '配置选项卡内容',
    },
    className: {
      description: '自定义类名',
      control: 'text',
    },
    style: {
      description: '自定义样式',
      control: 'object',
    },
    tabBarExtraContent: {
      description: '标签栏附加内容',
      control: 'text',
    },
    onEdit: {
      description: '编辑标签的回调',
      action: 'onEdit',
    },
  },
}

export default meta
type Story = StoryObj<typeof Tabs>

const items = [
  {
    key: '1',
    label: 'Tab 1',
    children: 'Content of Tab Pane 1',
  },
  {
    key: '2',
    label: 'Tab 2',
    children: 'Content of Tab Pane 2',
  },
  {
    key: '3',
    label: 'Tab 3',
    children: 'Content of Tab Pane 3',
  },
]

export const Default: Story = {
  args: {
    defaultActiveKey: '1',
    items: items,
  },
}

export const Basic: Story = {
  render: (args) => (
    <Tabs defaultActiveKey="1" {...args}>
      <TabPane tab="Tab 1" key="1">
        Content of Tab Pane 1
      </TabPane>
      <TabPane tab="Tab 2" key="2">
        Content of Tab Pane 2
      </TabPane>
      <TabPane tab="Tab 3" key="3">
        Content of Tab Pane 3
      </TabPane>
    </Tabs>
  ),
}

export const Disabled: Story = {
  args: {
    defaultActiveKey: '1',
    items: [
      {
        key: '1',
        label: 'Tab 1',
        children: 'Content of Tab Pane 1',
      },
      {
        key: '2',
        label: 'Tab 2',
        disabled: true,
        children: 'Content of Tab Pane 2',
      },
      {
        key: '3',
        label: 'Tab 3',
        children: 'Content of Tab Pane 3',
      },
    ],
  },
}

export const CardType: Story = {
  args: {
    defaultActiveKey: '1',
    type: 'card',
    items: items,
  },
}

export const TabPositionLeft: Story = {
  args: {
    defaultActiveKey: '1',
    tabPosition: 'left',
    style: { height: 220 },
    items: Array.from({ length: 30 }).map((_, i) => ({
      key: `${i}`,
      label: `Tab-${i}`,
      children: `Content of Tab Pane ${i}`,
    })),
  },
}

export const Controlled: Story = {
  render: () => {
    const [activeKey, setActiveKey] = React.useState('1')
    return (
      <Tabs
        activeKey={activeKey}
        onChange={(key) => {
          setActiveKey(key)
        }}
        items={[
          {
            key: '1',
            label: 'Tab 1',
            children: 'Content of Tab Pane 1',
          },
          {
            key: '2',
            label: 'Tab 2',
            children: 'Content of Tab Pane 2',
          },
        ]}
      />
    )
  },
}

export const Editable: Story = {
  render: () => {
    const defaultPanes = new Array(2).fill(null).map((_, index) => {
      const id = String(index + 1)
      return { label: `Tab ${id}`, children: `Content of Tab ${id}`, key: id }
    })

    const [activeKey, setActiveKey] = React.useState(defaultPanes[0].key)
    const [items, setItems] = React.useState(defaultPanes)

    const onChange = (key: string) => {
      setActiveKey(key)
    }

    const remove = (targetKey: string) => {
      const targetIndex = items.findIndex((pane) => pane.key === targetKey)
      const newPanes = items.filter((pane) => pane.key !== targetKey)
      if (newPanes.length && targetKey === activeKey) {
        const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex]
        setActiveKey(key)
      }
      setItems(newPanes)
    }

    const onEdit = (targetKey: string, action: 'add' | 'remove') => {
      if (action === 'remove') {
        remove(targetKey)
      }
    }

    return (
      <Tabs
        type="editable-card"
        onChange={onChange}
        activeKey={activeKey}
        onEdit={onEdit}
        items={items}
      />
    )
  },
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Tabs defaultActiveKey="1" size="small" items={items} />
      <Tabs defaultActiveKey="1" size="default" items={items} />
      <Tabs defaultActiveKey="1" size="large" items={items} />
    </div>
  ),
}

export const ExtraContent: Story = {
  args: {
    defaultActiveKey: '1',
    items: items,
    tabBarExtraContent: (
      <button style={{ cursor: 'pointer', padding: '4px 8px' }}>Extra Action</button>
    ),
  },
}

export const WithIcon: Story = {
  args: {
    defaultActiveKey: '1',
    items: [
      {
        key: '1',
        label: 'Tab 1',
        icon: <CalendarOutlined />,
        children: 'Content of Tab Pane 1',
      },
      {
        key: '2',
        label: 'Tab 2',
        children: 'Content of Tab Pane 2',
      },
    ],
  },
}

export const Closable: Story = {
  args: {
    defaultActiveKey: '1',
    type: 'editable-card',
    items: [
      {
        key: '1',
        label: 'Tab 1',
        children: 'Content of Tab Pane 1',
        closable: false,
      },
      {
        key: '2',
        label: 'Tab 2',
        children: 'Content of Tab Pane 2',
      },
    ],
  },
}

export const CustomStyle: Story = {
  args: {
    defaultActiveKey: '1',
    items: items,
    className: 'custom-tabs-class',
    style: {
      border: '1px solid #e8e8e8',
      padding: '16px',
      borderRadius: '8px',
      backgroundColor: '#f5f5f5',
    },
  },
  parameters: {
    docs: {
      description: {
        story: '自定义样式和类名',
      },
    },
  },
}

export const CustomTheme: Story = {
  render: (args) => (
    <ConfigProvider
      theme={{
        token: {
          components: {
            tabs: {
              tabItemActiveColor: '#722ed1',
              inkBarColor: '#722ed1',
              tabItemHorizontalGutter: '50px',
              tabItemPadding: '12px 30px',
              inkBarHeight: '4px',
            },
          },
        },
      }}
    >
      <Tabs defaultActiveKey="1" {...args} items={items} />
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
