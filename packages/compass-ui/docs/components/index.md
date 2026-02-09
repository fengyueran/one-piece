---
title: 组件总览
nav:
  title: 组件
  order: 2
group:
  title: 介绍
  order: 0
---

# Compass UI 组件总览

Compass UI 是一套基于 React 的高质量组件库，旨在提供优雅、灵动且功能强大的交互体验。

## 设计理念

- **现代美观**：采用简洁的设计语言，注重视觉体验。
- **交互友好**：提供流畅的交互反馈，提升用户体验。
- **灵活可定制**：支持主题配置，适应不同业务场景。

## 样式定制

Compass UI 提供了灵活的样式定制能力，从简单的主题色调整到深度的组件样式覆盖。

### 1. ConfigProvider 全局定制

通过 `ConfigProvider` 组件可以全局配置 Design Token，影响所有组件的样式。Token 命名规则采用 `components.[componentName].[property]` 的形式。

```tsx | pure
<ConfigProvider
  theme={{
    token: {
      colors: { primary: '#722ed1' },
      components: {
        select: { baseURL: '...' },
      },
    },
  }}
>
  <App />
</ConfigProvider>
```

### 2. CSS 变量 (CSS Variables)

Compass UI 的 Design Token 会自动映射为 CSS 变量,因此你也可以直接使用 CSS 变量来定制样式。这对于非 React 环境或局部样式调整非常有用。

**变量名规则**：所有变量都以 `--compass-` 开头，Token 路径中的点号 `.` 替换为连字符 `-`。

例如：

- `colors.primary` -> `--compass-colors-primary`
- `components.select.borderRadius` -> `--compass-components-select-border-radius`
- `spacing.md` -> `--compass-spacing-md`

```css
:root {
  --compass-colors-primary: #722ed1;
  --compass-components-button-border-radius: 8px;
}
```

### 3. 组件级 Granular Styling (推荐)

当 Design Token 无法满足需求（例如需要调整布局、边距或特定交互状态的样式）时，可以使用组件提供的 `styles` 和 `classNames` 属性，精确控制组件内部各个部分。详细说明请参考 [通用属性指南](/guide/common-props)。

```tsx | pure
<Select
  styles={{
    dropdown: { backgroundColor: '#f0f0f0' },
    option: { color: '#333' },
  }}
  classNames={{
    root: 'my-select-root',
    trigger: 'my-select-trigger',
  }}
/>
```

## 组件合集示例

以下示例展示了 Compass UI 中多个核心组件的组合使用效果，包括按钮、输入框、选择器、下拉菜单、日期选择器等。

```tsx
import React, { useState } from 'react'
import {
  Button,
  InputField,
  InputNumber,
  Select,
  AutoComplete,
  DatePicker,
  TreeSelect,
  Dropdown,
  Menu,
  Pagination,
  Steps,
  Progress,
  Table,
  Tree,
  Tabs,
  Form,
  Modal,
  Message,
  ConfigProvider,
} from '@xinghunm/compass-ui'

const IconSearch = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const IconUser = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const IconSettings = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)

const IconEdit = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

const IconDelete = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
)

const Card = ({
  title,
  children,
  style,
}: {
  title?: React.ReactNode
  children: React.ReactNode
  style?: React.CSSProperties
}) => (
  <div
    style={{
      background: '#fff',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      ...style,
    }}
  >
    {title && (
      <h3
        style={{
          margin: '0 0 20px 0',
          fontSize: '18px',
          fontWeight: 600,
          color: '#1a1a1a',
        }}
      >
        {title}
      </h3>
    )}
    {children}
  </div>
)

const ComponentShowcase = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState('1')

  const tableColumns = [
    {
      title: '姓名',
      dataIndex: 'name' as const,
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age' as const,
      key: 'age',
    },
    {
      title: '地址',
      dataIndex: 'address' as const,
      key: 'address',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button size="small" icon={<IconEdit />}>
            编辑
          </Button>
          <Button size="small" danger icon={<IconDelete />}>
            删除
          </Button>
        </div>
      ),
    },
  ]

  const tableData = [
    { key: '1', name: '张三', age: 32, address: '北京市朝阳区' },
    { key: '2', name: '李四', age: 28, address: '上海市浦东新区' },
    { key: '3', name: '王五', age: 35, address: '广州市天河区' },
  ]

  const treeData = [
    {
      title: '父节点 1',
      key: '0-0',
      children: [
        { title: '子节点 1-1', key: '0-0-0' },
        { title: '子节点 1-2', key: '0-0-1' },
      ],
    },
    {
      title: '父节点 2',
      key: '0-1',
      children: [
        { title: '子节点 2-1', key: '0-1-0' },
        { title: '子节点 2-2', key: '0-1-1' },
      ],
    },
  ]

  return (
    <ConfigProvider
      theme={{
        token: {
          colors: {
            primary: '#1890ff',
            success: '#52c41a',
          },
        },
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          minHeight: '100vh',
          padding: '32px 16px',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1
              style={{
                fontSize: '40px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '8px',
              }}
            >
              Compass UI
            </h1>
            <p style={{ fontSize: '16px', color: '#666', margin: 0 }}>
              优雅、灵动、功能强大的 React 组件库
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              <Card title="🔘 Button 按钮">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <Button variant="primary">Primary</Button>
                    <Button variant="default">Default</Button>
                    <Button variant="dashed">Dashed</Button>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <Button variant="primary" icon={<IconUser />}>
                      用户
                    </Button>
                    <Button variant="primary" danger icon={<IconDelete />}>
                      删除
                    </Button>
                    <Button shape="circle" icon={<IconSettings />} />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button size="small">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="large">Large</Button>
                  </div>
                  <Button variant="primary" block onClick={() => setModalVisible(true)}>
                    打开对话框
                  </Button>
                </div>
              </Card>

              <Card title="📝 Input 输入框">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <InputField placeholder="基础输入框" />
                  <InputField placeholder="带图标" prefix={<IconSearch />} />
                  <InputField placeholder="密码输入" type="password" />
                  <InputNumber
                    placeholder="数字输入"
                    prefix={<span style={{ color: '#999' }}>¥</span>}
                    style={{ width: '100%' }}
                  />
                  <AutoComplete
                    placeholder="自动完成"
                    options={[{ value: 'React' }, { value: 'Vue' }, { value: 'Angular' }]}
                    style={{ width: '100%' }}
                  />
                </div>
              </Card>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
              <Card title="🎯 Select 选择器">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Select placeholder="请选择" style={{ width: '100%' }}>
                    <Select.Option value="1">选项一</Select.Option>
                    <Select.Option value="2">选项二</Select.Option>
                    <Select.Option value="3">选项三</Select.Option>
                  </Select>
                  <DatePicker placeholder="选择日期" style={{ width: '100%' }} />
                  <TreeSelect placeholder="树选择" treeData={treeData} style={{ width: '100%' }} />
                  <Dropdown
                    menu={{
                      items: [
                        { key: '1', label: '菜单项 1' },
                        { key: '2', label: '菜单项 2' },
                        { key: '3', label: '菜单项 3' },
                      ],
                    }}
                  >
                    <Button style={{ width: '100%' }}>
                      Dropdown 下拉菜单 <span style={{ marginLeft: 'auto' }}>▼</span>
                    </Button>
                  </Dropdown>
                </div>
              </Card>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
              <Card title="📊 Progress 进度条">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#666' }}>线形进度条</p>
                    <Progress percent={30} />
                    <Progress percent={60} style={{ marginTop: '8px' }} />
                    <Progress percent={100} style={{ marginTop: '8px' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '20px', justifyContent: 'space-around' }}>
                    <div>
                      <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#666' }}>
                        圆形进度条
                      </p>
                      <Progress
                        type="circle"
                        percent={75}
                        style={{ width: '80px', height: '80px' }}
                      />
                    </div>
                    <div>
                      <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#666' }}>仪表盘</p>
                      <Progress
                        type="circle"
                        percent={85}
                        style={{ width: '80px', height: '80px' }}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              <Card title="📍 Steps 步骤条">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <Steps
                    current={currentStep}
                    items={[
                      { title: '步骤一', description: '这是描述' },
                      { title: '步骤二', description: '这是描述' },
                      { title: '步骤三', description: '这是描述' },
                    ]}
                  />
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <Button
                      size="small"
                      disabled={currentStep === 0}
                      onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    >
                      上一步
                    </Button>
                    <Button
                      size="small"
                      variant="primary"
                      disabled={currentStep === 2}
                      onClick={() => setCurrentStep(Math.min(2, currentStep + 1))}
                    >
                      下一步
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            <Card title="📋 Table 表格">
              <Table columns={tableColumns} dataSource={tableData} pagination={false} />
              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  current={currentPage}
                  total={50}
                  onChange={(page) => setCurrentPage(page)}
                />
              </div>
            </Card>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              <Card title="🌲 Tree 树形控件">
                <Tree
                  treeData={treeData}
                  checkable
                  style={{ background: '#f9f9f9', padding: '12px', borderRadius: '8px' }}
                />
              </Card>

              <Card title="📑 Tabs 标签页">
                <Tabs
                  activeKey={activeTab}
                  onChange={setActiveTab}
                  items={[
                    {
                      key: '1',
                      label: '标签一',
                      children: (
                        <div style={{ padding: '16px 0' }}>
                          <p>这是标签页一的内容</p>
                        </div>
                      ),
                    },
                    {
                      key: '2',
                      label: '标签二',
                      children: (
                        <div style={{ padding: '16px 0' }}>
                          <p>这是标签页二的内容</p>
                        </div>
                      ),
                    },
                    {
                      key: '3',
                      label: '标签三',
                      children: (
                        <div style={{ padding: '16px 0' }}>
                          <p>这是标签页三的内容</p>
                        </div>
                      ),
                    },
                  ]}
                />
              </Card>

              <Card title="📜 Menu 菜单">
                <Menu
                  mode="vertical"
                  items={[
                    {
                      key: '1',
                      label: '导航一',
                      icon: <IconUser />,
                    },
                    {
                      key: '2',
                      label: '导航二',
                      icon: <IconSettings />,
                    },
                    {
                      key: '3',
                      label: '导航三',
                      icon: <IconSearch />,
                    },
                  ]}
                  style={{
                    border: '1px solid #e8e8e8',
                    borderRadius: '8px',
                  }}
                />
              </Card>
            </div>

            <Card title="📝 Form 表单">
              <Form
                layout="horizontal"
                onFinish={(values) => {
                  console.log('Form values:', values)
                  Message.success('提交成功！')
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '16px',
                  }}
                >
                  <Form.Item
                    label="用户名"
                    name="username"
                    rules={[{ required: true, message: '请输入用户名' }]}
                  >
                    <InputField placeholder="请输入用户名" />
                  </Form.Item>
                  <Form.Item
                    label="邮箱"
                    name="email"
                    rules={[
                      { required: true, message: '请输入邮箱' },
                      { type: 'email', message: '请输入有效的邮箱' },
                    ]}
                  >
                    <InputField placeholder="请输入邮箱" />
                  </Form.Item>
                  <Form.Item
                    label="年龄"
                    name="age"
                    rules={[{ required: true, message: '请输入年龄' }]}
                  >
                    <InputNumber placeholder="请输入年龄" style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item
                    label="性别"
                    name="gender"
                    rules={[{ required: true, message: '请选择性别' }]}
                  >
                    <Select placeholder="请选择性别">
                      <Select.Option value="male">男</Select.Option>
                      <Select.Option value="female">女</Select.Option>
                    </Select>
                  </Form.Item>
                </div>
                <Form.Item style={{ marginTop: '16px', marginBottom: 0 }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <Button>重置</Button>
                    <Button variant="primary" type="submit">
                      提交
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            </Card>

            <Card style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <Button
                  variant="primary"
                  size="large"
                  onClick={() => Message.success('成功提示！')}
                >
                  Success Message
                </Button>
                <Button size="large" onClick={() => Message.info('信息提示！')}>
                  Info Message
                </Button>
                <Button size="large" onClick={() => Message.warning('警告提示！')}>
                  Warning Message
                </Button>
                <Button danger size="large" onClick={() => Message.error('错误提示！')}>
                  Error Message
                </Button>
              </div>
            </Card>
          </div>
        </div>

        <Modal
          title="示例对话框"
          visible={modalVisible}
          onOk={() => {
            Message.success('确认操作！')
            setModalVisible(false)
          }}
          onCancel={() => setModalVisible(false)}
          width={500}
        >
          <div style={{ padding: '20px 0' }}>
            <p>这是一个示例对话框，演示 Modal 组件的使用。</p>
            <InputField placeholder="在对话框中输入内容" style={{ marginTop: '16px' }} />
          </div>
        </Modal>
      </div>
    </ConfigProvider>
  )
}

export default ComponentShowcase
```
