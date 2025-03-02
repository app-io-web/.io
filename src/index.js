import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration'; // 🚀 Importa o Service Worker

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 🔥 Ativa o Service Worker para suporte offline e PWA
serviceWorkerRegistration.register();

// 🔎 Monitoramento de performance (opcional)
reportWebVitals();
