import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';
import { useLocation } from 'react-router-dom';

function Navigation({ currentUser }) {
  const location = useLocation();

  return (
    <nav className="navigation">
      <Link to="/" className={`navigation__link ${location.pathname === '/saved-news' ? '' : 'navigation__link--home-active'}`}>Inicio</Link>
      {currentUser && (
        <Link to="/saved-news" className={`navigation__link ${location.pathname === '/saved-news' ? 'navigation__link--saved-news_actived' : ''}`}>Artículos guardados</Link>
      )}
    </nav>
  );
}

export default Navigation;
