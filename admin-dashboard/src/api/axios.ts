import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,  // должен быть в .env, например: VITE_API_URL=http://localhost:8000
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
