import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

import { IntlProviderWrapper } from 'src/components';
import { store } from './store';
import { Router } from './router';

const persistor = persistStore(store);

export const App = () => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <IntlProviderWrapper>
        <Router />
      </IntlProviderWrapper>
    </PersistGate>
  </Provider>
);
