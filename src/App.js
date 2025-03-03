import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import MainScreen from './components/MainScreen';
import EditAccount from './components/EditAccount';
import Gallery from './components/Gallery';
import EditPhrases from './components/EditPhrases';
import MusicCasal from './components/MusicCasal';
import IOSInstallPrompt from './hooks/useIOSInstallPrompt'; // ✅ Importa o prompt do iOS
import './App.css';

// ✅ Importando função para instalar no Android
import usePWAInstallPrompt from './hooks/usePWAInstallPrompt';

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    const tokenExpiration = localStorage.getItem("token");

    // 🔄 Verifica se há um usuário salvo e se o token ainda é válido
    if (storedUser && tokenExpiration && Date.now() < parseInt(tokenExpiration)) {
      return JSON.parse(storedUser);
    } else {
      // 🔥 Se o token estiver expirado, remove os dados e retorna null
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return null;
    }
  });

  const showInstallPrompt = usePWAInstallPrompt();

  const handleLogin = (userData, identifier) => {
    console.log('🔑 Usuário autenticado:', userData);
  
    let unicName = null;
  
    // Definir corretamente o UnicName baseado no login
    if (identifier.toLowerCase() === userData.UnicNameNamorado?.toLowerCase()) {
      unicName = userData.UnicNameNamorado;
    } else if (identifier.toLowerCase() === userData.UnicNameNamorada?.toLowerCase()) {
      unicName = userData.UnicNameNamorada;
    } else {
      console.warn("⚠️ Nome de login não corresponde a nenhum dos registrados!");
    }
  
    const updatedUser = {
      ...userData,
      UnicName: unicName, // 🔥 Armazena corretamente o UnicName do usuário logado
    };
  
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    localStorage.setItem('token', Date.now() + (5 * 60 * 1000)); // 🔥 5 minutos de sessão
    window.location.href = "/main";
  };
  

  const handleLogout = () => {
    console.log("🚪 Logout acionado e sessão será encerrada...");
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = "#/";
  };
  
  return (
    <Router>
      <div className="App">
        {/* ✅ Agora o prompt do iOS está em um componente separado */}
        <IOSInstallPrompt />

        <Routes>
          <Route path="/" element={user ? <Navigate to="/main" /> : <Login handleLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/main" element={user ? <MainScreen user={user} logout={handleLogout} /> : <Navigate to="/" />} />
          <Route path="/edit-account" element={user ? <EditAccount user={user} updateUser={setUser} logout={handleLogout} /> : <Navigate to="/" />} />
          <Route path="/gallery" element={user ? <Gallery user={user} updateUser={setUser} /> : <Navigate to="/" />} />
          <Route path="/edit-phrases" element={user ? <EditPhrases user={user} updateUser={setUser} logout={handleLogout} /> : <Navigate to="/" />} />
          <Route path="/music-casal" element={user ? <MusicCasal user={user} updateUser={setUser} logout={handleLogout} /> : <Navigate to="/" />} />
          <Route path="/gallery" element={user ? <Gallery user={user} updateUser={setUser} logout={handleLogout} /> : <Navigate to="/" />} />
        </Routes>

        {/* 📢 Botão para instalação no Android */}
        {showInstallPrompt && (
          <button className="install-button" onClick={showInstallPrompt}>
            📥 Instalar MyLove App
          </button>
        )}
      </div>
    </Router>
  );
}

export default App;
