import React, { useEffect, useRef, useState } from 'react'
import {
  TabItem as StyledTabItem,
  TabsContainer,
  TabsContent,
  TabsNav,
  TabsNavList,
  TabsNavWrap,
  InkBar,
  TabPaneContainer,
  CloseButton,
} from './tabs.styles'
import { CloseIcon } from '../icons'
import { TabItem, TabsProps } from './types'
import TabPane from './tab-pane'

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      activeKey,
      defaultActiveKey,
      onChange,
      onEdit,
      items,
      tabBarExtraContent,
      tabPosition = 'top',
      tabBarPosition,
      type = 'line',
      size = 'default',
      children,
      className,
      style,
      styles,
      classNames,
      ...rest
    },
    ref,
  ) => {
    // Layout position defaults to tabPosition if not specified
    const layoutPosition = tabBarPosition || tabPosition

    // Collect tabs from items or children
    const tabs: TabItem[] = React.useMemo(() => {
      if (items) {
        return items
      }
      if (children) {
        const childList: TabItem[] = []
        React.Children.forEach(children, (child) => {
          if (React.isValidElement(child) && child.type === TabPane) {
            childList.push({
              key: child.key as string,
              label: child.props.tab,
              children: child.props.children,
              disabled: child.props.disabled,
              ...child.props,
            })
          }
        })
        return childList
      }
      return []
    }, [items, children])

    const [innerActiveKey, setInnerActiveKey] = useState<string>(() => {
      if (activeKey !== undefined) return activeKey
      if (defaultActiveKey !== undefined) return defaultActiveKey
      return tabs.length > 0 ? tabs[0].key : ''
    })

    const mergedActiveKey = activeKey !== undefined ? activeKey : innerActiveKey

    // InkBar state
    const [inkStyle, setInkStyle] = useState({ left: 0, width: 0, top: 0, height: 0 })
    const navListRef = useRef<HTMLDivElement>(null)

    const updateInkBar = React.useCallback(() => {
      if (!navListRef.current) return

      const activeNode = navListRef.current.querySelector<HTMLElement>(
        `[data-key="${mergedActiveKey}"]`,
      )
      if (activeNode) {
        setInkStyle({
          left: activeNode.offsetLeft,
          width: activeNode.offsetWidth,
          top: activeNode.offsetTop,
          height: activeNode.offsetHeight,
        })
      }
    }, [mergedActiveKey])

    useEffect(() => {
      updateInkBar()
    }, [updateInkBar, tabPosition, tabs.length])

    const handleTabClick = (key: string, disabled?: boolean) => {
      if (disabled) return
      if (activeKey === undefined) {
        setInnerActiveKey(key)
      }
      onChange?.(key)
    }

    const handleEdit = (
      e: React.MouseEvent | React.KeyboardEvent,
      key: string,
      action: 'add' | 'remove',
    ) => {
      e.stopPropagation()
      onEdit?.(key, action)
    }

    return (
      <TabsContainer
        ref={ref}
        $tabPosition={tabPosition}
        $tabBarPosition={layoutPosition}
        className={`compass-tabs compass-tabs--${tabPosition} compass-tabs--${size} ${className || ''} ${classNames?.root || ''}`}
        style={{ ...style, ...styles?.root }}
        {...rest}
      >
        <TabsNav
          $tabPosition={tabPosition}
          $tabBarPosition={layoutPosition}
          $type={type}
          className={`compass-tabs-nav ${classNames?.nav || ''}`}
          style={styles?.nav}
        >
          <TabsNavWrap $tabPosition={tabPosition} className="compass-tabs-nav-wrap">
            <TabsNavList
              ref={navListRef}
              $tabPosition={tabPosition}
              className="compass-tabs-nav-list"
            >
              {tabs.map((tab) => (
                <StyledTabItem
                  key={tab.key}
                  data-key={tab.key}
                  $active={mergedActiveKey === tab.key}
                  $disabled={tab.disabled}
                  $size={size}
                  $position={tabPosition}
                  $type={type}
                  onClick={() => handleTabClick(tab.key, tab.disabled)}
                  role="tab"
                  aria-selected={mergedActiveKey === tab.key}
                  aria-disabled={tab.disabled}
                  className={`compass-tabs-tab ${mergedActiveKey === tab.key ? 'compass-tabs-tab-active' : ''} ${tab.disabled ? 'compass-tabs-tab-disabled' : ''}`}
                >
                  {tab.icon && (
                    <span style={{ marginRight: 8, display: 'inline-flex', alignItems: 'center' }}>
                      {tab.icon}
                    </span>
                  )}
                  {tab.label}
                  {type === 'editable-card' && tab.closable !== false && (
                    <CloseButton
                      role="button"
                      aria-label="close"
                      onClick={(e) => handleEdit(e, tab.key, 'remove')}
                    >
                      <CloseIcon />
                    </CloseButton>
                  )}
                </StyledTabItem>
              ))}
              <InkBar
                $left={inkStyle.left}
                $width={inkStyle.width}
                $top={inkStyle.top}
                $height={inkStyle.height}
                $position={tabPosition}
                $type={type}
                className={`compass-tabs-ink-bar ${classNames?.inkBar || ''}`}
                style={styles?.inkBar}
              />
            </TabsNavList>
          </TabsNavWrap>
          {tabBarExtraContent && <div style={{ marginLeft: 'auto' }}>{tabBarExtraContent}</div>}
        </TabsNav>
        <TabsContent
          className={`compass-tabs-content ${classNames?.content || ''}`}
          style={styles?.content}
        >
          {tabs.map((tab) => {
            // For performance, we could only render active tab, but keeping DOM is standard for simple Tabs
            // Or allow `destroyInactiveTabPane`. Assume keep for now but controlled by display: none via TabPaneContainer
            return (
              <TabPaneContainer
                key={tab.key}
                $active={mergedActiveKey === tab.key}
                role="tabpanel"
                className={`compass-tabs-tabpane ${mergedActiveKey === tab.key ? 'compass-tabs-tabpane-active' : ''}`}
              >
                {tab.children}
              </TabPaneContainer>
            )
          })}
        </TabsContent>
      </TabsContainer>
    )
  },
)

Tabs.displayName = 'Tabs'

// We assign TabPane to Tabs component for easier imports if using JSX style
type TabsComponent = typeof Tabs & {
  TabPane: typeof TabPane
}
;(Tabs as TabsComponent).TabPane = TabPane

export default Tabs as TabsComponent
