import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import { ReactComponent as LogoutIcon } from '../../images/logout.svg';
import { ReactComponent as MenuIcon } from '../../images/menu.svg';
import { CurrentUserContext } from '../../contexts/CurrentUserContext';
import useWindowSize from '../../hooks/useWindowSize';
import Navigation from '../Navigation/Navigation';

function Header({ onSignInClick, isPopupOpen, menuIconVisible, resetSearchResults }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useContext(CurrentUserContext);
  const { width } = useWindowSize();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogoutClick = () => {
    setMenuOpen(false);
    logout();
    navigate('/');
    resetSearchResults();
  };

  const handleSignInClick = () => {
    if (width <= 520) {
      setMenuOpen(false);
    }
    onSignInClick();
  };

  const handleNavigation = (path) => {
    setMenuOpen(false);
    resetSearchResults();
    navigate(path);
  };

  useEffect(() => {
    if (width > 520) {
      setMenuOpen(false);
    }
  }, [width]);

  return (
    <header className={`header ${location.pathname === '/saved-news' ? 'header--saved-news header__border--saved-news' : ''} ${menuOpen ? 'header--menu-opened' : ''}`}>
      <div className="header__container">
        <h1 className='header__title'>
          NewsExplorer
        </h1>
        <nav className={`header__nav ${currentUser ? 'header__nav--is-logged-in' : ''}`}>
          <Navigation currentUser={currentUser} />
          <button
            className={`header__button ${currentUser ? 'header__button--is-logged-in' : ''} ${location.pathname === '/saved-news' ? 'header--saved-news' : ''} ${menuOpen ? 'header__button--menu-opened' : ''}`}
            onClick={currentUser ? handleLogoutClick : handleSignInClick}
          >
            {currentUser ? (
              <>
                {currentUser.name}
                <LogoutIcon className={`header__logout-icon ${location.pathname === '/saved-news' ? 'header__logout-icon_fill_black' : 'header__logout-icon_fill_white'}`} />
              </>
            ) : 'Iniciar sesión'}
          </button>
        </nav>
        {menuIconVisible && (
          <div className={`header__menu-icon ${location.pathname === '/saved-news' ? 'header__menu-icon--saved-news_actived' : ''}`} onClick={toggleMenu}>
            <MenuIcon className={`header__menu-svg ${menuOpen ? 'open' : ''}`} />
          </div>
        )}
      </div>
      {menuOpen && (
        <div className="header__menu">
          <a href="/" className="header__menu-link" onClick={() => handleNavigation('/')}>Inicio</a>
          {currentUser && (
            <a href="/saved-news" className="header__menu-link" onClick={() => handleNavigation('/saved-news')}>Artículos guardados</a>
          )}
          <button
            className={`header__button ${menuOpen ? 'header__button--menu-opened' : ''}`}
            onClick={currentUser ? handleLogoutClick : handleSignInClick}
          >
            {currentUser ? (
              <>
                {currentUser.name}
                <LogoutIcon className="header__logout-icon header__logout-icon_fill_white" />
              </>
            ) : 'Iniciar sesión'}
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
