const AUTH_TOKEN_KEY = 'auth_token';

export const saveAuthToken = (token) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

export const removeAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};
