import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Lottie from "lottie-react";
import uploadAnimation from '../assets/lotieFiles/Upload.json';
import completedAnimation from '../assets/lotieFiles/UploadComplet.json';
import './PhotoUploadForm.css';

const BASE_URL = "https://nocodb.nexusnerds.com.br"; // 🚀 URL base do NoCoDB

function PhotoUploadForm({ handlePreviousStep, handleFinalSubmit, updatePhotosJson, frases, dadosCadastro, setModalMessage, setModalIsOpen, setPhotos }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [error, setError] = useState('');

  // 🔹 Verifica se os dados do cadastro foram passados corretamente
  useEffect(() => {
    if (!dadosCadastro) {
      setError('Erro: Dados do cadastro não foram recebidos corretamente.');
    }
  }, [dadosCadastro]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setUploadComplete(false);
    setError('');
  };

  const uploadFile = async () => {
    if (!file) {
      setError('Por favor, selecione um arquivo antes de enviar.');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
  
    setUploading(true);
    setError('');
  
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v2/storage/upload`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'xc-token': process.env.REACT_APP_NOCODB_API_KEY
          }
        }
      );
  
      //console.log('✅ Upload bem-sucedido:', response.data);
  
      if (response.data && response.data.length > 0) {
        const filePath = response.data[0].path;
        const fileUrl = `${BASE_URL}/${filePath}`; 
  
        setUploadedPhotos(prevPhotos => [...prevPhotos, fileUrl]);
        setPhotos(prevPhotos => [...prevPhotos, fileUrl]); // ✅ Atualizando corretamente
        setUploadComplete(true);
      } else {
        setError('Erro ao obter a URL da imagem.');
      }
    } catch (error) {
      console.error('❌ Falha no upload:', error);
      setError('Erro no upload. Verifique sua conexão.');
    } finally {
      setUploading(false);
    }
  };
  
  

  const handleFinalize = async () => {
    if (!dadosCadastro) {
      setError('Erro: Dados do cadastro não estão disponíveis.');
      return;
    }
  
    if (!dadosCadastro.email || !dadosCadastro.password || !dadosCadastro.nomeNamorado || !dadosCadastro.nomeNamorada || !dadosCadastro.dataInicioNamoro) {
      setError('⚠️ Preencha todos os campos antes de finalizar.');
      return;
    }
  
    if (uploadedPhotos.length === 0) {
      setError('⚠️ Adicione pelo menos uma foto antes de finalizar.');
      return;
    }
  
    const finalData = {
      Email: dadosCadastro.email,  // ✅ Certifique-se que os nomes batem com os do NoCoDB
      Password: dadosCadastro.password,
      NomeNamorado: dadosCadastro.nomeNamorado,
      NomeNamorada: dadosCadastro.nomeNamorada,
      Data_Inicio_Namoro: dadosCadastro.dataInicioNamoro,
      ID_UNIC: uuidv4(),
      E_Casado: dadosCadastro.isCasado,
      Data_Inicio_Casamento: dadosCadastro.isCasado ? dadosCadastro.dataInicioCasamento : null,
      FRASES_UNICAS: JSON.stringify(frases),
      FOTOS_JSON: JSON.stringify(uploadedPhotos),
      UnicNameNamorado: `${dadosCadastro.nomeNamorado.toLowerCase()}_${uuidv4().substring(0, 8)}`,
      UnicNameNamorada: `${dadosCadastro.nomeNamorada.toLowerCase()}_${uuidv4().substring(0, 8)}`
    };
  
    //console.log("📤 Enviando JSON Final:", finalData); // ✅ Log dos dados antes de enviar
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_NOCODB_API_URL}/tables/m6xunqz86pfl6bg/records`,
        finalData,
        {
          headers: {
            'xc-token': process.env.REACT_APP_NOCODB_API_KEY
          }
        }
      );
  
      setModalMessage('🎉 Cadastro finalizado com sucesso!');
      setModalIsOpen(true);
    } catch (error) {
      console.error('❌ Erro no cadastro:', error);
      setError('Erro no cadastro.');
    }
  };
  

  return (
    <div className="photoUploadContainer">
      <h1 className='uploadTitle'>Upload de Foto</h1>

      <label className="uploadBox">
        {uploadComplete ? (
          <Lottie animationData={completedAnimation} className="uploadIcon" />
        ) : (
          <Lottie animationData={uploadAnimation} className="uploadIcon" />
        )}
        <input type="file" onChange={handleFileChange} className="hiddenInput" />
        <p>Clique para selecionar o arquivo</p>
      </label>

      <button onClick={uploadFile} className="uploadButton" disabled={uploading}>
        {uploading ? 'Carregando...' : 'Upload Foto'}
      </button>

      {error && <p className="errorMessage">{error}</p>}

      <button onClick={handlePreviousStep} className="backButton">Voltar</button>

      {uploadedPhotos.length > 0 && (
        <div className="photoPreview">
          <h3>Fotos Enviadas ({uploadedPhotos.length}):</h3>
          <div className="photoGrid">
            {uploadedPhotos.map((photo, index) => (
              <img key={index} src={photo} alt={`Foto ${index}`} className="uploadedPhoto" />
            ))}
          </div>
        </div>
      )}

      {uploadedPhotos.length > 0 && (
        <button onClick={handleFinalize} className="finalizeButton">
          Finalizar Cadastro
        </button>
      )}
    </div>
  );
}

export default PhotoUploadForm;
