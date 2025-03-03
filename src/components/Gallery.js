import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Gallery.css';

const BASE_URLFT = "https://nocodb.nexusnerds.com.br"; // 🚀 URL base do NoCoDB
const BASE_URL = process.env.REACT_APP_NOCODB_API_URL;
const API_KEY = process.env.REACT_APP_NOCODB_API_KEY;

function Gallery({ user, updateUser, logout}) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // 🔥 Estado para exibir o modal de sucesso
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const holdTimeout = useRef(null); // Armazena o tempo do clique
  const [menuOpen, setMenuOpen] = useState(false);


  

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };


  // 📌 **Carregar fotos do banco**
  useEffect(() => {
    try {
      let parsedPhotos = [];
      if (typeof user.FOTOS_JSON === 'string') {
        parsedPhotos = JSON.parse(user.FOTOS_JSON);
      } else if (Array.isArray(user.FOTOS_JSON)) {
        parsedPhotos = user.FOTOS_JSON;
      }
      setPhotos(parsedPhotos);
    } catch (error) {
      console.error('❌ Erro ao processar fotos:', error);
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // 📌 **Seleciona arquivo**
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // 📌 **Abre o seletor de arquivos ao clicar na área**
  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  // 📌 **Faz o upload da foto**
  const handleUpload = async () => {
    if (!selectedFile) {
      setError('❌ Selecione um arquivo antes de enviar.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      //console.log('📤 Enviando arquivo:', selectedFile.name);

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

      //console.log('✅ Upload bem-sucedido:', response.data);

      if (!response.data || response.data.length === 0 || !response.data[0]?.path) {
        throw new Error("Erro ao obter URL da imagem.");
      }

      const filePath = response.data[0].path;
      const fileUrl = `${BASE_URLFT}/${filePath}`;

      // 🔥 Atualiza a lista de fotos no estado
      const updatedPhotos = [...photos, fileUrl];
      setPhotos(updatedPhotos);
      setSelectedFile(null);

      // 🔥 Atualiza o banco de dados
      await updatePhotoList(updatedPhotos);
      // 🔥 Exibe o modal de sucesso
      setSuccessMessage("✅ Foto enviada com sucesso!");

    } catch (error) {
      console.error("❌ Erro no upload:", error);
      setError("Erro ao enviar a foto.");
    }
  };

  // 📌 **Atualiza fotos no NoCoDB**
  const updatePhotoList = async (updatedPhotos) => {
    try {
      //console.log("📤 Atualizando banco de dados:", updatedPhotos);

      const response = await axios.patch(
        `${BASE_URL}/tables/m6xunqz86pfl6bg/records`,
        [
          {
            Id: user.Id,
            FOTOS_JSON: JSON.stringify(updatedPhotos)
          }
        ],
        {
          headers: {
            "Content-Type": "application/json",
            "xc-token": API_KEY,
          }
        }
      );

      //console.log("✅ Fotos atualizadas com sucesso!", response.data);
    } catch (error) {
      console.error("❌ Erro ao atualizar banco:", error);
    }
  };

  // 📌 **Detecta o clique longo de 2 segundos**
  const handleTouchStart = (photo) => {
    holdTimeout.current = setTimeout(() => {
      setPhotoToDelete(photo);
      setModalOpen(true);
    }, 2000); // 2 segundos (2000ms)
  };

  // 📌 **Cancela o clique longo se soltar antes do tempo**
  const handleTouchEnd = () => {
    if (holdTimeout.current) {
      clearTimeout(holdTimeout.current);
    }
  };

  // 📌 **Remove foto após confirmação**
  const confirmDeletePhoto = async () => {
    if (!photoToDelete) return;

    const updatedPhotos = photos.filter(photo => photo !== photoToDelete);
    setPhotos(updatedPhotos);
    setModalOpen(false);
    setPhotoToDelete(null);
    await updatePhotoList(updatedPhotos);
    // 🔥 Exibe o modal de sucesso após exclusão
    setSuccessMessage("Foto excluída com sucesso!");
  };

  const handleSavePhotos = async () => {
    const apiUrl = `${process.env.REACT_APP_NOCODB_API_URL}/tables/m6xunqz86pfl6bg/records`;

    const payload = [
        {
            "Id": user.Id, 
            "FOTOS_JSON": JSON.stringify(photos) // 🔥 Salva as fotos no JSON
        }
    ];

    //console.log("📤 Atualizando fotos:", apiUrl);
    //console.log("📤 Payload Enviado:", JSON.stringify(payload, null, 2));

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

        //console.log("✅ Fotos atualizadas com sucesso:", data);

        const updatedUser = {
            ...user,
            FOTOS_JSON: photos // 🔥 Atualiza o JSON das fotos no estado global
        };

        // ✅ Atualiza o estado global e salva no LocalStorage
        updateUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        //console.log("🔄 Fotos atualizadas globalmente:", updatedUser);



        // ⏳ Pequeno delay antes de redirecionar para garantir atualização
        setTimeout(() => {
            navigate("/main"); // 🔄 Redireciona para a tela inicial
            window.location.reload(); // 🔄 Força a atualização dos dados na tela principal
        }, 500);

    } catch (error) {
        console.error("❌ Erro ao atualizar as fotos:", error.message);
    }
};



  return (
    <div className="photoUploadContainer">
        {/* 📌 Sidebar */}
        <div className={`sidebar ${menuOpen ? 'open' : ''}`}>
          <button className="close-button" onClick={toggleMenu}>×</button>
          <ul>
            <li onClick={() => navigate('/edit-account')}>Conta</li>
            <li onClick={() => navigate('/gallery')}>Galeria</li> 
            <li onClick={() => navigate('/edit-phrases')}>Editar Frases</li>
            <li onClick={() => navigate('/music-casal')}>Música do Casal</li>
            <li onClick={logout}>Sair</li>

          </ul>
          
          {/* 🔥 Assinatura no bottom da sidebar */}
          <div className="sidebar-footer">
            <p>Desenvolvido por <span className="highlight">Jota</span></p>
          </div>
        </div>


      {/* 📌 Cabeçalho */}
      <div className="header">
        <button className="menu-button" onClick={toggleMenu}>☰</button>
        <h1 className="app-title">My Gallery</h1>
      </div>


        {/* 📌 Upload */}
        <div className="uploadBoxIn" onClick={handleFileClick}>
        <p>Clique para selecionar</p>
        <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hiddenInput"
        />
        </div>

        {/* 📌 Botões de Ação (Enviar & Cancelar) */}
        {selectedFile && (
        <div className="uploadButtons">
            <button onClick={handleUpload} className="uploadButton">Enviar Foto</button>
            <button
            onClick={() => {
                setSelectedFile(null); 
                if (fileInputRef.current) {
                fileInputRef.current.value = ""; // 🔥 Reseta o input manualmente
                }
            }}
            className="cancelButton"
            >
            Cancelar
            </button>
        </div>
        )}



      {error && <p className="error-message">{error}</p>}

        {/* 📌 Galeria */}
        {loading ? (
        <p>Carregando...</p>
        ) : (
        <div className="photoGrid">
            {photos.length > 0 ? (
            photos.map((photo, index) => (
                <div
                key={index}
                className="photoItem"
                onMouseDown={() => handleTouchStart(photo)}
                onMouseUp={handleTouchEnd}
                onTouchStart={() => handleTouchStart(photo)}
                onTouchEnd={handleTouchEnd}
                >
                <img src={photo} alt={`Foto ${index}`} className="uploadedPhoto" />
                </div>
            ))
            ) : (
            <p>Sem fotos ainda.</p>
            )}
        </div>
        )}

        {/* 📌 Botão Salvar Fotos */}
        <button className="savePhotosButton" onClick={handleSavePhotos}>
        Salvar Alterações
        </button>



      {/* 📌 Modal de Confirmação */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Tem certeza que deseja excluir esta foto?</p>
            <button className="cancel-button" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button className="confirm-button" onClick={confirmDeletePhoto}>Excluir</button>
          </div>
        </div>
      )}

       {/* 📌 Modal de Sucesso */}
       {successMessage && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>{successMessage}</p>
            <button className="ButtonModal" onClick={() => setSuccessMessage(null)}>Fechar</button>
          </div>
        </div>
      )}

      
    </div>
  );
}

export default Gallery;
