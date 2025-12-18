import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import styled from '@emotion/styled'

import ConfigProvider from './index'
import Button from '../button'
import DatePicker from '../date-picker'
import Modal from '../modal'
import { zhCN, enUS } from '../locale'

const meta: Meta<typeof ConfigProvider> = {
  title: 'Components/ConfigProvider',
  component: ConfigProvider,
  tags: ['autodocs'],
  argTypes: {
    locale: {
      control: 'object',
      description: '国际化语言包配置',
      table: {
        type: {
          summary: 'Locale',
          detail: `interface Locale {
  locale: string; // 语言代码，如 'zh-CN'
  Modal: {
    okText: string;
    cancelText: string;
    justOkText: string;
  };
  DatePicker: {
    yearFormat: string;
    monthFormat: string;
    // ...更多日期格式化配置
    monthBeforeYear?: boolean;
    today: string;
    now: string;
    backToToday: string;
    ok: string;
    timeSelect: string;
    dateSelect: string;
    weekSelect: string;
    clear: string;
    month: string;
    year: string;
    previousMonth: string;
    nextMonth: string;
    monthSelect: string;
    yearSelect: string;
    decadeSelect: string;
    dayFormat: string;
    dateFormat: string;
    dateTimeFormat: string;
    previousYear: string;
    nextYear: string;
    previousDecade: string;
    nextDecade: string;
    previousCentury: string;
    nextCentury: string;
    shortWeekDays: string[];
    weekDays: string[];
    months: string[];
    shortMonths: string[];
    hour: string;
    minute: string;
    second: string;
    startDate: string;
    endDate: string;
    weekFormat: string;
  };
  Pagination: {
    items_per_page: string;
    jump_to: string;
    jump_to_confirm: string;
    page: string;
    prev_page: string;
    next_page: string;
    prev_5: string;
    next_5: string;
    prev_3: string;
    next_3: string;
  };
}`,
        },
      },
    },
    theme: {
      control: 'object',
      description: '主题配置对象',
      table: {
        type: {
          summary: 'ThemeConfig',
          detail: `interface ThemeConfig {
  // 默认模式 (默认: 'light')
  defaultMode?: 'light' | 'dark';

  // 全局 Design Token 覆盖 (DeepPartial<Theme>)
  token?: {
    colors?: {
      primary?: string;
      secondary?: string;
      success?: string;
      warning?: string;
      // ...更多颜色配置
    };
    // ...其他 Token 配置
  };

  // 浅色模式专用 Token 覆盖
  light?: DeepPartial<Theme>;

  // 深色模式专用 Token 覆盖
  dark?: DeepPartial<Theme>;
}`,
        },
      },
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
ConfigProvider 全局化配置。

用于全局配置国际化（Locale）和主题（Theme）。它应该包裹在应用的根部，以便所有子组件都能获取到配置信息。

## 何时使用

- 当需要为整个应用配置国际化文案时。
- 当需要配置全局主题（如深色模式、品牌色）时。
- 当需要管理全局状态（如 Modal 的上下文）时。
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof ConfigProvider>

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 400px;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
`

const ControlPanel = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
`

export const LocaleSwitching: Story = {
  render: () => {
    const [locale, setLocale] = useState(zhCN)
    const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light')

    const toggleLocale = () => {
      setLocale((prev) => (prev.locale === 'zh-CN' ? enUS : zhCN))
    }

    const toggleTheme = () => {
      setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'))
    }

    const showConfirm = () => {
      Modal.confirm({
        title: locale.locale === 'zh-CN' ? '确认' : 'Confirm',
        content: locale.locale === 'zh-CN' ? '这是一个确认对话框' : 'This is a confirm dialog',
        onOk: () => console.log('OK'),
      })
    }

    return (
      <ConfigProvider locale={locale} theme={{ defaultMode: themeMode }}>
        <Container
          style={{
            background: themeMode === 'dark' ? '#1f1f1f' : '#fff',
            color: themeMode === 'dark' ? '#fff' : '#000',
          }}
        >
          <ControlPanel>
            <Button onClick={toggleLocale}>
              Switch to {locale.locale === 'zh-CN' ? 'English' : '中文'}
            </Button>
            <Button onClick={toggleTheme}>
              Switch to {themeMode === 'light' ? 'Dark' : 'Light'}
            </Button>
          </ControlPanel>

          <div>
            <h3>DatePicker</h3>
            <DatePicker />
          </div>

          <div>
            <h3>Modal</h3>
            <Button onClick={showConfirm}>Open Confirm Modal</Button>
            <div style={{ marginTop: 10 }}>
              <Button onClick={() => Modal.info({ title: 'Info', content: 'Info...' })}>
                Open Info Modal
              </Button>
            </div>
          </div>

          <div>
            <h3>Context-aware Modal (useModal)</h3>
            <ContextModalDemo />
          </div>
        </Container>
      </ConfigProvider>
    )
  },
}

const ContextModalDemo = () => {
  const [modal, contextHolder] = Modal.useModal()

  return (
    <>
      {contextHolder}
      <Button
        onClick={() => {
          modal.confirm({
            title: 'Context Modal',
            content: 'This modal should inherit locale settings correctly.',
          })
        }}
      >
        Open Hook Modal
      </Button>
    </>
  )
}
