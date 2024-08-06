import React from 'react';
import './Main.css';
import Header from '../Header/Header';
import SearchForm from '../SearchForm/SearchForm';
import SearchResults from '../SearchResults/SearchResults';
import AboutSection from '../About/About';
import { useLocation } from 'react-router-dom';

function Main({
  articles,
  onSearch,
  isLoadingSearch,
  hasSearched,
  onSaveArticle,
  onRemoveArticle,
  savedArticles,
  searchError,
  handlePopupOpen,
  isPopupOpen,
  menuIconVisible,
  resetSearchResults
}) {
  const location = useLocation();

  return (
    <>
      <div className="main">
        <div className="background-container">
          <Header
            onSignInClick={() => handlePopupOpen('signIn')}
            isPopupOpen={isPopupOpen}
            menuIconVisible={menuIconVisible}
            resetSearchResults={resetSearchResults}
          />
          {location.pathname === '/' && <SearchForm onSearch={onSearch} />}
        </div>
        <div className="intro">
          <SearchResults
            articles={articles}
            isLoading={isLoadingSearch}
            hasSearched={hasSearched}
            onSaveArticle={onSaveArticle}
            onRemoveArticle={onRemoveArticle}
            savedArticles={savedArticles}
            searchError={searchError}
          />
        </div>
      </div>
      <AboutSection />
    </>
  );
}

export default Main;
