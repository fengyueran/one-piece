import { Button, ConfigProvider } from '@xinghunm/compass-ui'
import type { ConfigProviderProps } from '@xinghunm/compass-ui'
import { SearchIcon } from '@xinghunm/compass-ui/icons'
import { zhCN } from '@xinghunm/compass-ui/locale'
import { defaultTheme } from '@xinghunm/compass-ui/theme'

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
