import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import axiosInstance from '../api/axios'; // кастомный инстанс axios
import axios from 'axios'; // оригинальный axios для проверки isAxiosError
import { parseJwt } from '../utils/parseJwt';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'guest';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

interface LoginResponse {
  access_token: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);

      const response = await axiosInstance.post<LoginResponse>(
        '/auth/login',
        params.toString(), // Важно: передаём строку, а не объект URLSearchParams
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      if (response.status !== 200) return false;

      const data = response.data;
      const token = data.access_token;

      const payload = parseJwt(token);
      const user: User = {
        id: payload.sub,
        username: payload.sub,
        role: payload.role || 'guest',
      };

      setUser(user);
      setToken(token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

      return true;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Login error:', error.response?.data || error.message);
      } else {
        console.error('Login error:', error);
      }
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
