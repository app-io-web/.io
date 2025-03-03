import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditPhrases.css';

const BASE_URL = process.env.REACT_APP_NOCODB_API_URL;
const API_KEY = process.env.REACT_APP_NOCODB_API_KEY;

function EditPhrases({ user, updateUser, logout }) {
  const [frases, setFrases] = useState([]);
  const [newPhrase, setNewPhrase] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null); // 🔥 Estado para exibir o modal de sucesso
  const navigate = useNavigate();

  // 🔄 **Carrega as frases do usuário**
  useEffect(() => {
    try {
      let parsedFrases = [];
      if (typeof user.FRASES_UNICAS === 'string') {
        parsedFrases = JSON.parse(user.FRASES_UNICAS);
      } else if (Array.isArray(user.FRASES_UNICAS)) {
        parsedFrases = user.FRASES_UNICAS;
      }
      setFrases(parsedFrases);
    } catch (error) {
      console.error('❌ Erro ao carregar frases:', error);
      setFrases([]);
    }
  }, [user]);

  // ✅ **Adiciona uma nova frase**
  const handleAddPhrase = () => {
    if (newPhrase.trim() !== '') {
      setFrases([...frases, newPhrase]);
      setNewPhrase('');
    }
  };

  // ✅ **Edita uma frase existente**
  const handleEditPhrase = (index, updatedText) => {
    const updatedFrases = [...frases];
    updatedFrases[index] = updatedText;
    setFrases(updatedFrases);
  };

  // ✅ **Remove uma frase**
  const handleDeletePhrase = (index) => {
    const updatedFrases = frases.filter((_, i) => i !== index);
    setFrases(updatedFrases);
    setSuccessMessage("✅ Frase Deletada com sucesso!");
  };

  // ✅ **Salva as frases no NocoDB**
  const handleSavePhrases = async () => {
    const apiUrl = `${BASE_URL}/tables/m6xunqz86pfl6bg/records`;

    const payload = [
      {
        Id: user.Id,
        FRASES_UNICAS: JSON.stringify(frases),
      }
    ];

    //console.log("📤 Atualizando frases:", apiUrl);
    //console.log("📤 Payload Enviado:", JSON.stringify(payload, null, 2));

    try {
      const response = await axios.patch(apiUrl, payload, {
        headers: {
          "Content-Type": "application/json",
          "xc-token": API_KEY,
        },
      });

      const data = response.data;

      //console.log("✅ Frases atualizadas com sucesso:", data);

      const updatedUser = {
        ...user,
        FRASES_UNICAS: frases,
      };

      // ✅ Atualiza o estado global e salva no LocalStorage
      updateUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      //console.log("🔄 Frases atualizadas globalmente:", updatedUser);
      // 🔥 Exibe o modal de sucesso
      setSuccessMessage("✅ Frase salva com sucesso!");

      navigate("/main");
    } catch (error) {
      console.error("❌ Erro ao atualizar as frases:", error.message);
    }
  };

  return (
    <div className="edit-phrases-container">
      {/* 📌 Sidebar */}
      <div className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <button className="close-button" onClick={() => setMenuOpen(false)}>×</button>
        <ul>
          <li onClick={() => navigate('/main')}>Home</li>
          <li onClick={() => navigate('/edit-account')}>Conta</li>
          <li onClick={() => navigate('/gallery')}>galeria </li>
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
        <button className="menu-button" onClick={() => setMenuOpen(true)}>☰</button>
        <h1 className="app-title">Editar Frases</h1>
      </div>

      {/* 📌 Lista de Frases */}
      <div className="phrases-list">
        {frases.length > 0 ? (
          frases.map((phrase, index) => (
            <div key={index} className="phrase-item">
              <input
                type="text"
                value={phrase}
                onChange={(e) => handleEditPhrase(index, e.target.value)}
                className="phrase-input"
              />
              <button className="delete-button" onClick={() => handleDeletePhrase(index)}>🗑</button>
            </div>
          ))
        ) : (
          <p>Sem frases cadastradas.</p>
        )}
      </div>

      {/* 📌 Adicionar Nova Frase */}
      <div className="add-phrase-section">
        <input
          type="text"
          value={newPhrase}
          onChange={(e) => setNewPhrase(e.target.value)}
          placeholder="Digite uma nova frase"
          className="add-phrase-input"
        />
        <button onClick={handleAddPhrase} className="add-button">➕ Adicionar</button>
      </div>

      {/* 📌 Botão Salvar Frases */}
      <button className="savePhrasesButton" onClick={handleSavePhrases}>Salvar Frases</button>


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

export default EditPhrases;
