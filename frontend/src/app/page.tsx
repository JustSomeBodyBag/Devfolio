'use client';

import { useEffect, useState } from 'react';
import axios from '../api/axios';
import SkillsList from './components/SkillsList';
import './Home.css'; // подключаем стили

interface HomePageContent {
  id?: number;
  title: string;
  subtitle?: string;
  about?: string;
  avatar_url?: string;
}

export default function Home() {
  const [content, setContent] = useState<HomePageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios.get('/homepage/')
      .then(res => setContent(res.data))
      .catch(() => setError('Ошибка загрузки данных'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-center text-gray-500 dark:text-gray-400">Загрузка...</div>;
  if (error) return <div className="p-6 text-center text-red-600 font-semibold">{error}</div>;
  if (!content) return <div className="p-6 text-center text-gray-500">Данных нет</div>;

  return (
    <main className={`home-main`}>
      <section className="home-intro">
        {content.avatar_url ? (
          <img
            src={content.avatar_url}
            alt="Avatar"
            className={`home-avatar ${mounted ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
          />
        ) : (
          <div className="home-avatar bg-gray-400 dark:bg-gray-600" />
        )}

        <h1 className="home-title">{content.title || 'Без заголовка'}</h1>

        {content.subtitle && (
          <h2 className="home-subtitle">{content.subtitle}</h2>
        )}

        {content.about && (
          <p className="home-about">{content.about}</p>
        )}
      </section>

      {/* Навыки */}
      <SkillsList />
    </main>
  );
}
