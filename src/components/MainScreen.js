import React, { useState, useEffect } from 'react';
import './MainScreen.css';
import PhraseBox from '../components/PhraseBox';

// Importa dinamicamente todas as imagens da pasta 3dModels
const importAll = (r) => r.keys().map(r);
const modelImages = importAll(require.context('../assets/3dModels', false, /\.(png|jpe?g|svg)$/));

// Função para obter 3 imagens aleatórias sem repetição
const getRandomImages = () => {
  let selectedImages = [];
  while (selectedImages.length < 3) {
    const randomImage = modelImages[Math.floor(Math.random() * modelImages.length)];
    if (!selectedImages.includes(randomImage)) {
      selectedImages.push(randomImage);
    }
  }
  return selectedImages;
};

function MainScreen({ user, logout }) {
  const [relationshipTime, setRelationshipTime] = useState('');
  const [bodas, setBodas] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [decorImages, setDecorImages] = useState([]);
  const [fadeKey, setFadeKey] = useState(0); // Para controle da animação

  // ✅ Verifica se as fotos são JSON ou string única
  const photos = (() => {
    try {
      return JSON.parse(user.FOTOS_JSON);
    } catch {
      return Array.isArray(user.FOTOS_JSON) ? user.FOTOS_JSON : [user.FOTOS_JSON];
    }
  })();

  // ✅ Verifica se as frases são JSON ou string única
  const frases = (() => {
    try {
      return JSON.parse(user.FRASES_UNICAS);
    } catch {
      return Array.isArray(user.FRASES_UNICAS) ? user.FRASES_UNICAS : [user.FRASES_UNICAS];
    }
  })();

  // 📌 Simula um tempo de carregamento antes de exibir os dados
  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  // 📌 Atualiza o tempo de relacionamento em tempo real
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


// 📌 Alterna entre Fotos e Frases ao clicar nos seletores
const renderContent = () => {
  if (selectedTab % 2 === 0) {
    const index = (selectedTab / 2) % photos.length; // Garante que percorre corretamente as fotos
    //console.log(`🖼️ Foto - Índice: ${index} | Total Fotos: ${photos.length} | URL:`, photos[index]);
    return photos[index] ? <img src={photos[index]} alt="Casal" className="photo" /> : <p>Sem fotos</p>;
  } else {
    const index = Math.floor(selectedTab / 2) % frases.length; // Garante que percorre corretamente todas as frases
    //console.log(`📝 Frase - Índice: ${index} | Total Frases: ${frases.length} | Conteúdo:`, frases[index]);
    return frases[index] ? <PhraseBox phrase={frases[index]} /> : <p>Sem frases</p>;
  }
};


  


// Função para escolher uma animação aleatória
const getRandomAnimation = () => {
  const animations = [
    "animation-fadeIn",
    "animation-Heartbeat",
    "animation-WobbleTop",
    "animation-ScaleInForwardB",
    "animation-BounceTOP",
    "animation-SnakeLeft"
  ];
  return animations[Math.floor(Math.random() * animations.length)];
};




// 🔥 Atualiza as imagens decorativas SOMENTE quando muda para frase
useEffect(() => {
  if (selectedTab % 2 !== 0) {
    setDecorImages(
      getRandomImages().map(img => ({
        src: img,
        animation: getRandomAnimation() // Adiciona uma animação aleatória a cada imagem
      }))
    );
  } else {
    setDecorImages([]); // Limpa as imagens decorativas quando não for frase
  }
}, [selectedTab]);







useEffect(() => {
  const interval = setInterval(() => {
    setSelectedTab((prevTab) => {
      const maxContent = Math.max(photos.length, frases.length); // Número total de itens
      const newTab = (prevTab + 1) % maxContent; // 🔄 Garante looping infinito entre frases e fotos
      console.log(`🔄 Alternando tab: Antes ${prevTab} | Depois ${newTab} | Total: ${maxContent}`);
      return newTab;
    });
  }, 9000);

  return () => clearInterval(interval);
}, [photos.length, frases.length]);



  


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

      {/* Conteúdo Dinâmico (Foto ou Frase) */}
      <div className="photo-container">
        <div className="fade-container" key={fadeKey}>
          {selectedTab % 2 === 0 && (
            <div className={`fade-content ${selectedTab % 2 === 0 ? 'active' : ''}`}>
              {renderContent()}
            </div>
          )}

      {/* 🔥 Elementos decorativos aparecem somente quando há frase */}
      {selectedTab % 2 !== 0 && decorImages.length > 0 && (
        <div className="decor-container fade-content active">
          {decorImages.map((img, index) => (
            <img 
              key={index} 
              src={img.src} 
              alt="Decor" 
              className={`decor ${img.animation} ${
                index === 0 ? "bottom-left-image" :
                index === 1 ? "bottom-right-image" : 
                "top-right-image"
              }`} 
            />
          ))}
        </div>
      )}


          {/* 🔥 Renderiza a frase por cima */}
          {selectedTab % 2 !== 0 && (
            <div className={`fade-content ${selectedTab % 2 !== 0 ? 'active' : ''}`}>
              {renderContent()}
            </div>
          )}
        </div>
      </div>


      {/* 🔄 Seletor de conteúdo */}
      <div className="selector-container">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className={`selector-dot ${selectedTab % 4 === index ? 'active' : ''}`}
            onClick={() => setSelectedTab(index)}
          />
        ))}
      </div>



      {/* Tempo de relacionamento */}
      <p className="relationship-text">Tempo de Relacionamento</p>
      <p className="relationship-days">{relationshipTime}</p>

      {/* Barra de progresso das bodas */}
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${Math.min((parseInt(relationshipTime) / 365) * 100, 100)}%` }}></div>
      </div>
      <p className="bodas-text">Bodas: {bodas}</p>

      {/* Botão de logout */}
      <button onClick={logout} className="logout-button">
        Sair
      </button>
    </div>
  );
}

export default MainScreen;
