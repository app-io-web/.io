import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CustomAudioPlayer from './CustomAudioPlayer'; // 🚀 Importa o novo player
import './MusicCasal.css';

const BASE_URLFT = "https://nocodb.nexusnerds.com.br";
const BASE_URL = process.env.REACT_APP_NOCODB_API_URL;
const API_KEY = process.env.REACT_APP_NOCODB_API_KEY;

function MusicCasal({ user, updateUser, logout }) {
  const [musicas, setMusicas] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [musicName, setMusicName] = useState("");
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // 📌 **Carrega as músicas do banco**
  useEffect(() => {
    try {
      let parsedMusicas = [];
      if (typeof user.MusicCasal === 'string') {
        parsedMusicas = JSON.parse(user.MusicCasal);
      } else if (Array.isArray(user.MusicCasal)) {
        parsedMusicas = user.MusicCasal;
      }
      setMusicas(parsedMusicas);
    } catch (error) {
      console.error('❌ Erro ao carregar músicas:', error);
      setMusicas([]);
    }
  }, [user]);

  // 📌 **Seleciona arquivo**
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // 📌 **Abre o seletor de arquivos ao clicar**
  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  // 📌 **Faz o upload da música**
  const handleUpload = async () => {
    if (!selectedFile || !musicName.trim()) {
      setError('❌ Selecione um arquivo e escolha um nome antes de enviar.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      console.log('📤 Enviando arquivo:', selectedFile.name);

      const response = await axios.post(
        `${BASE_URL}/storage/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'xc-token': API_KEY
          }
        }
      );

      console.log('✅ Upload bem-sucedido:', response.data);

      if (!response.data || response.data.length === 0 || !response.data[0]?.path) {
        throw new Error("Erro ao obter URL da música.");
      }

      const filePath = response.data[0].path;
      const fileUrl = `${BASE_URLFT}/${filePath}`;

      // 🔥 Cria um objeto com nome e URL, inicializando `priorizar` como false
      const newMusic = { nome: musicName, url: fileUrl, priorizar: false };

      // 🔥 Atualiza a lista de músicas no estado
      const updatedMusicas = [...musicas, newMusic];
      setMusicas(updatedMusicas);
      setSelectedFile(null);
      setMusicName("");

      // 🔥 Atualiza o banco de dados
      await updateMusicList(updatedMusicas);
      alert("✅ Música enviada com sucesso!");

    } catch (error) {
      console.error("❌ Erro no upload:", error);
      setError("Erro ao enviar a música.");
    }
  };

  // 📌 **Atualiza músicas no NoCoDB**
  const updateMusicList = async (updatedMusicas) => {
    try {
      console.log("📤 Atualizando banco de dados:", updatedMusicas);

      const response = await axios.patch(
        `${BASE_URL}/tables/m6xunqz86pfl6bg/records`,
        [
          {
            Id: user.Id,
            MusicCasal: JSON.stringify(updatedMusicas)
          }
        ],
        {
          headers: {
            "Content-Type": "application/json",
            "xc-token": API_KEY,
          }
        }
      );

      console.log("✅ Músicas atualizadas com sucesso!", response.data);
    } catch (error) {
      console.error("❌ Erro ao atualizar banco:", error);
    }
  };

  // 📌 **Remove música**
  const handleDelete = async (musicUrl) => {
    const updatedMusicas = musicas.filter(music => music.url !== musicUrl);
    setMusicas(updatedMusicas);
    await updateMusicList(updatedMusicas);
    alert("🗑 Música removida!");
  };

  // 📌 **Define a música prioritária**
  const handlePrioritize = async (index) => {
    const updatedMusicas = musicas.map((music, i) => ({
      ...music,
      priorizar: i === index, // Somente um pode ser true
    }));

    setMusicas(updatedMusicas);
    await updateMusicList(updatedMusicas);
    alert("✅ Música priorizada com sucesso!");
  };


  const handleSaveMusic = async () => {
    const apiUrl = `${process.env.REACT_APP_NOCODB_API_URL}/tables/m6xunqz86pfl6bg/records`;

    const payload = [
        {
            "Id": user.Id,
            "MusicCasal": JSON.stringify(musicas) // 🔥 Salva as músicas no JSON
        }
    ];

    console.log("📤 Atualizando músicas:", apiUrl);
    console.log("📤 Payload Enviado:", JSON.stringify(payload, null, 2));

    try {
        const response = await fetch(apiUrl, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "xc-token": process.env.REACT_APP_NOCODB_API_KEY,
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("❌ Erro na atualização:", data);
            throw new Error(`Erro na atualização: ${JSON.stringify(data)}`);
        }

        console.log("✅ Músicas atualizadas com sucesso:", data);

        const updatedUser = {
            ...user,
            MusicCasal: musicas // 🔥 Atualiza o JSON das músicas no estado global
        };

        // ✅ Atualiza o estado global e salva no LocalStorage
        updateUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        console.log("🔄 Músicas atualizadas globalmente:", updatedUser);

        // ⏳ Pequeno delay antes de redirecionar para garantir atualização
        setTimeout(() => {
            navigate("/main"); // 🔄 Redireciona para a tela inicial
            window.location.reload(); // 🔄 Força a atualização dos dados na tela principal
        }, 500);

    } catch (error) {
        console.error("❌ Erro ao atualizar as músicas:", error.message);
    }
};


  return (
    <div className="musicUploadContainer">
      {/* 📌 Sidebar */}
      <div className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <button className="close-button" onClick={toggleMenu}>×</button>
        <ul>
          <li onClick={() => navigate('/main')}>Home</li>
          <li onClick={() => navigate('/edit-account')}>Conta</li>
          <li onClick={() => navigate('/gallery')}>galeria </li>
          <li onClick={logout}>Sair</li>
        </ul>
      </div>

      {/* 📌 Cabeçalho */}
      <div className="header">
        <button className="menu-button" onClick={toggleMenu}>☰</button>
        <h1 className="app-title">Músicas do Casal</h1>
      </div>

      {/* 📌 Upload */}
      <div className="uploadBoxIn" onClick={handleFileClick}>
        <p>Clique para selecionar uma música</p>
        <input
          type="file"
          accept="audio/mp3"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hiddenInput"
        />
      </div>

      {/* 📌 Campo para nome da música */}
      {selectedFile && (
        <input
          type="text"
          placeholder="Digite o nome da música"
          value={musicName}
          onChange={(e) => setMusicName(e.target.value)}
          className="musicInput"
        />
      )}

      {/* 📌 Botões de Ação (Enviar & Cancelar) */}
      {selectedFile && (
        <div className="uploadButtons">
          <button onClick={handleUpload} className="uploadButton">Enviar</button>
          <button
            onClick={() => {
              setSelectedFile(null);
              setMusicName("");
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
            className="cancelButton"
          >
            Cancelar
          </button>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}

      {/* 📌 Lista de Músicas */}
      <div className="musicList">
        {musicas.length > 0 ? (
          musicas.map((music, index) => (
            <div key={index} className="musicItem">
            <CustomAudioPlayer src={music.url} name={music.nome} showName={true} />

              <input 
                type="radio" 
                name="priorizar" 
                checked={music.priorizar} 
                onChange={() => handlePrioritize(index)} 
              />
              <button className="delete-button" onClick={() => handleDelete(music.url)}>🗑</button>
            </div>
          ))
        ) : <p>Sem músicas ainda.</p>}
      </div>
      {/* 📌 Botão Salvar Alterações */}
        <button className="saveMusicButton" onClick={handleSaveMusic}>
            Salvar Alterações
        </button>

    </div>
  );
}

export default MusicCasal;
