import React, { useState } from 'react';
import './PhrasesForm.css';
import PhotoUploadForm from './PhotoUploadForm';

function PhrasesForm({ handleSignup, handlePreviousStep, frases, setFrases, setPhotos, dadosCadastro, setModalMessage, setModalIsOpen }) {
  const [phrase, setPhrase] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const addPhrase = () => {
    if (phrase) {
      setFrases(prevPhrases => [...prevPhrases, phrase]);
      setPhrase('');
    }
  };
  

  const goToNextStep = () => {
    if (frases.length === 0) {
      alert('Adicione pelo menos uma frase antes de prosseguir.');
      return;
    }
    setCurrentStep(2);
  };




  

  return (
    <div className="phrasesFormContainer">
      {currentStep === 1 && (
        <>
          <h1 className='CadastroH1'>Cadastrar Frases</h1>
          <input
            type="text"
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            className="phrasesFormInput"
            placeholder="Digite uma frase romântica..."
          />
          <button onClick={addPhrase} className="phrasesFormButton">Adicionar Frase</button>

          {frases.length > 0 && (
            <>
              <button onClick={goToNextStep} className="phrasesFormButton finishButton">
                Ir para Upload de Fotos
              </button>
              <div>
                <h3 className='CadastroH3'>Frases Adicionadas ({frases.length}):</h3>
                <ul>
                  {frases.map((item, index) => (
                    <li className='FrasesLI' key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
          <button onClick={handlePreviousStep} className="phrasesFormButton backButton">Voltar</button>
        </>
      )}

{currentStep === 2 && (
          <PhotoUploadForm 
          handlePreviousStep={() => setCurrentStep(1)}
          handleFinalSubmit={handleSignup}
          updatePhotosJson={setPhotos} // 🔴 Pode ser removido, pois setPhotos já é passado corretamente abaixo
          frases={frases}
          dadosCadastro={dadosCadastro}
          setModalMessage={setModalMessage}
          setModalIsOpen={setModalIsOpen}
          setPhotos={setPhotos} // ✅ Agora setPhotos está sendo passado corretamente
        />
      )}
    </div>
  );
}

export default PhrasesForm;
