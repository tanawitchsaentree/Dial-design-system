import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'dial-tokens/css';
import 'dial-react/styles.css';
import './docs.css';
import './motion.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// G-PWA1: the built book installs as an app and reads offline (public/sw.js). Not in dev, where a
// cached shell would hide edits.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  addEventListener('load', () => { navigator.serviceWorker.register('/sw.js').catch(() => {}); });
}
