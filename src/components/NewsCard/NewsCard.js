import React, { useState, useContext } from 'react';
import './NewsCard.css';
import { ReactComponent as BookmarkIcon } from '../../images/bookmark.svg';
import { ReactComponent as BookmarkedIcon } from '../../images/bookmarked.svg';
import { ReactComponent as TrashIcon } from '../../images/trash.svg';
import { CurrentUserContext } from '../../contexts/CurrentUserContext';

function NewsCard({ article, onSaveArticle, onRemoveArticle, savedArticles, isSaved, showKeyword, isSavedPage }) {
  const [isHovered, setIsHovered] = useState(false);
  const { currentUser } = useContext(CurrentUserContext);

  const handleSaveClick = () => {
    if (isSaved || isSavedPage) {
      const savedArticle = savedArticles.find(a => a.title === article.title);
      if (savedArticle) {
        onRemoveArticle(savedArticle._id);
      }
    } else {
      onSaveArticle(article);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('es-ES', { month: 'long' });
    const year = date.getFullYear();
    return `${day} de ${month} de ${year}`;
  };

  const handleOpenLink = () => {
    if (article && article.url) {
      const url = article.url.startsWith('http') ? article.url : `https://${article.url}`;
      window.open(url, '_blank');
    } else if(article && article.link){
      const link = article.link.startsWith('http') ? article.link : `https://${article.link}`;
      window.open(link, '_blank');
      console.error('Article or link is undefined');
    }
  };

  return (
    <div className="news-card">
      {showKeyword && <div className="news-card__keyword">{article.keyword}</div>}
      <img
        src={article.image || article.urlToImage}
        alt={article.title}
        className="news-card__image"
        onClick={handleOpenLink}
        style={{ cursor: 'pointer' }}
      />
      <p className="news-card__date">{formatDate(article.date || article.publishedAt)}</p>
      <div className="news-card__content">
        <h2
          className="news-card__title"
          onClick={handleOpenLink}
          style={{ cursor: 'pointer' }}
        >
          {article.title}
        </h2>
        <p className="news-card__description">{article.text || article.description}</p>
        <p className="news-card__source">
          {typeof article.source === 'string'
            ? article.source
            : article.source?.name}
        </p>
      </div>
      <div
        className="news-card__button-container"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isHovered && isSavedPage && (
          <div className="news-card__hover-message">Eliminar de guardados</div>
        )}
        <button
          className={`news-card__save-button ${!currentUser ? 'news-card__save-button_disabled' : ''}`}
          onClick={handleSaveClick}
          disabled={!currentUser}
        >
          {isSavedPage ? (
            <TrashIcon className={`news-card__save-icon ${isHovered ? 'news-card__save-icon_hover' : ''}`} />
          ) : (
            isSaved ? (
              <BookmarkedIcon className={`news-card__save-icon ${isHovered ? 'news-card__save-icon_hover' : ''}`} />
            ) : (
              <BookmarkIcon className={`news-card__save-icon ${isHovered ? 'news-card__save-icon_hover' : ''}`} />
            )
          )}
        </button>
        {!currentUser && isHovered && (
          <span className="news-card__tooltip">Inicia sesión para guardar artículos</span>
        )}
      </div>
    </div>
  );
}

export default NewsCard;
