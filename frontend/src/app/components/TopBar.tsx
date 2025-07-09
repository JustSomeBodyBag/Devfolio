'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './TopBar.css'; // Убедись, что путь правильный

export default function TopBar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Главная' },
    { href: '/projects', label: 'Проекты' },
    { href: '/contacts', label: 'Контакты' },
  ];

  return (
    <nav className="topbar">
      {links.map(({ href, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`topbar-link ${isActive ? 'active' : ''}`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
