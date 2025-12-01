import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// PWA update handling
if ('serviceWorker' in navigator) {
  // Listen for service worker updates
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    // Service worker updated, reload to get new version
    window.location.reload();
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
