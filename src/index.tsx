import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import CustomTheme from './theme/CustomTheme';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <CustomTheme>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CustomTheme>
  </React.StrictMode>
);
