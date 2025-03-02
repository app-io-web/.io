import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './ios-install-prompt.css';

const IOSInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const location = useLocation(); // ✅ Obtém a rota atual

  useEffect(() => {
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    // ✅ Exibe o prompt apenas no login e cadastro
    if (isIOS && !isStandalone && (location.pathname === '/' || location.pathname === '/signup')) {
      setShowPrompt(true);
    } else {
      setShowPrompt(false);
    }
  }, [location]);

  if (!showPrompt) return null;

  return (
    <div className="ios-install-prompt">
      <div className="install-box">
        <button className="close-button" onClick={() => setShowPrompt(false)}>✖</button>
        <p className="install-text">
          📲 Para instalar este app, toque no 
          <span className="share-icon"> 🔗 </span>
          <strong> ícone de compartilhar </strong> e selecione 
          <strong> "Adicionar à Tela Inicial" </strong>.
        </p>
      </div>
    </div>
  );
};

export default IOSInstallPrompt;
