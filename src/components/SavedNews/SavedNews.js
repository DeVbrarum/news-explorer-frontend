import React, { useEffect, useState, useContext, useCallback } from 'react';
import NewsCardList from '../NewsCardList/NewsCardList';
import SavedNewsHeader from '../SavedNewsHeader/SavedNewsHeader';
import { getSavedArticles } from '../../utils/MainApi';
import { CurrentUserContext } from '../../contexts/CurrentUserContext';
import './SavedNews.css';

function SavedNews({ resetSearchResults, handleRemoveArticle }) {
  const { currentUser } = useContext(CurrentUserContext);
  const [savedArticles, setSavedArticles] = useState([]);

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
  );
}

export default SavedNews;
