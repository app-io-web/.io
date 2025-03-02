import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditAccount.css';

function EditAccount({ user, updateUser, logout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nomeNamorado: '',
    nomeNamorada: '',
    dataInicioNamoro: '',
    eCasado: false,
    dataInicioCasamento: '',
  });

  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.Email,
        password: user.Password,
        nomeNamorado: user.NomeNamorado,
        nomeNamorada: user.NomeNamorada,
        dataInicioNamoro: user.Data_Inicio_Namoro,
        eCasado: user.E_Casado || false,
        dataInicioCasamento: user.Data_Inicio_Casamento || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiUrl = `${process.env.REACT_APP_NOCODB_API_URL}/tables/m6xunqz86pfl6bg/records`;

    const payload = [
        {
            "Id": user.Id,
            "Email": formData.email, 
            "Password": formData.password,
            "NomeNamorado": formData.nomeNamorado,
            "NomeNamorada": formData.nomeNamorada,
            "Data_Inicio_Namoro": formData.dataInicioNamoro,
            "E_Casado": formData.eCasado,
            "Data_Inicio_Casamento": formData.dataInicioCasamento || null
        }
    ];

    console.log("📤 Atualizando:", apiUrl);
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

        console.log("✅ Dados atualizados com sucesso:", data);

        const updatedUser = {
            ...user,
            Email: formData.email,
            Password: formData.password,
            NomeNamorado: formData.nomeNamorado,
            NomeNamorada: formData.nomeNamorada,
            Data_Inicio_Namoro: formData.dataInicioNamoro,
            E_Casado: formData.eCasado,
            Data_Inicio_Casamento: formData.dataInicioCasamento || null
        };

        // ✅ Atualiza o estado global e salva no LocalStorage
        updateUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        console.log("🔄 Usuário atualizado globalmente:", updatedUser);

        navigate("/main");

    } catch (error) {
        console.error("❌ Erro ao atualizar os dados:", error.message);
    }
};




  return (
    <div className="edit-account-container">
      {/* 📌 Sidebar */}
      <div className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <button className="close-button" onClick={toggleMenu}>×</button>
        <ul>
          <li onClick={() => navigate('/main')}>Home</li>
          <li onClick={() => navigate('/gallery')}>Galeria</li>
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
        <h1 className="app-title">Editar Conta</h1>
      </div>

      {/* 📌 Formulário de Edição */}
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Senha:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />

        <label>Nome do Namorado:</label>
        <input type="text" name="nomeNamorado" value={formData.nomeNamorado} onChange={handleChange} required />

        <label>Nome da Namorada:</label>
        <input type="text" name="nomeNamorada" value={formData.nomeNamorada} onChange={handleChange} required />

        <label>Data de Início do Namoro:</label>
        <input type="date" name="dataInicioNamoro" value={formData.dataInicioNamoro} onChange={handleChange} required />

        <label>
          <input type="checkbox" name="eCasado" checked={formData.eCasado} onChange={handleChange} />
          Casado
        </label>

        {formData.eCasado && (
          <>
            <label>Data de Início do Casamento:</label>
            <input type="date" name="dataInicioCasamento" value={formData.dataInicioCasamento} onChange={handleChange} />
          </>
        )}

        <button className='buttonsv' type="submit">Salvar</button>
      </form>
    </div>
  );
}

export default EditAccount;
