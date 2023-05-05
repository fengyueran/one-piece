import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HashRouter } from 'react-router-dom';

import { IndexPage } from './pages/index';

export const RouteMap = {
  ROOT: '/',
};

export const Router = () => (
  <HashRouter>
    <Routes>
      <Route path={RouteMap.ROOT} element={<IndexPage />} />
    </Routes>
  </HashRouter>
);
