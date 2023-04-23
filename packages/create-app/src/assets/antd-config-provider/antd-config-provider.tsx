import React, { useContext } from 'react';
import { ConfigProvider } from 'antd';

import zhCN from 'antd/es/locale/zh_CN';
import enUS from 'antd/es/locale/en_US';

import { LocalContext, Locale } from '../intl-provider-wrapper';

interface Props {
  children: React.ReactElement;
}

export const AntdConfigProvider: React.FC<Props> = ({ children }) => {
  const { locale } = useContext(LocalContext);

  const antdLocal = locale === Locale.ZH ? zhCN : enUS;

  return <ConfigProvider locale={antdLocal}>{children}</ConfigProvider>;
};
