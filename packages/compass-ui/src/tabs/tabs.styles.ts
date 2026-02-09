import styled from '@emotion/styled'
import { TabsProps } from './types'
import { token } from '../theme/token-utils'

export const TabsContainer = styled.div<{
  $tabPosition?: TabsProps['tabPosition']
  $tabBarPosition?: TabsProps['tabBarPosition']
}>`
  display: flex;
  flex-direction: ${({ $tabBarPosition }) =>
    $tabBarPosition === 'left' || $tabBarPosition === 'right' ? 'row' : 'column'};
  width: 100%;
  overflow: hidden;

  ${({ $tabBarPosition }) =>
    $tabBarPosition === 'bottom' &&
    `
    flex-direction: column-reverse;
  `}

  ${({ $tabBarPosition }) =>
    $tabBarPosition === 'right' &&
    `
    flex-direction: row-reverse;
  `}
`

export const TabsNav = styled.div<{
  $tabPosition?: TabsProps['tabPosition']
  $tabBarPosition?: TabsProps['tabBarPosition']
  $type?: TabsProps['type']
}>`
  display: flex;
  flex: none;
  position: relative;

  ${({ $tabPosition, $type }) => {
    // const tabsTheme = getComponentTheme(theme, 'tabs')
    const borderColor = token('components.tabs.tabBarBorderColor', '#f0f0f0')
    const borderWidth = token('components.tabs.tabBarBorderWidth', '1px')
    const border = `${borderWidth} solid ${borderColor}`

    // Only apply border if type is line
    if ($type !== 'line') {
      return `
        border-bottom: none;
        border-top: none;
        border-right: none;
        border-left: none;
      `
    }

    if ($tabPosition === 'top' || !$tabPosition) return `border-bottom: ${border};`
    if ($tabPosition === 'bottom') return `border-top: ${border};`
    if ($tabPosition === 'left') return `border-right: ${border};`
    if ($tabPosition === 'right') return `border-left: ${border};`

    return ''
  }}

  margin-bottom: ${({ $tabBarPosition }) =>
    $tabBarPosition === 'top' || !$tabBarPosition ? '16px' : '0'};
  margin-top: ${({ $tabBarPosition }) => ($tabBarPosition === 'bottom' ? '16px' : '0')};
  margin-right: ${({ $tabBarPosition }) => ($tabBarPosition === 'left' ? '16px' : '0')};
  margin-left: ${({ $tabBarPosition }) => ($tabBarPosition === 'right' ? '16px' : '0')};

  background-color: ${() => token('components.tabs.tabBarBackgroundColor', '#ffffff')};

  ${({ $tabPosition }) =>
    ($tabPosition === 'left' || $tabPosition === 'right') &&
    `
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  `}

  ${({ $tabPosition }) =>
    ($tabPosition === 'top' || $tabPosition === 'bottom' || !$tabPosition) &&
    `
    width: 100%;
    overflow: hidden;
  `}
`

export const TabsNavWrap = styled.div<{ $tabPosition?: TabsProps['tabPosition'] }>`
  display: flex;
  flex: auto;
  align-self: flex-start;
  overflow: hidden;
  white-space: nowrap;
  transform: translate(0);

  ${({ $tabPosition }) =>
    $tabPosition === 'left' || $tabPosition === 'right'
      ? `
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
  `
      : `
    overflow-x: auto;
    overflow-y: hidden;
  `}

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`

export const TabsNavList = styled.div<{ $tabPosition?: TabsProps['tabPosition'] }>`
  display: flex;
  position: relative;
  transition: transform 0.3s;
  ${({ $tabPosition }) =>
    ($tabPosition === 'left' || $tabPosition === 'right') &&
    `
    flex-direction: column;
    width: 100%;
  `}
`

export const TabItem = styled.div<{
  $active?: boolean
  $disabled?: boolean
  $size?: TabsProps['size']
  $position?: TabsProps['tabPosition']
  $type?: TabsProps['type']
}>`
  position: relative;
  display: inline-flex;
  align-items: center;

  ${({ $position }) => {
    const itemPadding = token('components.tabs.tabItemPadding', '12px 16px')
    const verticalGutter = token('components.tabs.tabItemVerticalGutter', '16px')
    const horizontalGutter = token('components.tabs.tabItemHorizontalGutter', '32px')

    return `padding: ${itemPadding};
    margin: ${
      $position === 'left' || $position === 'right'
        ? `0 0 ${verticalGutter} 0`
        : `0 ${horizontalGutter} 0 0`
    };`
  }}

  font-size: ${({ $size }) => {
    const defaultSize = token('components.tabs.tabItemFontSize', '14px')
    if ($size === 'large') return `calc(${defaultSize} + 2px)`
    if ($size === 'small') return `calc(${defaultSize} - 2px)`
    return defaultSize
  }};
  background: transparent;
  border: 0;
  outline: none;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};

  ${({ $active, $disabled }) => {
    if ($disabled)
      return `color: ${token('components.tabs.tabItemDisabledColor', token('colors.textDisabled', '#ccc'))};`
    if ($active)
      return `color: ${token('components.tabs.tabItemActiveColor', token('colors.primary', '#1890ff'))};`
    return `color: ${token('components.tabs.tabItemColor', token('colors.text', '#333'))};`
  }}

  font-weight: ${() => token('fontWeight.normal', '400')};
  transition: all 0.3s;

  &:hover {
    ${({ $disabled }) => {
      return !$disabled
        ? `color: ${token('components.tabs.tabItemHoverColor', token('colors.primaryHover', '#40a9ff'))};`
        : ''
    }}
  }

  ${({ $type, $active }) => {
    if ($type !== 'card' && $type !== 'editable-card') return ''
    const borderColor = token('colors.border', '#d9d9d9')
    return `
    margin: 0 2px 0 0;
    padding: 8px 16px;
    background: ${$active ? '#ffffff' : '#fafafa'};
    border: 1px solid ${borderColor};
    border-bottom: ${$active ? '1px solid #ffffff' : `1px solid ${borderColor}`};
    border-radius: 4px 4px 0 0;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  `
  }}
`

export const CloseButton = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  font-size: 12px;
  width: 16px;
  height: 16px;
  line-height: 0;
  border-radius: 50%;
  color: ${() => token('colors.textSecondary', '#999')};
  transition: all 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
    color: ${() => token('colors.text', '#333')};
  }
`

export const InkBar = styled.div<{
  $left: number
  $width: number
  $top: number
  $height: number
  $position?: TabsProps['tabPosition']
  $type?: TabsProps['type']
}>`
  position: absolute;
  background: ${() => token('components.tabs.inkBarColor', token('colors.primary', '#1890ff'))};
  pointer-events: none;
  transition:
    width 0.3s,
    left 0.3s,
    top 0.3s,
    height 0.3s;

  display: ${({ $type }) => ($type === 'line' ? 'block' : 'none')};

  ${({ $position, $left, $width, $top, $height }) => {
    const barHeight = token('components.tabs.inkBarHeight', '2px')
    if ($position === 'left' || $position === 'right') {
      return `
        width: ${barHeight};
        height: ${$height}px;
        top: ${$top}px;
        ${$position === 'left' ? 'right: 0;' : 'left: 0;'}
      `
    }
    return `
      height: ${barHeight};
      width: ${$width}px;
      left: ${$left}px;
      ${$position === 'bottom' ? 'top: 0;' : 'bottom: 0;'}
    `
  }}
`

export const TabsContent = styled.div`
  display: flex;
  flex: auto;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
`

export const TabPaneContainer = styled.div<{ $active: boolean }>`
  flex: none;
  width: 100%;
  outline: none;
  display: ${({ $active }) => ($active ? 'block' : 'none')};
`
