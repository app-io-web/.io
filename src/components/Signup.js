import React, { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import './Signup.css';
import ConfirmationModal from './ConfirmationModal';
import PhrasesForm from './PhrasesForm'; // Novo componente para a segunda etapa

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nomeNamorado, setNomeNamorado] = useState('');
  const [nomeNamorada, setNomeNamorada] = useState('');
  const [dataInicioNamoro, setDataInicioNamoro] = useState('');
  const [isCasado, setIsCasado] = useState(false);
  const [dataInicioCasamento, setDataInicioCasamento] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [frases, setFrases] = useState([]); // Armazena as frases românticas
  const [photos, setPhotos] = useState([]); // Novo estado para armazenar fotos enviadas

  
  const [showPasswordPreview, setShowPasswordPreview] = useState(false);

  const handleNextStep = () => {
    setCurrentStep(2); // Avança para a segunda etapa
  };

  const handlePreviousStep = () => {
    setCurrentStep(1); // Retorna para a primeira etapa
  };


  







  const handleSignup = async () => {
    if (!email || !password || !nomeNamorado || !nomeNamorada || !dataInicioNamoro) {
        setModalMessage('Por favor, preencha todos os campos obrigatórios.');
        setModalIsOpen(true);
        return;
    }
    console.log("🚀 handleSignup() foi chamado!");

    const idUnic = uuidv4();
    const unicNameNamorado = `${nomeNamorado.toLowerCase()}_${idUnic.substring(0, 8)}`;
    const unicNameNamorada = `${nomeNamorada.toLowerCase()}_${idUnic.substring(0, 8)}`;
    const frasesUnicas = JSON.stringify(frases);
    const fotosJson = JSON.stringify(photos);

    const config = {
        headers: {
            'xc-token': process.env.REACT_APP_NOCODB_API_KEY
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
            UnicNameNamorado: unicNameNamorado,
            UnicNameNamorada: unicNameNamorada,
            E_Casado: isCasado,
            Data_Inicio_Casamento: isCasado ? dataInicioCasamento : null,
            FRASES_UNICAS: frasesUnicas,
            FOTOS_JSON: fotosJson
        }, config);

        console.log('✅ Cadastro realizado:', response.data);
        setModalMessage('Cadastro realizado com sucesso!');
        setModalIsOpen(true);


    } catch (error) {
        console.error('❌ Erro no cadastro:', error);
        setModalMessage('Erro no cadastro: ' + (error.response ? error.response.data : error.message));
        setModalIsOpen(true);
    }
};


  


  
  

  return (
    <div className="container">

      {currentStep === 1 && (
        <>
          <h1 className='CadastroH1'>Cadastro</h1>
          <div className="inputGroup">
            <label className='label'>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
          </div>
          <div className="inputGroup">
            <label className='label'>Senha:</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              onFocus={() => setShowPasswordPreview(true)}
              onBlur={() => setShowPasswordPreview(false)}
            />
            {showPasswordPreview && <div className="passwordPreview">{password}</div>}
          </div>
          <div className="inputGroup">
            <label className='label'>Seu Primeiro Nome(Namorado):</label>
            <input type="text" value={nomeNamorado} onChange={(e) => setNomeNamorado(e.target.value)} className="input" />
          </div>
          <div className="inputGroup">
            <label className='label'>Primeiro Nome(Namorada):</label>
            <input type="text" value={nomeNamorada} onChange={(e) => setNomeNamorada(e.target.value)} className="input" />
          </div>
          <div className="inputGroup">
            <label className='label'>Data de Início de Namoro:</label>
            <input type="date" value={dataInicioNamoro} onChange={(e) => setDataInicioNamoro(e.target.value)} className="input" />
          </div>
          <div className="inputGroup">
            <label className='label'>Já Casaram?:</label>
            <input type="checkbox" checked={isCasado} onChange={() => setIsCasado(!isCasado)} />
          </div>
          {isCasado && (
            <div className="inputGroup">
              <label className='label'>Data de Início de Casamento:</label>
              <input type="date" value={dataInicioCasamento} onChange={(e) => setDataInicioCasamento(e.target.value)} className="input" />
            </div>
          )}
          
          {/* Botões de navegação */}
          <div className="buttonContainer">
            <button onClick={handleNextStep} className="button">Continuar para frases românticas</button>
            <button onClick={() => window.location.href = '#/'} className="backButtonCAD">Voltar para Login</button>
          </div>
        </>
      )}

      {currentStep === 2 && (
        <PhrasesForm 
          handleSignup={handleSignup} 
          handlePreviousStep={handlePreviousStep} 
          frases={frases} 
          updatePhotosJson={setPhotos} // ✅ Agora setPhotos está sendo passado corretamente
          setFrases={setFrases} 
          photos={photos} // ✅ Adicionando a referência correta para fotos
          setPhotos={setPhotos} // ✅ Garantindo que as fotos sejam atualizadas corretamente
          dadosCadastro={{
            email,
            password,
            nomeNamorado,
            nomeNamorada,
            dataInicioNamoro,
            isCasado,
            dataInicioCasamento,
            unicNameNamorado: `${nomeNamorado.toLowerCase()}_${uuidv4().substring(0, 8)}`, // ✅ Garantindo a geração do UnicName
            unicNameNamorada: `${nomeNamorada.toLowerCase()}_${uuidv4().substring(0, 8)}`  // ✅ Garantindo a geração do UnicName
          }} 
          setModalMessage={setModalMessage} // ✅ Passando corretamente o modal
          setModalIsOpen={setModalIsOpen} // ✅ Passando corretamente o modal
        />
      )}



      <ConfirmationModal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        message={modalMessage}
      />
    </div>
  );
}

export default Signup;
