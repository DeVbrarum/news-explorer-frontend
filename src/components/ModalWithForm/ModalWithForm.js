import React, { useEffect } from 'react';
import './ModalWithForm.css';
import closeIcon from '../../images/close.png';

function ModalWithForm({ isOpen, onClose, children }) {
  useEffect(() => {
    const handleEscClose = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscClose);
    } else {
      document.removeEventListener('keydown', handleEscClose);
    }

    return () => {
      document.removeEventListener('keydown', handleEscClose);
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={`modal ${isOpen ? 'modal_opened' : ''}`} 
    onClick={handleOverlayClick}>
      <div className="modal__container">
      <button className="modal__close" type="button" onClick={onClose}>
          <img src={closeIcon} alt="Cerrar" className="modal__close-icon" />
        </button>
        {children}
      </div>
    </div>
  );
}

export default ModalWithForm;
