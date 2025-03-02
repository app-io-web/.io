import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
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
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const showInstallPrompt = usePWAInstallPrompt();

  useEffect(() => {
    const tokenExpiration = localStorage.getItem("token");
    if (tokenExpiration && Date.now() > parseInt(tokenExpiration)) {
      handleLogout();
    }
  }, []);

  const handleLogin = (userData) => {
    console.log('🔑 Usuário autenticado:', userData);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', Date.now() + (5 * 60 * 1000)); 
    window.location.href = "#/main";
  };

  const handleLogout = () => {
    console.log("🚪 Saindo e limpando sessão...");
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
          <Route path="/" element={<Login handleLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/main" element={user ? <MainScreen user={user} logout={handleLogout} /> : <Login handleLogin={handleLogin} />} />
          <Route path="/edit-account" element={user ? <EditAccount user={user} updateUser={setUser} logout={handleLogout} /> : <Login handleLogin={handleLogin} />} />
          <Route path="/gallery" element={user ? <Gallery user={user} updateUser={setUser} /> : <Login handleLogin={handleLogin} />} />
          <Route path="/edit-phrases" element={user ? <EditPhrases user={user} updateUser={setUser} logout={handleLogout} /> : <Login handleLogin={handleLogin} />} />
          <Route path="/music-casal" element={user ? <MusicCasal user={user} updateUser={setUser} logout={handleLogout} /> : <Login handleLogin={handleLogin} />} />
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
