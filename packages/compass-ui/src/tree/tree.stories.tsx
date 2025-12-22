import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import ConfigProvider from '../config-provider'
import Tree, { type DataNode } from './index'

const meta: Meta<typeof Tree> = {
  title: 'Components/Tree',
  component: Tree,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
树形控件，用于层级数据的展示、展开、选择。

## 何时使用
- 文件夹、组织架构、生物分类、国家地区等等，世间万物的大多数结构都是树形结构。
- 当需要展示层级数据时。

## 特性
- 支持展开/收起
- 支持单选/复选 (Checkable)
- 支持虚拟滚动 (处理大数据量)
- 支持自定义图标和标题渲染
- 支持受控模式
## 主题变量 (Design Token)

<details>
<summary>组件 Token</summary>

| Token Name | Description | Default |
| --- | --- | --- |
| \`tree.nodeSelectedBg\` | 节点选中背景色 | \`#e6f7ff\` |
| \`tree.nodeHoverBg\` | 节点悬浮背景色 | \`#f5f5f5\` |
| \`tree.nodeColor\` | 节点文本颜色 | \`rgba(0, 0, 0, 0.88)\` |
| \`tree.nodeSelectedColor\` | 节点选中文本颜色 | \`rgba(0, 0, 0, 0.88)\` |
| \`tree.switcherColor\` | 展开图标颜色 | \`rgba(0, 0, 0, 0.45)\` |
| \`tree.switcherHoverColor\` | 展开图标悬浮颜色 | \`#1890ff\` |
| \`tree.fontSize\` | 字体大小 | \`14px\` |
| \`tree.borderRadius\` | 圆角 | \`4px\` |
| \`tree.indentSize\` | 缩进大小 | \`24px\` |

</details>

<details>
<summary>全局 Token</summary>

| Token Name | Description | Default |
| --- | --- | --- |
| \`colors.text\` | 文本颜色 | \`#000000d9\` |
| \`colors.backgroundSecondary\` | 选中/悬浮状态背景色 | \`#e6f7ff\` / \`#f5f5f5\` |
| \`colors.primary\` | 主色调（展开图标悬浮颜色） | \`#1890ff\` |

</details>
        `,
      },
    },
  },
  argTypes: {
    treeData: {
      description: '树形数据',
      table: { type: { summary: 'DataNode[]' } },
    },
    checkable: {
      control: 'boolean',
      description: '节点前添加 Checkbox 复选框',
    },
    selectable: {
      control: 'boolean',
      description: '是否可选中',
    },
    showLine: {
      control: 'boolean',
      description: '是否展示连接线',
    },
    showIcon: {
      control: 'boolean',
      description: '是否展示 TreeNode title 前的图标',
    },
    virtual: {
      control: 'boolean',
      description: '设置 false 时关闭虚拟滚动',
    },
    height: {
      control: 'number',
      description: '虚拟滚动容器高度',
    },
    itemHeight: {
      control: 'number',
      description: '虚拟滚动每一行的高度',
    },
    defaultExpandedKeys: {
      control: 'object',
      description: '默认展开的节点 key 数组',
    },
    expandedKeys: {
      control: 'object',
      description: '（受控）展开的节点 key 数组',
    },
    defaultSelectedKeys: {
      control: 'object',
      description: '默认选中的节点 key 数组',
    },
    selectedKeys: {
      control: 'object',
      description: '（受控）选中的节点 key 数组',
    },
    defaultCheckedKeys: {
      control: 'object',
      description: '默认勾选的节点 key 数组',
    },
    checkedKeys: {
      control: 'object',
      description: '（受控）勾选的节点 key 数组',
    },
    switcherIcon: {
      control: false,
      description: '自定义树节点的展开/折叠图标',
    },
    titleRender: {
      control: false,
      description: '自定义标题渲染',
    },
    onExpand: {
      description: '展开/收起节点时触发',
      action: 'expanded',
    },
    onSelect: {
      description: '点击树节点时触发',
      action: 'selected',
    },
    onCheck: {
      description: '点击复选框时触发',
      action: 'checked',
    },
    className: {
      control: 'text',
      description: '自定义类名',
    },
    style: {
      control: 'object',
      description: '自定义样式',
    },
    virtualListProps: {
      control: 'object',
      description: '传递给虚拟列表的 props',
    },
  },
}

export default meta
type Story = StoryObj<typeof Tree>

const treeData: DataNode[] = [
  {
    key: '0-0',
    title: 'parent 1',
    children: [
      {
        key: '0-0-0',
        title: 'parent 1-0',
        children: [
          { key: '0-0-0-0', title: 'leaf', isLeaf: true },
          { key: '0-0-0-1', title: 'leaf', isLeaf: true },
        ],
      },
      {
        key: '0-0-1',
        title: 'parent 1-1',
        children: [{ key: '0-0-1-0', title: 'leaf', isLeaf: true }],
      },
    ],
  },
]

export const Basic: Story = {
  args: {
    treeData,
    defaultExpandedKeys: ['0-0', '0-0-0', '0-0-1'],
  },
}

export const Checkable: Story = {
  args: {
    treeData,
    defaultExpandedKeys: ['0-0', '0-0-0', '0-0-1'],
    checkable: true,
  },
  parameters: {
    docs: {
      description: {
        story: '可通过 `checkable` 属性开启复选功能。',
      },
    },
  },
}

export const ShowLine: Story = {
  args: {
    treeData,
    showLine: true,
    defaultExpandedKeys: ['0-0'],
  },
  parameters: {
    docs: {
      description: {
        story: '节点之间带连接线的树，常用于文件目录结构。',
      },
    },
  },
}

export const WithIcon: Story = {
  render: () => {
    const treeDataWithIcon: DataNode[] = [
      {
        key: '0-0',
        title: 'Folder 1',
        icon: <span>📂</span>,
        children: [
          {
            key: '0-0-0',
            title: 'File 1',
            icon: <span>📄</span>,
            isLeaf: true,
          },
          {
            key: '0-0-1',
            title: 'File 2',
            icon: <span>📄</span>,
            isLeaf: true,
          },
        ],
      },
    ]
    return <Tree treeData={treeDataWithIcon} showIcon defaultExpandedKeys={['0-0']} />
  },
  parameters: {
    docs: {
      description: {
        story: '展示带图标的树节点，需要设置 `showIcon` 为 true，并在数据源中提供 `icon`。',
      },
    },
  },
}

export const Controlled: Story = {
  render: () => {
    const [expandedKeys, setExpandedKeys] = useState<(string | number)[]>(['0-0'])
    const [checkedKeys, setCheckedKeys] = useState<(string | number)[]>(['0-0-0'])
    const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>([])

    const onExpand = (expandedKeysValue: (string | number)[]) => {
      console.log('onExpand', expandedKeysValue)
      setExpandedKeys(expandedKeysValue)
    }

    const onCheck = (checkedKeysValue: (string | number)[]) => {
      console.log('onCheck', checkedKeysValue)
      setCheckedKeys(checkedKeysValue)
    }

    const onSelect = (selectedKeysValue: (string | number)[], info: any) => {
      console.log('onSelect', info)
      setSelectedKeys(selectedKeysValue)
    }

    return (
      <Tree
        checkable
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        onSelect={onSelect}
        selectedKeys={selectedKeys}
        treeData={treeData}
      />
    )
  },
  parameters: {
    docs: {
      description: {
        story: '受控操作示例，`expandedKeys`、`checkedKeys`、`selectedKeys` 由父组件 state 控制。',
      },
    },
  },
}

const MyIcon = (
  <div
    style={{
      width: '24px',
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    ⬇
  </div>
)

export const CustomSwitcherIcon: Story = {
  args: {
    treeData,
    defaultExpandedKeys: ['0-0'],
    switcherIcon: MyIcon,
  },
  parameters: {
    docs: {
      description: {
        story: '通过 `switcherIcon` 自定义展开/折叠图标。',
      },
    },
  },
}

export const CustomTitleRender: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>(['2d-forward'])
    const [expandedKeys, setExpandedKeys] = useState<(string | number)[]>(['heat-equation'])

    const physicsData: DataNode[] = [
      {
        key: 'heat-equation',
        title: 'Heat equation',
        children: [
          { key: '1d-forward', title: '1D Forward heat equation', isLeaf: true },
          { key: '1d-backward', title: '1D Backward heat equation', isLeaf: true },
          {
            key: '1d-variable',
            title: '1D Forward heat equation with variable coefficient',
            isLeaf: true,
          },
          { key: '2d-forward', title: '2D Forward heat equation', isLeaf: true },
          { key: '2d-backward', title: '2D Backward heat equation', isLeaf: true },
        ],
      },
      {
        key: 'advection-equation',
        title: 'Advection equation',
        children: [{ key: 'advection-1d', title: '1D Advection', isLeaf: true }],
      },
    ]

    return (
      <div
        style={{
          padding: '24px',
          background: '#fff',
          border: '1px solid #f0f0f0',
          color: '#000000d9',
          width: '500px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        <div style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
          Select type <span style={{ color: '#00000073', fontSize: '14px' }}>?</span>
        </div>
        <Tree
          treeData={physicsData}
          expandedKeys={expandedKeys}
          selectedKeys={selectedKeys}
          onExpand={setExpandedKeys}
          onSelect={(keys) => setSelectedKeys(keys)}
          switcherIcon={({ expanded }) => (
            <span
              style={{
                color: '#00000073',
                fontSize: '12px',
                display: 'inline-block',
                transform: `rotate(${expanded ? 90 : 0}deg)`,
                transition: 'transform 0.2s',
              }}
            >
              ›
            </span>
          )}
          titleRender={(node) => {
            const selected = selectedKeys.includes(node.key)
            const isLeaf = node.isLeaf

            if (!isLeaf) {
              return (
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#000000d9',
                    lineHeight: '24px',
                  }}
                >
                  {node.title}
                </span>
              )
            }

            return (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  border: `1px solid ${selected ? '#1677ff' : '#d9d9d9'}`,
                  borderRadius: '4px',
                  background: '#fff',
                  margin: '4px 0',
                  width: '100%',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: selected ? '0 0 0 2px rgba(22, 119, 255, 0.1)' : 'none',
                }}
              >
                <span
                  style={{
                    color: selected ? '#1677ff' : '#000000d9',
                    fontSize: '13px',
                    flex: 1,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginRight: '8px',
                  }}
                >
                  {node.title}
                </span>
                {selected ? (
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      flexShrink: 0,
                      borderRadius: '50%',
                      background: '#1677ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                    }}
                  >
                    <svg
                      viewBox="0 0 1024 1024"
                      width="10"
                      height="10"
                      fill="#fff"
                      style={{ display: 'block' }}
                    >
                      <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z" />
                    </svg>
                  </div>
                ) : (
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      flexShrink: 0,
                      borderRadius: '50%',
                      border: '1px solid #d9d9d9',
                    }}
                  />
                )}
              </div>
            )
          }}
        />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '通过 `titleRender` 自定义节点标题的渲染逻辑，实现卡片式选择效果。',
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
            tree: {
              nodeSelectedBg: '#f6ffed',
              nodeHoverBg: '#d9f7be',
              nodeColor: '#389e0d',
              nodeSelectedColor: '#135200',
              switcherColor: '#389e0d',
              switcherHoverColor: '#135200',
              fontSize: '16px',
              borderRadius: '12px',
              indentSize: '32px',
            },
          },
        },
      }}
    >
      <Tree {...args} />
    </ConfigProvider>
  ),
  args: {
    treeData,
    defaultExpandedKeys: ['0-0', '0-0-0'],
    defaultSelectedKeys: ['0-0-0-0'],
  },
  parameters: {
    docs: {
      description: {
        story:
          '**自定义主题** - 通过 ThemeProvider 覆盖主题组件 Token。例如修改背景色、字体颜色、圆角和缩进。',
      },
    },
  },
}

export const VirtualScroll: Story = {
  args: {
    height: 300,
    itemHeight: 28,
    virtual: true,
    defaultExpandedKeys: ['0-0'],
  },
  render: (args) => {
    // Generate large data for virtual scroll
    const dig = (path = '0', level = 3) => {
      const list: DataNode[] = []
      for (let i = 0; i < 10; i += 1) {
        const key = `${path}-${i}`
        const treeNode: DataNode = {
          title: key,
          key,
        }

        if (level > 0) {
          treeNode.children = dig(key, level - 1)
        } else {
          treeNode.isLeaf = true
        }

        list.push(treeNode)
      }
      return list
    }
    return <Tree {...args} treeData={dig()} />
  },
  parameters: {
    docs: {
      description: {
        story:
          '使用 `virtual` 属性开启虚拟滚动，适用于大量数据展示。需要设置 `height` 和 `itemHeight`。',
      },
    },
  },
}

export const CustomClassName: Story = {
  render: () => {
    const customData: DataNode[] = [
      {
        key: '0-0',
        title: 'Parent 1',
        children: [
          { key: '0-0-0', title: 'Child 1-1' },
          { key: '0-0-1', title: 'Child 1-2' },
        ],
      },
      {
        key: '0-1',
        title: 'Parent 2',
        children: [{ key: '0-1-0', title: 'Child 2-1' }],
      },
    ]

    return (
      <div>
        <style>
          {`
            /* 自定义树的样式 */
            .custom-tree.compass-tree {
              border: 2px solid #1890ff;
              border-radius: 8px;
              padding: 16px;
              background: #f5f5f5;
            }

            /* 自定义节点选中样式 */
            .custom-tree .compass-tree-node--selected {
              background: linear-gradient(90deg, #1890ff 0%, #096dd9 100%);
              color: white;
              border-radius: 8px;
              font-weight: bold;
            }

            /* 自定义标题样式 */
            .custom-tree .compass-tree-title {
              font-family: 'Arial', sans-serif;
            }

            /* 自定义展开按钮样式 */
            .custom-tree .compass-tree-switcher {
              color: #1890ff;
              font-weight: bold;
            }
          `}
        </style>
        <Tree
          className="custom-tree"
          treeData={customData}
          defaultExpandedKeys={['0-0', '0-1']}
          defaultSelectedKeys={['0-0-0']}
        />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: `
**自定义样式** - 通过标准化的 className 可以轻松定制组件样式。

可用的 className：
- \`compass-tree\` - 树根元素
- \`compass-tree-node\` - 节点元素
- \`compass-tree-node--selected\` - 选中状态
- \`compass-tree-node--disabled\` - 禁用状态
- \`compass-tree-title\` - 节点标题
- \`compass-tree-switcher\` - 展开/收起按钮
- \`compass-tree-content\` - 节点内容容器
- \`compass-tree-icon\` - 节点图标
        `,
      },
    },
  },
}
