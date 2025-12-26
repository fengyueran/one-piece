import React from 'react'
import { TabPaneProps } from './types'
import { TabPaneContainer } from './tabs.styles'

const TabPane = React.forwardRef<HTMLDivElement, TabPaneProps>(
  ({ children, active = false, className, style, ...rest }, ref) => {
    return (
      <TabPaneContainer
        ref={ref}
        $active={active}
        className={className}
        style={style}
        role="tabpanel"
        aria-hidden={!active}
        {...rest}
      >
        {children}
      </TabPaneContainer>
    )
  },
)

TabPane.displayName = 'TabPane'

export default TabPane
