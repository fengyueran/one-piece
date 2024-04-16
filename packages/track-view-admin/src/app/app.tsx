import { Routes, Route, BrowserRouter } from 'react-router-dom';

import './axios';
import { HomePage } from '../pages/home';
import { HotmapPage } from '../pages/hotmap';

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="hotmap" element={<HotmapPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
};
