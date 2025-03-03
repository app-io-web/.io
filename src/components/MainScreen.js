import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainScreen.css';
import PhraseBox from '../components/PhraseBox';
import bodasData from '../assets/bodas/bodas.json'; // Certifique-se do caminho correto
import CustomAudioPlayer from './CustomAudioPlayer';


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
  const [menuOpen, setMenuOpen] = useState(false); // 🔥 Controla a visibilidade da sidebar
  const [relationshipTime, setRelationshipTime] = useState('');
  const [bodas, setBodas] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [decorImages, setDecorImages] = useState([]);
  const [fadeKey, setFadeKey] = useState(0); // Para controle da animação
  const [isPlaying, setIsPlaying] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);

/*
  const updateLocationInDatabase = async (latitude, longitude) => {
    if (!user) return;
  
    console.log("🔍 Dados do usuário logado:", user);
    console.log("👤 UnicName:", user.UnicName);
    console.log("❤️ UnicNameNamorado:", user.UnicNameNamorado);
    console.log("💖 UnicNameNamorada:", user.UnicNameNamorada);
  
    let fieldToUpdate = "";
    
    // Verifica se o usuário logado é o namorado
    if (user.UnicName && user.UnicName.toLowerCase() === user.UnicNameNamorado?.toLowerCase()) {
      fieldToUpdate = "Localizacao_do_Namorado";
    } else if (user.UnicName && user.UnicName.toLowerCase() === user.UnicNameNamorada?.toLowerCase()) {
      fieldToUpdate = "Localizacao_da_Namorada"; // Verifique se está correto
    } else {
      console.warn("⚠️ Usuário logado não corresponde a namorado(a), localização não será salva.");
      return;
    }
    
  
    console.log(`📡 Atualizando ${fieldToUpdate}:`, { latitude, longitude });
  
    const payload = [
      {
        Id: user.Id,
        [fieldToUpdate]: JSON.stringify({ latitude, longitude }),
      }
    ];
  
    console.log("📤 Enviando atualização para NoCoDB:", JSON.stringify(payload, null, 2));
  
    try {
      const response = await fetch(`${process.env.REACT_APP_NOCODB_API_URL}/tables/m6xunqz86pfl6bg/records`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "xc-token": process.env.REACT_APP_NOCODB_API_KEY,
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error("❌ Erro ao atualizar localização:", data);
        throw new Error(`Erro ao atualizar: ${JSON.stringify(data)}`);
      }
  
      console.log("✅ Localização atualizada com sucesso!", data);
    } catch (error) {
      console.error("❌ Erro na atualização da localização:", error.message);
    }
  };
  useEffect(() => {
    if (!user) return;
  
    let locationInterval;
  
    if ("geolocation" in navigator) {
      setIsUpdatingLocation(true);
  
      
      // 🔄 Atualiza a localização a cada 3 segundos
      locationInterval = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLatitude(latitude);
            setLongitude(longitude);
  
            console.log(`📍 Localização detectada: Lat ${latitude}, Long ${longitude}`);
            updateLocationInDatabase(latitude, longitude);
            setIsUpdatingLocation(false);
          },
          (error) => {
            console.error("❌ Erro ao obter localização:", error);
            setIsUpdatingLocation(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 10000,
          }
        );
      }, 3000); // Atualiza a cada 3 segundos
    } else {
      console.error("⚠️ Geolocalização não suportada neste navegador.");
    }
  
    // 🚨 Limpa o intervalo quando o componente for desmontado ou o usuário sair
    return () => {
      if (locationInterval) clearInterval(locationInterval);
    };
  
  }, [user]); // ⚠️ Garante que a atualização só ocorre se o usuário estiver logado
  

  */
  
  

  const audioRef = useRef(null);

  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // ✅ Verifica se as músicas são JSON válido ou string única
  const musicas = (() => {
    try {
      return user.MusicCasal ? JSON.parse(user.MusicCasal) : []; // Garante um array vazio se não houver músicas
    } catch {
      return Array.isArray(user.MusicCasal) ? user.MusicCasal : user.MusicCasal ? [user.MusicCasal] : [];
    }
  })();


  



    // 📌 Obtém a URL da música prioritária ou a primeira da lista
    const getPrioritizedMusic = () => {
      if (!musicas.length) return ""; // 🔥 Retorna string vazia se não houver músicas
      const prioritizedMusic = musicas.find(music => music.priorizar) || musicas[0];
      return prioritizedMusic?.url || "";
    };

    // 📌 Obtém o nome da música prioritária ou a primeira da lista
    const getPrioritizedMusicName = () => {
      if (!musicas.length) return "Sem Música"; // 🔥 Retorna mensagem padrão
      const prioritizedMusic = musicas.find(music => music.priorizar) || musicas[0];
      return prioritizedMusic?.nome || "Sem Nome";
    };

    





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
    const updateTime = async () => {
      if (user.Data_Inicio_Namoro) {
        const startDate = new Date(user.Data_Inicio_Namoro);
        const now = new Date();
        const diffMs = now - startDate;

        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
        const seconds = Math.floor((diffMs / 1000) % 60);

        setRelationshipTime(`${days} dias, ${hours} horas, ${minutes} min e ${seconds} s`);

        const updatedBodas = await getBodas(days); // 🔥 Agora busca dinamicamente
        setBodas(updatedBodas);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 2000); // 🔄 Atualiza a cada 5 segundos

    return () => clearInterval(interval);
  }, [user]);



  // 📌 Define o nome das bodas com base no tempo de relacionamento
  const getBodas = (days) => {
    let bodas;
    if (days < 365) {
      bodas = bodasData.bodas_de_namoro.find((b) => {
        const tempoEmMeses = parseInt(b.tempo.split(" ")[0]);
        return days < tempoEmMeses * 30;
      });
    } else {
      bodas = bodasData.bodas_de_casamento.find((b) => {
        const tempoEmAnos = parseInt(b.tempo.split(" ")[0]);
        return days < tempoEmAnos * 365;
      });
    }
    return bodas ? bodas.nome : "Bodas não encontradas";
  };


// Pegando as animações aleatórias do css
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


useEffect(() => {
  if (selectedTab % 2 !== 0) {
    setDecorImages(
      getRandomImages().map(img => ({
        src: img,
        animation: getRandomAnimation() 
      }))
    );
  } else {
    setDecorImages([]); 
  }
}, [selectedTab]);


// Alternanado entre Fotos e Frases ao clicar nos seletores
const renderContent = () => {
  if (selectedTab % 2 === 0) {
    const index = (selectedTab / 2) % photos.length; 
    //console.log(`🖼️ Foto - Índice: ${index} | Total Fotos: ${photos.length} | URL:`, photos[index]);
    return photos[index] ? <img src={photos[index]} alt="Casal" className="photo" /> : <p>Sem fotos</p>;
  } else {
    const index = Math.floor(selectedTab / 2) % frases.length; 
    //console.log(`📝 Frase - Índice: ${index} | Total Frases: ${frases.length} | Conteúdo:`, frases[index]);
    return frases[index] ? <PhraseBox phrase={frases[index]} /> : <p>Sem frases</p>;
  }
};

useEffect(() => {
  const interval = setInterval(() => {
    setSelectedTab((prevTab) => {
      const totalPhotos = photos.length;
      const totalFrases = frases.length;
      const maxContent = totalPhotos + totalFrases; // 🔄 Total de elementos

      // 🔥 Alterna entre foto e frase corretamente
      const newTab = (prevTab + 1) % maxContent;

      //console.log(`🔄 Alternando tab: Antes ${prevTab} | Depois ${newTab} | Total: ${maxContent}`);

      return newTab;
    });
  }, 9000);

  return () => clearInterval(interval);
}, [photos, frases]); // 🔥 Dependências corrigidas




  


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
   {/* 📌 Sidebar */}
      <div className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <button className="close-button" onClick={toggleMenu}>×</button>
        <ul>
          <li onClick={() => navigate('/edit-account')}>Conta</li>
          <li onClick={() => navigate('/gallery')}>Galeria</li> 
          <li onClick={() => navigate('/edit-phrases')}>Editar Frases</li>
          <li onClick={() => navigate('/music-casal')}>Musica do Casal</li>
          <li onClick={logout}>Sair</li>
        </ul>
            {/* 🔥 Assinatura no bottom da sidebar */}
          <div className="sidebar-footer">
          <p>Desenvolvido por <span className="highlight">Jota</span></p>
        </div>
      </div>

      {/* 📌 Cabeçalho */}
      <div className="header">
        <button className="menu-buttonPg" onClick={toggleMenu}>☰</button>
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
      <p className="bodas-text">Bodas: {bodas}</p>
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${Math.min((parseInt(relationshipTime) / 365) * 100, 100)}%` }}></div>
      </div>
        {/* 🎵 Player de Música */}
        <div className="music-player-container">
          {musicas.length > 0 ? (
            <CustomAudioPlayer src={getPrioritizedMusic()} name={getPrioritizedMusicName()} showName={false} />
          ) : (
            <p className="no-music-text">Nenhuma música disponível</p>
          )}
        </div>



      {/* 🎵 Elemento de áudio oculto */}
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)}>
        {musicas.length > 0 && <source src={getPrioritizedMusic()} type="audio/mp3" />}
      </audio>


    </div>
  );
}

export default MainScreen;