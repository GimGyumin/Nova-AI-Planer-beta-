import React from 'react';
import ReactDOM from 'react-dom/client';
import MobileWrapper from './mobile/MobileWrapper';
import App from './main';
// Ensure mobile-specific stylesheet is loaded after the app's global styles so it can override defaults
import './mobile/mobile.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <MobileWrapper>
      <App />
    </MobileWrapper>
  </React.StrictMode>
);
