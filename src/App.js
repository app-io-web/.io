import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import MainScreen from './components/MainScreen';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  // ✅ Função de login: salva o usuário e cria um token temporário
  const handleLogin = (userData) => {
    console.log('🔑 Usuário autenticado:', userData);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // ✅ Armazena no LocalStorage
    localStorage.setItem('token', Date.now() + (5 * 60 * 1000)); // ✅ Token de 5 min
    window.location.href = "#/main"; // ✅ Redireciona para a tela principal
  };

  // ❌ Função de logout: limpa os dados e redireciona para login
  const handleLogout = () => {
    console.log("🚪 Saindo e limpando sessão...");
    setUser(null);
    localStorage.removeItem('user'); // 🔥 Remove o usuário do LocalStorage
    localStorage.removeItem('token'); // 🔥 Remove o token
    window.location.href = "#/"; // 🔥 Redireciona para a tela de login
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login handleLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/main" element={user ? <MainScreen user={user} logout={handleLogout} /> : <Login handleLogin={handleLogin} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
