import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import NewsCardList from '../NewsCardList/NewsCardList';
import SavedNewsHeader from '../SavedNewsHeader/SavedNewsHeader';
import Header from '../Header/Header';
import { getSavedArticles } from '../../utils/MainApi';
import { CurrentUserContext } from '../../contexts/CurrentUserContext';
import Footer from '../Footer/Footer';
import './SavedNews.css';

function SavedNews({ resetSearchResults, handleRemoveArticle }) {
  const { currentUser } = useContext(CurrentUserContext);
  const [savedArticles, setSavedArticles] = useState([]);
  const location = useLocation();

  const fetchSavedArticles = useCallback(() => {
    if (currentUser) {
      const token = localStorage.getItem('auth_token');
      getSavedArticles(token)
        .then((articles) => {
          setSavedArticles(articles);
        })
        .catch((err) => {
          console.error('Error fetching saved articles:', err);
        });
    }
  }, [currentUser]);

  useEffect(() => {
    fetchSavedArticles();
  }, [fetchSavedArticles]);

  const handleRemoveArticleAndUpdate = (articleId) => {
    handleRemoveArticle(articleId).then(() => fetchSavedArticles());
  };

  useEffect(() => {
    // Resetear los resultados de búsqueda cuando se cargue SavedNews
    resetSearchResults();
  }, [resetSearchResults]);

  return (
    <>
      <Header />
      <div className="saved-news">
        <SavedNewsHeader savedArticles={savedArticles} />
        <NewsCardList
          articles={savedArticles}
          savedArticles={savedArticles}
          onRemoveArticle={handleRemoveArticleAndUpdate}
          showKeyword={true}
          isSavedPage={true}
        />
      </div>
      {location.pathname !== '/404' && <Footer />}
    </>
  );
}

export default SavedNews;
