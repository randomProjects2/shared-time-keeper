
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Load runtime environment configuration
const loadEnv = async () => {
  // In development or if no env-config.js exists, proceed without it
  if (import.meta.env.DEV) {
    renderApp();
    return;
  }

  try {
    // Try to load the runtime environment config
    const script = document.createElement('script');
    script.src = '/env-config.js';
    script.onload = () => renderApp();
    script.onerror = () => {
      console.warn('Could not load runtime environment config, using build-time env vars');
      renderApp();
    };
    document.head.appendChild(script);
  } catch (error) {
    console.warn('Error loading runtime environment config:', error);
    renderApp();
  }
};

const renderApp = () => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
};

loadEnv();
