import React, { useState, useEffect } from 'react';
import './MainScreen.css';

function MainScreen({ user, logout }) {
  const [relationshipTime, setRelationshipTime] = useState('');
  const [bodas, setBodas] = useState('');
  const [photoIndex, setPhotoIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // ✅ Verifica se as fotos são JSON ou string única
  const photos = (() => {
    try {
      return JSON.parse(user.FOTOS_JSON);
    } catch {
      return Array.isArray(user.FOTOS_JSON) ? user.FOTOS_JSON : [user.FOTOS_JSON];
    }
  })();

  // 📌 Simula um tempo de carregamento antes de exibir os dados
  useEffect(() => {
    setTimeout(() => setLoading(false), 2000); // Aguarda 2 segundos antes de exibir a tela
  }, []);

  // 📌 Calcula o tempo de relacionamento e atualiza em tempo real
  useEffect(() => {
    const updateTime = () => {
      if (user.Data_Inicio_Namoro) {
        const startDate = new Date(user.Data_Inicio_Namoro);
        const now = new Date();
        const diffMs = now - startDate;

        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
        const seconds = Math.floor((diffMs / 1000) % 60);

        setRelationshipTime(`${days} dias, ${hours} horas, ${minutes} min e ${seconds} s`);
        setBodas(getBodas(days));
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [user]);

  // 📌 Define o nome das bodas com base no tempo de relacionamento
  const getBodas = (days) => {
    if (days < 365) return 'Papel';
    if (days < 730) return 'Algodão';
    if (days < 1095) return 'Trigo';
    return 'Ouro';
  };

  // 📌 Alterna a foto dinamicamente
  const shufflePhoto = () => {
    if (photos.length > 1) {
      setPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
    }
  };

// 📌 Tela de carregamento animada
if (loading) {
    return (
      <div className="loading-container">
        <h1 className="lePeek">
          {"Carregando...".split("").map((char, index) => (
            <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
              {char}
            </span>
          ))}
        </h1>
      </div>
    );
  }
  

  return (
    <div className="main-container">
      {/* Cabeçalho */}
      <div className="header">
        <button className="menu-button">☰</button>
        <h1 className="app-title">MyLove</h1>
      </div>

      {/* Nome do casal */}
      <h2 className="couple-names">{user.NomeNamorado} & {user.NomeNamorada}</h2>

      {/* Foto do casal */}
      <div className="photo-container">
        {photos.length > 0 ? (
          <img src={photos[photoIndex]} alt="Casal" className="photo" />
        ) : (
          <p>Sem fotos</p>
        )}
      </div>

      {/* Tempo de relacionamento */}
      <p className="relationship-text">Tempo de Relacionamento</p>
      <p className="relationship-days">{relationshipTime}</p>

      {/* Barra de progresso das bodas */}
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${Math.min((parseInt(relationshipTime) / 365) * 100, 100)}%` }}></div>
      </div>
      <p className="bodas-text">Bodas: {bodas}</p>

      {/* Botões de embaralhar fotos e logout */}
      <button onClick={shufflePhoto} className="shuffle-button">🔄</button>
      <button onClick={() => { 
        console.log("🔴 Saindo...");
        logout();
        }} className="logout-button">
        Sair
        </button>

    </div>
  );
}

export default MainScreen;
