import React, { useState, useEffect, useCallback } from 'react';
import ModalWithForm from '../ModalWithForm/ModalWithForm';
import './PopupWithForm.css';

function PopupWithForm({ isOpen, onClose, title, onSubmit, type, errorMessage, successMessage, switchToSignUp, switchToSignIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateForm = useCallback(() => {
    if (type === 'signIn') {
      return email !== '' && password !== '';
    } else if (type === 'signUp') {
      return email !== '' && password !== '' && name !== '';
    }
    return false;
  }, [email, password, name, type]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [validateForm]);

  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setPassword('');
      setName('');
      setIsFormValid(false);
      setEmailError('');
    }
  }, [isOpen]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError('');
    }
  };

  const handleEmailBlur = () => {
    if (!validateEmail(email)) {
      setEmailError('Dirección de correo electrónico no válida');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((type === 'signUp' || type === 'signIn') && !validateEmail(email)) {
      setEmailError('Dirección de correo electrónico no válida');
      return;
    }
    onSubmit(type, email, password, name);
  };

  const renderContent = () => {
    if (type === 'signIn') {
      return (
        <>
          <label className="popup__label">
            Correo electrónico
            <input
              type="email"
              className={`popup__input ${emailError ? 'popup__input_error' : ''}`}
              placeholder="Introduce tu correo electrónico"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              required
            />
            {emailError && <p className="popup__error-email">{emailError}</p>}
          </label>
          <label className="popup__label">
            Contraseña
            <input
              type="password"
              className="popup__input"
              placeholder="Introduce tu contraseña"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </label>
          <button className={`popup__submit ${isFormValid ? 'popup__submit_enabled' : ''}`} type="submit" disabled={!isFormValid}>Iniciar sesión</button>
          <p className="popup__footer">
            o <a href="#signup" className="popup__link" onClick={switchToSignUp}>inscribirse</a>
          </p>
        </>
      );
    } else if (type === 'signUp') {
      return (
        <>
          <label className="popup__label">
            Correo electrónico
            <input
              type="email"
              className="popup__input"
              placeholder="Introduce tu correo electrónico"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              required
            />
            {emailError && <p className="popup__error-email">{emailError}</p>}
          </label>
          <label className="popup__label">
            Contraseña
            <input
              type="password"
              className="popup__input"
              placeholder="Introduce tu contraseña"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </label>
          <label className="popup__label">
            Nombre
            <input
              type="text"
              className="popup__input"
              placeholder="Introduce tu nombre"
              value={name}
              onChange={handleNameChange}
              required
            />
          </label>
          {errorMessage && <p className="popup__error">{errorMessage}</p>}
          <button className={`popup__submit ${isFormValid ? 'popup__submit_enabled' : ''}`} type="submit" disabled={!isFormValid}>Registrar</button>
          <p className="popup__footer">
            o <a href="#signIn" className="popup__link" onClick={switchToSignIn}>Iniciar Sesión</a>
          </p>
        </>
      );
    } else if (type === 'success') {
      return (
        <>
          <p className="popup__footer">
            <a href="#signIn" className="popup__link" onClick={switchToSignIn}>Iniciar Sesión</a>
          </p>
        </>
      );
    }
  };

  return (
    <ModalWithForm isOpen={isOpen} onClose={onClose}>
      <h2 className="popup__title">{title}</h2>
      <form className="popup__form" onSubmit={handleSubmit}>
        {renderContent()}
      </form>
    </ModalWithForm>
  );
}

export default PopupWithForm;
