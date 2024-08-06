import React, { useState } from 'react';
import './SearchForm.css';

function SearchForm({ onSearch }) {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    if (error) setError('');
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Por favor, introduzca una palabra clave');
      return;
    }
    onSearch(query);
  };

  return (
    <div className="search-form">
      <h1 className="search-form__title">¿Qué está pasando en el mundo?</h1>
      <p className="search-form__description">Encuentra las últimas noticias sobre cualquier tema y guárdalas en tu cuenta personal.</p>
      <form onSubmit={handleSubmit} className="search-form__input-group">
        <input
          type="text"
          className={`search-form__input ${error ? 'search-form__input_error' : ''}`}
          placeholder={error || 'Introduce un tema'}
          value={query}
          onChange={handleInputChange}
        />
        <button type="submit" className="search-form__button">Buscar</button>
      </form>
    </div>
  );
}

export default SearchForm;
