import { Routes, Route, BrowserRouter } from 'react-router-dom';

import { Home } from './home';
import { Page1 } from './page1';
import { Page2 } from './page2';

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="page1" element={<Page1 />} />
        <Route path="page2" element={<Page2 />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};
