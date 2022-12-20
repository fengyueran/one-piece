import React, { useContext, useMemo } from 'react';
import { ConfigProvider } from 'antd';

import zhCN from 'antd/es/locale/zh_CN';

import { LocalContext, Locale } from '../intl-provider-wrapper';

interface Props {
  children: React.ReactElement;
}

export const AntdConfigProvider: React.FC<Props> = ({ children }) => {
  const { locale } = useContext(LocalContext);

  const antdLocal = useMemo(() => {
    if (locale === Locale.ZH) return zhCN;
    return zhCN;
  }, [locale]);

  return <ConfigProvider locale={antdLocal}>{children}</ConfigProvider>;
};
