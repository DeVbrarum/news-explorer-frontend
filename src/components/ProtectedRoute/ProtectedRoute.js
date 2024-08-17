import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { CurrentUserContext } from '../../contexts/CurrentUserContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useContext(CurrentUserContext);

  return currentUser ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
