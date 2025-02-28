import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // Certifique-se de instalar a biblioteca uuid com `npm install uuid`

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nomeNamorado, setNomeNamorado] = useState('');
  const [nomeNamorada, setNomeNamorada] = useState('');
  const [dataInicioNamoro, setDataInicioNamoro] = useState('');
  const [localizacaoNamorado, setLocalizacaoNamorado] = useState('');
  const [localizacaoNamorada, setLocalizacaoNamorada] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    checkGeolocationSupport();
  }, []);

  const checkGeolocationSupport = () => {
    if (navigator.permissions && navigator.geolocation) {
      navigator.permissions.query({ name: "geolocation" }).then(function(result) {
        if (result.state === "granted") {
          getLocation();
        } else if (result.state === "prompt") {
          setLocationError("Clique no botão para permitir acesso à localização.");
        } else {
          setLocationError("Acesso à localização foi negado. Para habilitar, vá para Configurações > Privacidade > Serviços de Localização > [Seu App].");
        }
      });
    } else {
      setLocationError("Geolocalização não é suportada por este navegador.");
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      setLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(success, handleError);
    } else {
      setLocationError("Geolocalização não é suportada por este navegador.");
    }
  };

  const success = (position) => {
    setLocalizacaoNamorado(`${position.coords.latitude}, ${position.coords.longitude}`);
    setLocalizacaoNamorada(`${position.coords.latitude}, ${position.coords.longitude}`);
    setLoadingLocation(false);
  };

  const handleError = (error) => {
    console.warn(`ERRO(${error.code}): ${error.message}`);
    setLoadingLocation(false);
    setLocationError("Não foi possível acessar sua localização. Verifique as permissões do navegador.");
  };

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
        Localizacao_do_Namorado: localizacaoNamorado,
        Localizacao_da_Namorada: localizacaoNamorada,
        UnicNameNamorado: unicNameNamorado,
        UnicNameNamorada: unicNameNamorada
      }, config);
      console.log('Cadastro realizado:', response.data);
    } catch (error) {
      console.error('Erro no cadastro:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      {loadingLocation && <p>Carregando localização...</p>}
      {locationError && <p>{locationError}</p>}
      <button onClick={getLocation}>Obter Localização</button>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" />
      <input type="text" value={nomeNamorado} onChange={(e) => setNomeNamorado(e.target.value)} placeholder="Nome do Namorado" />
      <input type="text" value={nomeNamorada} onChange={(e) => setNomeNamorada(e.target.value)} placeholder="Nome da Namorada" />
      <input type="date" value={dataInicioNamoro} onChange={(e) => setDataInicioNamoro(e.target.value)} placeholder="Data de Início do Namoro" />
      <button onClick={handleSignup}>Cadastrar</button>
    </div>
  );
}

export default Signup;
