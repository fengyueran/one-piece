import { Button, ConfigProvider, defaultTheme } from '@xinghunm/compass-ui'
import type { ConfigProviderProps } from '@xinghunm/compass-ui'
import { SearchIcon } from '@xinghunm/compass-ui/icons'
import { zhCN } from '@xinghunm/compass-ui/locale'

const configProviderProps: ConfigProviderProps = {
  locale: zhCN,
  theme: {
    token: defaultTheme,
  },
}

export const consumerElement = (
  <ConfigProvider {...configProviderProps}>
    <Button icon={<SearchIcon />}>Search</Button>
  </ConfigProvider>
)
