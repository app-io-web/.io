import React, { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import './Signup.css'; // Ajuste o caminho conforme necessário

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nomeNamorado, setNomeNamorado] = useState('');
  const [nomeNamorada, setNomeNamorada] = useState('');
  const [dataInicioNamoro, setDataInicioNamoro] = useState('');
  const [isCasado, setIsCasado] = useState(false);
  const [dataInicioCasamento, setDataInicioCasamento] = useState('');

  const handleSignup = async () => {
    const idUnic = uuidv4();
    const unicNameNamorado = `${nomeNamorado.toLowerCase()}${idUnic.substring(0, 8)}`;
    const unicNameNamorada = `${nomeNamorada.toLowerCase()}${idUnic.substring(0, 8)}`;

    const config = {
      headers: {
        'xc-token': `${process.env.REACT_APP_NOCODB_API_KEY}`
      }
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_NOCODB_API_URL}/tables/m6xunqz86pfl6bg/records`, {
        Email: email,
        Password: password,
        NomeNamorado: nomeNamorado,
        NomeNamorada: nomeNamorada,
        Data_Inicio_Namoro: dataInicioNamoro,
        ID_UNIC: idUnic,
        Casado: isCasado,
        Data_Inicio_Casamento: isCasado ? dataInicioCasamento : null
      }, config);
      console.log('Cadastro realizado:', response.data);
    } catch (error) {
      console.error('Erro no cadastro:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="container">
      <h1 className='CadastroH1'>Cadastro</h1>
      <div className="inputGroup">
        <label className="label">Email: </label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
      </div>
      <div className="inputGroup">
        <label className="label">Senha: </label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" />
      </div>
      <div className="inputGroup">
        <label className="label">Seu Primeiro Nome(Namorado): </label>
        <input type="text" value={nomeNamorado} onChange={(e) => setNomeNamorado(e.target.value)} className="input" />
      </div>
      <div className="inputGroup">
        <label className="label">Primeiro Nome(Namorada): </label>
        <input type="text" value={nomeNamorada} onChange={(e) => setNomeNamorada(e.target.value)} className="input" />
      </div>
      <div className="inputGroup">
        <label className="label">Data de Início de Namoro: </label>
        <input type="date" value={dataInicioNamoro} onChange={(e) => setDataInicioNamoro(e.target.value)} className="input" />
      </div>
      <div className="inputGroup">
        <label className="label">Já Casaram?: </label>
        <input type="checkbox" checked={isCasado} onChange={() => setIsCasado(!isCasado)} />
        <label className="label">Sim</label>
      </div>
      {isCasado && (
        <div className="inputGroup">
          <label className="label">Data de Início de Casamento: </label>
          <input type="date" value={dataInicioCasamento} onChange={(e) => setDataInicioCasamento(e.target.value)} className="input" />
        </div>
      )}
      <button onClick={handleSignup} className="button">Cadastrar</button>
    </div>
  );
}

export default Signup;
