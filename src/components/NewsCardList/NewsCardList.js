import React from 'react';
import NewsCard from '../NewsCard/NewsCard';
import './NewsCardList.css';

function NewsCardList({ articles, onSaveArticle, onRemoveArticle, savedArticles, showKeyword, isSavedPage  }) {
  return (
    <div className="news-card-list">
      {articles.map((article, index) => (
        <NewsCard 
          key={index} 
          article={article} 
          onSaveArticle={onSaveArticle} 
          onRemoveArticle={onRemoveArticle}
          savedArticles={savedArticles}
          isSaved={savedArticles.some(savedArticle => savedArticle.title === article.title)}
          showKeyword={showKeyword}
          isSavedPage={isSavedPage}
        />
      ))}
    </div>
  );
}

export default NewsCardList;
