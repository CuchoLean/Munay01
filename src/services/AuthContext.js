// AuthContext.js
import { createContext, useState, useEffect, useContext } from 'react';
import UsuarioService from './UsuarioService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!UsuarioService.getToken());

  const login = async (credentials) => {
    try {
      const response = await UsuarioService.login(credentials);
      setIsLoggedIn(true);
      return response;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  };

  const logout = () => {
    UsuarioService.logout();
    setIsLoggedIn(false);
  };

  useEffect(() => {
    setIsLoggedIn(!!UsuarioService.getToken());
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
