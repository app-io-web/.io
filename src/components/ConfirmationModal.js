import React from 'react';
import './ConfirmationModal.css'; // CSS específico para o modal

function ConfirmationModal({ isOpen, onClose, message }) {
  if (!isOpen) return null;

  return (
    <div className="modalOverlay">
      <div className="modalContent">
      <p dangerouslySetInnerHTML={{ __html: message }}></p>
        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
}

export default ConfirmationModal;
