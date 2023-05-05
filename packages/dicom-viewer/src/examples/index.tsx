import React from 'react';
import ReactDOM from 'react-dom/client';

import { Counter } from '../components';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Counter />
  </React.StrictMode>
);
