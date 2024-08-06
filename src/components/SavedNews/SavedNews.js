import React, { useState, useEffect } from 'react';
import NewsCardList from '../NewsCardList/NewsCardList';
import SavedNewsHeader from '../SavedNewsHeader/SavedNewsHeader';
import Preloader from '../Preloader/Preloader';
import './SavedNews.css';

function SavedNews({ savedArticles, onRemoveArticle, resetSearchResults }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    resetSearchResults();
  }, [resetSearchResults]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Preloader text="Cargando..." />;
  }

  return (
    <div className="saved-news">
      <SavedNewsHeader savedArticles={savedArticles} />
      <div className="saved-news__cards">
      <NewsCardList 
      articles={savedArticles} 
      onRemoveArticle={onRemoveArticle} 
      savedArticles={savedArticles}
      showKeyword={true}
      isSavedPage={true}
      />
      </div>
    </div>
  );
}

export default SavedNews;
