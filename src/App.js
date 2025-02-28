import React from 'react';
import './App.css';
import Signup from './components/Signup'; // Certifique-se de que o caminho para o componente Signup está correto

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Registro de Namorados</h1> {/* Altere para um título apropriado para o formulário de cadastro */}
        <Signup /> {/* Incluindo o componente Signup */}
      </header>
    </div>
  );
}

export default App;
