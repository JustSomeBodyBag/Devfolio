import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

interface LoginResponse {
  access_token: string;
}

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      params.append("username", username);
      params.append("password", password);

      const res = await axios.post<LoginResponse>(`${API}/login`, params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      localStorage.setItem("token", res.data.access_token);
      return true;
    } catch (err: any) {
      setError("Неверный логин или пароль");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
  };

  const getToken = () => localStorage.getItem("token");

  return { login, logout, getToken, loading, error };
};
