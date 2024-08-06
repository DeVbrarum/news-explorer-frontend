import React, { useState, useEffect } from 'react';
import NewsCardList from '../NewsCardList/NewsCardList';
import './SearchResults.css';
import Preloader from '../Preloader/Preloader';
import notFoundIcon from '../../images/notFound.svg';

function SearchResults({ articles, isLoading, hasSearched, searchError, onSaveArticle, onRemoveArticle, savedArticles }) {
  const [visibleArticlesCount, setVisibleArticlesCount] = useState(3);

  useEffect(() => {
    setVisibleArticlesCount(3);
  }, [articles]);

  const handleShowMore = () => {
    setVisibleArticlesCount((prevCount) => prevCount + 3);
  };

  if (!hasSearched) {
    return null;
  }

  return (
    <>
    <div className="search-results__container">
      {isLoading ? (
        <Preloader text="Buscando noticias..." isSearch />
      ) : (
        <>
          {searchError && (
            <p className="search-results__error">{searchError}</p>
          )}
          {!searchError && articles.length === 0 && (
            <div className="no-results">
              <img src={notFoundIcon} alt="No se encontró nada" className="no-results__icon" />
              <h2 className="no-results__title">No se encontró nada</h2>
              <p className="no-results__text">
                Lo sentimos, pero no hay nada que coincida con tus términos de búsqueda.
              </p>
            </div>
          )}
          {!searchError && articles.length > 0 && (
            <>
              <h2 className="search-results__title">Resultados de la búsqueda</h2>
              <div className='search-results__cards'>
                <NewsCardList
                  articles={articles.slice(0, visibleArticlesCount)}
                  onSaveArticle={onSaveArticle}
                  onRemoveArticle={onRemoveArticle}
                  savedArticles={savedArticles}
                />
              </div>
              {visibleArticlesCount < articles.length && (
                <button className="search-results__button" onClick={handleShowMore}>Ver más</button>
              )}
            </>
          )}
        </>
      )}
    </div>
    </>
  );
}

export default SearchResults;
