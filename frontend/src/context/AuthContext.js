import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { client } from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
    role: null,
    token: null
  });
  const navigate = useNavigate();

  // Функция выхода с useCallback
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setAuth({
      isAuthenticated: false,
      user: null,
      role: null,
      token: null
    });
    navigate('/login');
  }, [navigate]); // Добавляем navigate в зависимости

  // Функция проверки токена с useCallback
  const verifyToken = useCallback(async (token) => {
    try {
      const data = await client('auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAuth({
        isAuthenticated: true,
        user: data.user,
        role: data.role,
        token: token
      });
    } catch (err) {
      logout();
    }
  }, [logout]); // Добавляем logout в зависимости

  // Функция входа
  const login = async (email, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
  
    const data = await response.json();
    
    // Важно! Проверяем что приходит с сервера
    console.log("Login response:", data); 
  
    setAuth({
      isAuthenticated: true,
      user: data.user,
      role: data.user.role,  // Убедитесь что роль приходит
      token: data.token
    });
  };
  
  // Функция регистрации
  const register = async (email, password, role = 'user') => {
    try {
      const data = await client('auth/register', {
        method: 'POST',
        body: { email, password, role }
      });
      return data;
    } catch (err) {
      throw new Error(err.message || 'Registration failed');
    }
  };

  // Проверка авторизации при загрузке
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token);
    }
  }, [verifyToken]); // verifyToken стабилен благодаря useCallback

  return (
    <AuthContext.Provider value={{ auth, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Кастомный хук для использования контекста
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
