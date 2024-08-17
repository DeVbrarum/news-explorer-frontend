import React, { useContext } from 'react';
import './SavedNewsHeader.css';
import { CurrentUserContext } from '../../contexts/CurrentUserContext';

function SavedNewsHeader({ savedArticles = [] }) {
  const { currentUser } = useContext(CurrentUserContext);

  //Contar las ocurrencias de cada keyword
  const keywordCounts = savedArticles.reduce((acc, article) => {
    acc[article.keyword] = (acc[article.keyword] || 0) + 1;
    return acc;
  }, {});

  //Ordenar las keywords por popularidad
  const sortedKeywords = Object.keys(keywordCounts).sort((a, b) => keywordCounts[b] - keywordCounts[a]);

  //Generar el string de keywords para mostrar
  const keywordsDisplay = sortedKeywords.slice(0, 2).join(', ') + (sortedKeywords.length > 2 ? `, y ${sortedKeywords.length - 2} más` : '');

  return (
    <div className="saved-news-header">
      <p className="saved-news-header__pretitle">Artículos guardados</p>
      <h1 className="saved-news-header__title">{currentUser?.name}, tienes {savedArticles.length} artículos guardados</h1>
      <p className="saved-news-header__subtitle">Por palabras clave: <b>{keywordsDisplay}</b></p>
    </div>
  );
}

export default SavedNewsHeader;
