import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Dropdown from './dropdown'
import Button from '../button'
import ConfigProvider from '../config-provider'
import Menu from '../menu'

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
下拉菜单组件。

## 何时使用
- 当页面上的操作命令过多时，用此组件收纳操作元素。
- 点击或移入触点，会出现一个下拉菜单。可在列表中进行选择，并执行相应的命令。

## 主题变量 (Design Token)

<details>
<summary>组件 Token</summary>

| Token Name | Description |
| --- | --- |
| \`components.dropdown.zIndex\` | 下拉菜单层级 |
| \`components.dropdown.backgroundColor\` | 背景颜色 |
| \`components.dropdown.boxShadow\` | 阴影 |
| \`components.dropdown.borderRadius\` | 圆角 |
| \`components.dropdown.padding\` | 内边距 |

</details>

<details>
<summary>全局 Token</summary>

| Token Name | Description |
| --- | --- |
| \`colors.primary\` | 主色调 (用于选中项等) |
| \`shadows.lg\` | 大阴影 (默认阴影值参考) |

</details>
        `,
      },
    },
  },
  argTypes: {
    trigger: {
      control: 'select',
      options: ['hover', 'click'],
      description: '触发方式',
      table: {
        type: { summary: "'hover' | 'click'" },
        defaultValue: { summary: "'hover'" },
      },
    },
    placement: {
      control: 'select',
      options: [
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end',
        'right',
        'right-start',
        'right-end',
      ],
      description: '菜单弹出位置',
      table: {
        type: {
          summary:
            "'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'",
        },
        defaultValue: { summary: "'bottom-start'" },
      },
    },
    visible: {
      control: 'boolean',
      description: '菜单是否显示（受控）',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    overlay: {
      control: false,
      description: '下拉菜单内容',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    menu: {
      control: 'object',
      description:
        '菜单配置 (数据驱动)，详见 <a href="./?path=/docs/components-menu--docs" target="_top">Menu 组件</a>',
      table: {
        type: { summary: 'MenuProps' },
      },
    },
    children: {
      control: false,
      description: '触发元素',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Dropdown>

const MenuContent = (
  <Menu style={{ minWidth: 120 }}>
    <Menu.Item>Menu Item 1</Menu.Item>
    <Menu.Item>Menu Item 2</Menu.Item>
    <Menu.Item>Menu Item 3</Menu.Item>
  </Menu>
)

const items = [
  { key: '1', label: 'Menu Item 1' },
  { key: '2', label: 'Menu Item 2' },
  { key: '3', label: 'Menu Item 3 (Disabled)', disabled: true },
]

const onMenuClick = (e: React.MouseEvent, key?: string | number) => {
  alert(`Menu clicked! Key: ${key}`)
}

// export const Basic: Story = {
//   args: {
//     menu: {
//       items,
//       onClick: onMenuClick,
//     },
//     children: <Button>Basic</Button>,
//   },
//   parameters: {
//     docs: {
//       description: {
//         story:
//           '**数据驱动** - 通过 `menu` 属性配置菜单，支持传递 `MenuProps`（包含 `items`, `onClick` 等）。',
//       },
//     },
//   },
// }

// export const ClickTrigger: Story = {
//   args: {
//     trigger: 'click',
//     overlay: MenuContent,
//     children: <Button>Click me</Button>,
//   },
//   parameters: {
//     docs: {
//       description: {
//         story: '**点击触发** - 设置 `trigger="click"` 可改为点击触发。',
//       },
//     },
//   },
// }

// export const Controlled: Story = {
//   render: () => {
//     const [visible, setVisible] = React.useState(false)
//     return (
//       <Dropdown
//         visible={visible}
//         onVisibleChange={setVisible}
//         overlay={MenuContent}
//         trigger="click"
//       >
//         <Button>Controlled ({visible ? 'Open' : 'Closed'})</Button>
//       </Dropdown>
//     )
//   },
//   parameters: {
//     docs: {
//       description: {
//         story: '**受控模式** - 通过 `visible` 和 `onVisibleChange` 属性完全控制菜单的显示状态。',
//       },
//     },
//   },
// }

export const OnVisibleChange: Story = {
  render: () => (
    <Dropdown
      onVisibleChange={(visible) => console.log('Visibility changed:', visible)}
      overlay={MenuContent}
    >
      <Button>Check Console</Button>
    </Dropdown>
  ),
  parameters: {
    docs: {
      description: {
        story: '**回调函数** - `onVisibleChange` 在显示状态改变时触发。',
      },
    },
  },
}

// export const Disabled: Story = {
//   args: {
//     disabled: true,
//     overlay: MenuContent,
//     children: <Button>Disabled</Button>,
//   },
//   parameters: {
//     docs: {
//       description: {
//         story: '**禁用状态** - 设置 `disabled` 属性可禁用下拉菜单。',
//       },
//     },
//   },
// }

// export const Styled: Story = {
//   args: {
//     overlay: MenuContent,
//     children: <Button>Styled Dropdown</Button>,
//     className: 'custom-dropdown',
//     style: { border: '2px solid red', display: 'inline-block' },
//   },
//   parameters: {
//     docs: {
//       description: {
//         story: '**自定义样式** - 支持 `className` 和 `style` 属性自定义触发器样式。',
//       },
//     },
//   },
// }

// export const CustomOverlay: Story = {
//   args: {
//     overlay: (
//       <div
//         style={{
//           padding: 12,
//           background: '#fff',
//           boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
//           borderRadius: 4,
//         }}
//       >
//         <p style={{ margin: '0 0 8px' }}>Custom Content</p>
//         <Button size="small">Action</Button>
//       </div>
//     ),
//     children: <Button>Custom Overlay</Button>,
//   },
//   parameters: {
//     docs: {
//       description: {
//         story: '**自定义 Overlay** - `overlay` 属性接受任意 React 节点，不局限于 Menu 组件。',
//       },
//     },
//   },
// }

// export const Placements: Story = {
//   render: () => (
//     <div style={{ padding: '50px' }}>
//       <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', marginLeft: '70px' }}>
//         <Dropdown placement="top-start" overlay={MenuContent}>
//           <Button>TL</Button>
//         </Dropdown>
//         <Dropdown placement="top" overlay={MenuContent}>
//           <Button>Top</Button>
//         </Dropdown>
//         <Dropdown placement="top-end" overlay={MenuContent}>
//           <Button>TR</Button>
//         </Dropdown>
//       </div>
//       <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '70px' }}>
//           <Dropdown placement="left-start" overlay={MenuContent}>
//             <Button>LT</Button>
//           </Dropdown>
//           <Dropdown placement="left" overlay={MenuContent}>
//             <Button>Left</Button>
//           </Dropdown>
//           <Dropdown placement="left-end" overlay={MenuContent}>
//             <Button>LB</Button>
//           </Dropdown>
//         </div>
//         <div style={{ width: '180px' }}></div>
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '70px' }}>
//           <Dropdown placement="right-start" overlay={MenuContent}>
//             <Button>RT</Button>
//           </Dropdown>
//           <Dropdown placement="right" overlay={MenuContent}>
//             <Button>Right</Button>
//           </Dropdown>
//           <Dropdown placement="right-end" overlay={MenuContent}>
//             <Button>RB</Button>
//           </Dropdown>
//         </div>
//       </div>
//       <div style={{ display: 'flex', gap: '20px', marginLeft: '70px' }}>
//         <Dropdown placement="bottom-start" overlay={MenuContent}>
//           <Button>BL</Button>
//         </Dropdown>
//         <Dropdown placement="bottom" overlay={MenuContent}>
//           <Button>Bottom</Button>
//         </Dropdown>
//         <Dropdown placement="bottom-end" overlay={MenuContent}>
//           <Button>BR</Button>
//         </Dropdown>
//       </div>
//     </div>
//   ),
//   parameters: {
//     docs: {
//       description: {
//         story: '**弹出位置** - 支持 12 个弹出位置，通过 `placement` 属性配置。',
//       },
//     },
//   },
// }

// export const CustomTheme: Story = {
//   render: (args) => (
//     <ConfigProvider
//       theme={{
//         components: {
//           dropdown: {
//             backgroundColor: '#f6ffed',
//             borderRadius: '8px',
//             boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
//           },
//         },
//       }}
//     >
//       <Dropdown {...args} />
//     </ConfigProvider>
//   ),
//   args: {
//     overlay: MenuContent,
//     children: <Button>Custom Theme</Button>,
//   },
//   parameters: {
//     docs: {
//       description: {
//         story: '**自定义主题** - 通过 ConfigProvider 覆盖主题变量',
//       },
//     },
//   },
// }
