import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from '../Main/Main';
import SavedNews from '../SavedNews/SavedNews';
import PopupWithForm from '../PopupWithForm/PopupWithForm';
import Preloader from '../Preloader/Preloader';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import NotFound from '../NotFound/NotFound';
import Header from '../Header/Header';
import { saveArticle, deleteArticle, register, authorize, getUserInfo } from '../../utils/MainApi';
import { CurrentUserProvider, CurrentUserContext } from '../../contexts/CurrentUserContext';
import { fetchNews } from '../../utils/api';
import { saveAuthToken, removeAuthToken, getAuthToken } from '../../utils/auth';
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
  const [currentUser, setCurrentUser] = useState(null);
  const [menuIconVisible, setMenuIconVisible] = useState(true);
  const width = useWindowSize();


  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      getUserInfo(token)
        .then((user) => {
          setCurrentUser(user);
        })
        .catch((err) => {
          console.error('Error fetching user info:', err);
          removeAuthToken();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
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

  const handleSignInSubmit = async (type, email, password, setCurrentUser) => {
    if (type === 'signIn') {
      try {
        const data = await authorize(email, password);
        saveAuthToken(data.token);

        const userInfo = await getUserInfo(data.token);
        setCurrentUser(userInfo);

        handlePopupClose();
      } catch (err) {
        console.error('Error during sign in:', err);
        setSignUpError('Error de inicio de sesión: ' + err.message);
      }
    } else if (type === 'switchToSignUp') {
      setPopupType('signUp');
    }
  };

  const handleSignUpSubmit = async (type, email, password, name, setCurrentUser) => {
    try {
      await register(email, password, name);
      setCurrentUser({ name, email });
      handlePopupClose();
      setShowSuccessMessage(true);
    } catch (error) {
      const errorMessage = error?.message || 'Error desconocido';

      if (errorMessage.includes("Ese correo ya está registrado")) {
        setSignUpError("Ese correo ya está registrado, intente con otro");
      } else {
        setSignUpError(`Error de registro: ${errorMessage}`);
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

  const handleSaveArticle = async (article) => {
    if (!currentUser) return;

    try {
      const token = getAuthToken();
      const savedArticle = await saveArticle({
        keyword: currentKeyword,
        title: article.title,
        text: article.description,
        date: article.publishedAt,
        source: article.source.name,
        link: article.url,
        image: article.urlToImage
      }, token);
      setSavedArticles([...savedArticles, savedArticle]);
    } catch (error) {
      console.error('Failed to save article:', error);
    }
  };

  const handleRemoveArticle = async (articleId) => {
    if (!currentUser) return;

    try {
      const token = getAuthToken();
      await deleteArticle(articleId, token);
      setSavedArticles((prevSavedArticles) =>
        prevSavedArticles.filter(article => article._id !== articleId)
      );
    } catch (error) {
      console.error('Failed to remove article:', error);
    }
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
                    />}
                  />
                  <Route path="/saved-news" element={
                    <ProtectedRoute>
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
                        handleRemoveArticle={handleRemoveArticle}
                        resetSearchResults={resetSearchResults}
                      />
                    </ProtectedRoute>
                  } />
                
                {/* Ruta catch-all para manejar 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>

            )}
          </CurrentUserContext.Consumer>
          <CurrentUserContext.Consumer>
            {({ currentUser, setCurrentUser }) => (
              <>
                <PopupWithForm
                  isOpen={isPopupOpen}
                  onClose={handlePopupClose}
                  title={popupType === 'signIn' ? 'Iniciar Sesión' : 'Inscribirse'}
                  onSubmit={
                    popupType === 'signIn' 
                      ? (type, email, password) => handleSignInSubmit(type, email, password, setCurrentUser)
                      : (type, email, password, name) => handleSignUpSubmit(type, email, password, name, setCurrentUser)
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
