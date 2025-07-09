import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      navigate('/');
    } else {
      setError('Неверный логин или пароль');
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-sm mx-auto p-6 mt-10 bg-white dark:bg-gray-900 rounded-2xl shadow-md"
    >
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Вход</h2>

      <div className="mb-4">
        <label htmlFor="username" className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
          Имя пользователя
        </label>
        <input
          id="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--custom-color)] transition"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="password" className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
          Пароль
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--custom-color)] transition"
        />
      </div>

      {error && <p className="text-red-600 dark:text-red-400 mb-4 text-center">{error}</p>}

      <button
        type="submit"
        className="w-full py-2 rounded-xl bg-[var(--custom-color)] text-white font-semibold hover:bg-blue-700 transition"
      >
        Войти
      </button>
    </form>
  );
};
