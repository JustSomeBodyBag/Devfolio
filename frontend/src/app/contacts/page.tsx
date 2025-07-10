'use client';

import { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import api from '@/api/axios';
import './Contacts.css';

export default function Contacts() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    telegram: '',
    message: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!recaptchaToken) {
      setError("Пожалуйста, подтвердите, что вы не робот.");
      return;
    }

    if (!form.email && !form.telegram) {
      setError('Укажите email или telegram для обратной связи');
      return;
    }

    try {
      await api.post('api/telegram/send-telegram/', {
        name: form.name,
        email: form.email || undefined,
        telegram: form.telegram || undefined,
        message: form.message,
        recaptcha_token: recaptchaToken,
      });
      setSuccess(true);
      setForm({ name: '', email: '', telegram: '', message: '' });
      setRecaptchaToken(null);
    } catch (err) {
      setError('Ошибка при отправке сообщения');
      console.error(err);
    }
  };

  return (
    <main className="contacts-main">
      <h1 className="contacts-title">Контакты</h1>

      <form className="contacts-form" onSubmit={handleSubmit} noValidate>
        <input
          type="text"
          name="name"
          className="contacts-input"
          placeholder="Имя"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          className="contacts-input"
          placeholder="Email (если есть)"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
        />

        <input
          type="text"
          name="telegram"
          className="contacts-input"
          placeholder="Telegram (если есть)"
          value={form.telegram}
          onChange={handleChange}
          autoComplete="username"
        />

        <textarea
          name="message"
          className="contacts-input"
          placeholder="Сообщение"
          rows={4}
          value={form.message}
          onChange={handleChange}
          required
        />

        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
          onChange={(token) => setRecaptchaToken(token)}
        />

        <button type="submit" className="contacts-btn">
          Отправить
        </button>

        {(success || error) && (
          <p className={`contacts-info ${success ? 'success' : 'error'}`}>
            {success ? '✅ Сообщение отправлено!' : error}
          </p>
        )}
      </form>

      <div className="contacts-info">
        <p>
          Telegram:{' '}
          <a
            href="https://t.me/JustSomeBodyBag"
            className="contacts-link"
            target="_blank"
            rel="noreferrer"
          >
            @JustSomeBodyBag
          </a>
        </p>
        <p>
          GitHub:{' '}
          <a
            href="https://github.com/JustSomeBodyBag"
            className="contacts-link"
            target="_blank"
            rel="noreferrer"
          >
            JustSomeBodyBag
          </a>
        </p>
      </div>
    </main>
  );
}
