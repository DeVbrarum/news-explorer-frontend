import React from 'react';
import './Footer.css';
import github from '../../images/github.png';
import facebook from '../../images/fb.png';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__links">
          <a href="/" className="footer__link">Inicio</a>
          <a href="https://tripleten.mx/" target="_blank" rel="noopener noreferrer" className="footer__link">Tripleten</a>
        </div>
        <div className="footer__icons">
          <a href="https://www.github.com" target="_blank" rel="noopener noreferrer" className="footer__icon">
            <img src={github} alt="External Link" className="footer__icon-image" />
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="footer__icon">
            <img src={facebook} alt="External Link" className="footer__icon-image" />
          </a>
        </div>
        <p className="footer__copyright">&copy; 2024 Supersite, Powered by News API.</p>
      </div>
    </footer>
  );
}

export default Footer;