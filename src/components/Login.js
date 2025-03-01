import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // 🔗 Para navegação
import './Login.css';

const BASE_URL = "https://nocodb.nexusnerds.com.br/api/v2/tables/m6xunqz86pfl6bg/records";

function Login({ handleLogin }) {
  const [identifier, setIdentifier] = useState(''); // Pode ser e-mail ou nome único
  const [password, setPassword] = useState('');
  const [usePassword, setUsePassword] = useState(false); // Alternar se senha é necessária
  const [error, setError] = useState('');

  // Detectar se o identificador é um e-mail automaticamente
  const handleIdentifierChange = (e) => {
    const value = e.target.value;
    setIdentifier(value);

    // Se for um e-mail, ativa o campo de senha automaticamente
    if (value.includes('@')) {
      setUsePassword(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpa os erros

    console.log(`🔍 Tentando login com: ${identifier} ${usePassword ? `(com senha)` : `(sem senha)`}`);

    let query;

    if (usePassword) {
      // Login por e-mail e senha
      query = `${BASE_URL}?where=(Email,eq,${identifier})~and(Password,eq,${password})`;
    } else {
      // Login por nome único (UnicNameNamorado ou UnicNameNamorada)
      query = `${BASE_URL}?where=(UnicNameNamorado,eq,${identifier})~or(UnicNameNamorada,eq,${identifier})`;
    }

    console.log(`📡 Enviando requisição para: ${query}`);

    try {
      const response = await axios.get(query, {
        headers: {
          'xc-token': process.env.REACT_APP_NOCODB_API_KEY
        }
      });

      console.log('📥 Resposta da API:', response.data);

      if (response.data.list.length > 0) {
        console.log('✅ Login bem-sucedido!');
        handleLogin(response.data.list[0]); // Passa os dados do usuário
      } else {
        console.log('❌ Nenhum usuário encontrado.');
        setError('Usuário ou senha inválidos.');
      }
    } catch (error) {
      console.error('🚨 Erro na requisição:', error);
      setError('Erro ao tentar fazer login. Verifique sua conexão.');
    }
  };

  return (
    <div className="loginContainer">
      <h1 className="loginTitle">Login</h1>
      <form onSubmit={handleSubmit} className="loginForm">
        <label className="loginLabel">Email ou Nome de Usuário:</label>
        <input
          type="text"
          className="loginInput"
          value={identifier}
          onChange={handleIdentifierChange}
          placeholder="Digite seu email ou nome único"
        />

        {usePassword && (
          <>
            <label className="loginLabel">Senha:</label>
            <input
              type="password"
              className="loginInput"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
            />
          </>
        )}

        <button type="submit" className="loginButton">Entrar</button>

        {error && <p className="errorMessage">{error}</p>}

        {/* 🔗 Link para o Cadastro */}
        <p className="signupText">
          Ainda não tem uma conta? <Link to="/signup" className="signupLink">Cadastre-se</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
