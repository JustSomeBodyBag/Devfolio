// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AnalyticsProvider } from './context/AnalyticsContext';
import './index.css';              // базовые стили
import './styles/tailwind.css';   // tailwind, если он отдельно

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AnalyticsProvider>
          <App />
        </AnalyticsProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
