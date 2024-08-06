import React from 'react';
import './Preloader.css';

function Preloader({ text, isSearch }) {
  return (
    <div className={isSearch ? "preloader preloader_search" : "preloader"}>
      <div className="loader"></div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
}

export default Preloader;