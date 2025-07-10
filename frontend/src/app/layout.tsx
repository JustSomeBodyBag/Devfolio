import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import TopBar from './components/TopBar';
import ThemeToggle from './components/ThemeToggle'; // клиентский компонент
import AnalyticsTracker from './components/AnalyticsTracker'; // импорт трекера (путь подкорректируйте)

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Devfolio',
  description: 'Резюме-портфолио',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <TopBar />
        <ThemeToggle />
        <AnalyticsTracker /> {/* Добавляем трекер здесь */}
        {children}
      </body>
    </html>
  );
}
