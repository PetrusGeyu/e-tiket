// src/utils/auth.js
export const saveToken = (token) => {
  if (typeof window !== 'undefined') localStorage.setItem('fenya_token', token);
};

export const getToken = () => {
  if (typeof window !== 'undefined') return localStorage.getItem('fenya_token');
  return null;
};

export const removeToken = () => {
  if (typeof window !== 'undefined') localStorage.removeItem('fenya_token');
};
