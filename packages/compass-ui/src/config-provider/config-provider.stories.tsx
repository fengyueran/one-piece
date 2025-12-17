import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import ConfigProvider from './index'
import Button from '../button'
import DatePicker from '../date-picker'
import Modal from '../modal'
import { zhCN, enUS } from '../locale'
import { ThemeProvider } from '../theme'
import styled from '@emotion/styled'

const meta: Meta<typeof ConfigProvider> = {
  title: 'Components/ConfigProvider',
  component: ConfigProvider,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
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
