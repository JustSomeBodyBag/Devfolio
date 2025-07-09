// src/components/Layout/Topbar.tsx
import React from 'react';

const Topbar: React.FC = () => {

  return (
    <header className="h-16 px-6 flex items-center justify-between border-b border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm z-10">
      <h1 className="text-lg font-semibold">Админ-панель</h1>
    </header>
  );
};

export default Topbar;
