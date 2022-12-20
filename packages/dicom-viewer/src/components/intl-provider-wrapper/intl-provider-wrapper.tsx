import React, { useState } from 'react';
import { IntlProvider } from 'react-intl';

import zh from 'src/locales/zh.json';
import en from 'src/locales/en.json';

export enum Locale {
  ZH = 'zh',
  EN = 'en',
}

export const LocalContext = React.createContext({
  locale: 'zh',
  changeLocale: (locale: Locale) => {},
});

const getLocal = (locale: Locale) => {
  const messages = { zh, en }[locale];
  return messages;
};

interface Props {
  children: React.ReactElement;
}

export const IntlProviderWrapper: React.FC<Props> = ({ children }) => {
  const [locale, changeLocale] = useState(Locale.ZH);

  return (
    <LocalContext.Provider value={{ locale, changeLocale }}>
      <IntlProvider locale={locale} messages={getLocal(locale)}>
        {children}
      </IntlProvider>
    </LocalContext.Provider>
  );
};
