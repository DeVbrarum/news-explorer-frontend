import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from '../Main/Main';
import SavedNews from '../SavedNews/SavedNews';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import PopupWithForm from '../PopupWithForm/PopupWithForm';
import Preloader from '../Preloader/Preloader';
import { CurrentUserProvider, CurrentUserContext } from '../../contexts/CurrentUserContext';
import { fetchNews } from '../../utils/api';
import { saveAuthToken, removeAuthToken } from '../../utils/auth';
import './App.css';
import useWindowSize from '../../hooks/useWindowSize';

function App() {
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState('signIn');
  const [signUpError, setSignUpError] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [articles, setArticles] = useState([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [savedArticles, setSavedArticles] = useState([]);
  const [searchError, setSearchError] = useState('');
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [menuIconVisible, setMenuIconVisible] = useState(true);
  const width = useWindowSize();

  //Simulacion de carga inicial
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  // Carga de artículos guardados desde el almacenamiento local
  useEffect(() => {
    const savedArticles = JSON.parse(localStorage.getItem('savedArticles')) || [];
    setSavedArticles(savedArticles);
  }, []);


  const handlePopupOpen = (type) => {
    setPopupType(type);
    setIsPopupOpen(true);
    if (width <= 520) {
      setMenuIconVisible(false);
    }
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    setSignUpError('');
    if (width <= 520) {
      setMenuIconVisible(true);
    }
  };

  const handleSignInSubmit = (type, email, setCurrentUser) => {
    if (type === 'signIn') {
      const token = 'mockToken';
      saveAuthToken(token);
      setCurrentUser({ name: 'Elise', email });
      handlePopupClose();
    } else if (type === 'switchToSignUp') {
      setPopupType('signUp');
    }
  };

  const handleSignUpSubmit = (type, email, setCurrentUser) => {
    if (type === 'signUp') {
      const isEmailTaken = email === 'pruebas@email.com';
      if (isEmailTaken) {
        setSignUpError('Este correo electrónico no está disponible');
      } else {
        const token = 'mockToken';
        saveAuthToken(token);
        setCurrentUser({ name: 'Elise', email });
        handlePopupClose();
        setShowSuccessMessage(true);
      }
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessMessage(false);
    handlePopupClose();
  };

  const handleLogout = (setCurrentUser) => {
    setCurrentUser(null);
    removeAuthToken();
  };

  const switchToSignIn = () => {
    setShowSuccessMessage(false);
    handlePopupOpen('signIn');
  };


  const handleSearch = async (query) => {
    if (!query) {
      setSearchError('Por favor, introduzca una palabra clave');
      return;
    }
    setCurrentKeyword(query);
    setIsLoadingSearch(true);
    setHasSearched(true);
    setSearchError('');

    try {
      const fetchedArticles = await fetchNews(query);
      setTimeout(() => {
        setArticles(fetchedArticles);
        localStorage.setItem('articles', JSON.stringify(fetchedArticles));
        setIsLoadingSearch(false);
      }, 2000);
    } catch (error) {
      setSearchError('Lo sentimos, algo ha salido mal durante la solicitud. Es posible que haya un problema de conexión o que el servidor no funcione. Por favor, inténtalo más tarde.');
      setIsLoadingSearch(false);
    }
  };

  const handleSaveArticle = (article) => {
    const updatedArticle = { ...article, keyword: currentKeyword };
    const updatedArticles = [...savedArticles, updatedArticle];
    setSavedArticles(updatedArticles);
    localStorage.setItem('savedArticles', JSON.stringify(updatedArticles));
  };

  const handleRemoveArticle = (article) => {
    const updatedArticles = savedArticles.filter(a => a.title !== article.title);
    setSavedArticles(updatedArticles);
    localStorage.setItem('savedArticles', JSON.stringify(updatedArticles));
  };

  const resetSearchResults = () => {
    setArticles([]);
    setHasSearched(false);
    setSearchError('');
  };

  if (loading) {
    return <Preloader text="Cargando..." />;
  }

  return (
    <CurrentUserProvider>
      <Router>
        <div className="App">
          <CurrentUserContext.Consumer>
            {({ currentUser, setCurrentUser }) => (
              <>
                <Routes>
                  <Route path="/" element={
                    <Main
                      articles={articles}
                      onSearch={handleSearch}
                      isLoadingSearch={isLoadingSearch}
                      hasSearched={hasSearched}
                      onSaveArticle={handleSaveArticle}
                      onRemoveArticle={handleRemoveArticle}
                      savedArticles={savedArticles}
                      searchError={searchError}
                      currentUser={currentUser}
                      handlePopupOpen={handlePopupOpen}
                      handleLogout={() => handleLogout(setCurrentUser)}
                      isPopupOpen={isPopupOpen}
                      menuIconVisible={menuIconVisible}
                      resetSearchResults={resetSearchResults}
                    />} />
                  <Route path="/saved-news" element={
                    <>
                      <Header
                        isLoggedIn={!!currentUser}
                        onSignInClick={() => handlePopupOpen('signIn')}
                        onLogout={() => handleLogout(setCurrentUser)}
                        userName={currentUser?.name}
                        isPopupOpen={isPopupOpen}
                        menuIconVisible={menuIconVisible}
                        resetSearchResults={resetSearchResults}
                      />
                      <SavedNews
                        savedArticles={savedArticles}
                        onRemoveArticle={handleRemoveArticle}
                        resetSearchResults={resetSearchResults}
                      />
                    </>
                  } />
                </Routes>
              </>
            )}
          </CurrentUserContext.Consumer>
          <Footer />
          <CurrentUserContext.Consumer>
            {({ currentUser, setCurrentUser }) => (
              <>
                <PopupWithForm
                  isOpen={isPopupOpen}
                  onClose={handlePopupClose}
                  title={popupType === 'signIn' ? 'Iniciar Sesión' : 'Inscribirse'}
                  onSubmit={
                    popupType === 'signIn' ? (type, email) =>
                      handleSignInSubmit(type, email, setCurrentUser) : (type, email) =>
                      handleSignUpSubmit(type, email, setCurrentUser)
                  }
                  type={popupType}
                  errorMessage={popupType === 'signUp' ? signUpError : ''}
                  switchToSignIn={switchToSignIn}
                  switchToSignUp={() => setPopupType('signUp')}
                />
                <PopupWithForm
                  isOpen={showSuccessMessage}
                  onClose={handleSuccessClose}
                  title="¡El registro se ha completado con éxito!"
                  type="success"
                  successMessage="¡El registro se ha completado con éxito!"
                  switchToSignIn={switchToSignIn}
                />
              </>
            )}
          </CurrentUserContext.Consumer>
        </div>
      </Router>
    </CurrentUserProvider>
  );
}

export default App;
