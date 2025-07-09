'use client';

import { useEffect, useState } from 'react';
import axios from '../../api/axios';

interface Skill {
  id: number;
  name: string;
  level: number;
}

export default function SkillsList() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSkills() {
      try {
        const response = await axios.get('/skills/');
        setSkills(response.data);
        setError(null);
      } catch {
        setError('Не удалось загрузить навыки');
      } finally {
        setLoading(false);
      }
    }
    fetchSkills();
  }, []);

  if (loading) return <div className="py-4 text-center text-gray-500 dark:text-gray-400">Загрузка навыков...</div>;
  if (error) return <div className="py-4 text-center text-red-600 font-semibold">{error}</div>;

  return (
    <section className="skills-section">
      <h2>Навыки программирования</h2>

      <ul className="skills-list">
        {skills.map(({ id, name, level }) => (
          <li key={id} className="skills-list-item">
            <div className="skill-name">{name}</div>
            {/* Можно добавить прогресс-бар (по желанию) */}
            <div
              className="skill-level"
              aria-label={`Уровень навыка: ${level} из 5`}
            >
              Уровень: <span>{level}</span> из 5
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
