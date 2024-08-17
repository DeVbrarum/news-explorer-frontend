import React, { createContext, useState, useEffect } from 'react';
import { getAuthToken, removeAuthToken } from '../utils/auth';
import { getUserInfo } from '../utils/MainApi';

export const CurrentUserContext = createContext();

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      getUserInfo(token)
        .then((user) => {
          setCurrentUser(user);
        })
        .catch((err) => {
          console.error('Error fetching user info:', err);
          removeAuthToken();
        });
    }
  }, []);

  const logout = () => {
    setCurrentUser(null);
    removeAuthToken();
  };

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser, logout }}>
      {children}
    </CurrentUserContext.Provider>
  );
};
