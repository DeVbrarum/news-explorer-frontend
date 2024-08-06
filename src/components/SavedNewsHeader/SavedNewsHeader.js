import React, { useContext } from 'react';
import './SavedNewsHeader.css';
import { CurrentUserContext } from '../../contexts/CurrentUserContext';

function SavedNewsHeader({ savedArticles = [] }) {
  const { currentUser } = useContext(CurrentUserContext);

  const uniqueKeywords = Array.from(new Set(savedArticles.map(article => article.keyword)));
  const keywordsDisplay = uniqueKeywords.slice(0, 2).join(', ') + (uniqueKeywords.length > 2 ? `, y ${uniqueKeywords.length - 2} más` : '');

  return (
    <div className="saved-news-header">
      <p className="saved-news-header__pretitle">Artículos guardados</p>
      <h1 className="saved-news-header__title">{currentUser?.name}, tienes {savedArticles.length} artículos guardados</h1>
      <p className="saved-news-header__subtitle">Por palabras clave: <b>{keywordsDisplay}</b></p>
    </div>
  );
}

export default SavedNewsHeader;
