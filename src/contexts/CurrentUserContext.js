import React, { createContext, useState, useEffect } from 'react';
import { getAuthToken, removeAuthToken } from '../utils/auth';

export const CurrentUserContext = createContext();

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      // Simular la obtención de datos del usuario desde el token
      const user = { name: 'Elise', email: 'elise@example.com' };
      setCurrentUser(user);
    }
  }, []);

  const logout = () => {
    setCurrentUser(null);
    removeAuthToken();
  };

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser, logout  }}>
      {children}
    </CurrentUserContext.Provider>
  );
};