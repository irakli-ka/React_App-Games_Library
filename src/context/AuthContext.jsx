import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/AuthService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifySession = async () => {
      const currentUser = await AuthService.getCurrentUser();

      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(currentUser));
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
      }

      setLoading(false);
    };

    verifySession();
  }, []);

  const login = async (username, password) => {
    try {
      const userData = await AuthService.login(username, password);
      setUser(userData);
      setIsAuthenticated(true);

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');

      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.warn('Logout server call failed:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);

      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    }
  };

  const signup = async (username, password) => {
    try {
      await AuthService.signup(username, password);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    signup
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;