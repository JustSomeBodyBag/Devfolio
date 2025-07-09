import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ThemeSwitcher from '../Dashboard/ThemeSwitcher';
import {
  FolderKanban,
  BarChart2,
  Settings as SettingsIcon,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  User,           // Добавим иконку для вкладки "Данные"
} from 'lucide-react';
import clsx from 'clsx';
import { useTheme } from '../../context/ThemeContext';

interface SidebarProps {
  onSelect: (section: string) => void;
  activeSection: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect, activeSection }) => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const { primaryColor } = useTheme();

  const menuItems = [
    {
      key: 'projects',
      label: 'Проекты',
      icon: <FolderKanban size={18} />,
    },
    {
      key: 'analytics',
      label: 'Аналитика',
      icon: <BarChart2 size={18} />,
    },
    {
      key: 'homepage',
      label: 'Данные',           // Новая вкладка для homepage
      icon: <User size={18} />,
    },
    {
      key: 'settings',
      label: 'Настройки',
      icon: <SettingsIcon size={18} />,
      adminOnly: true,
    },
  ];

  return (
    <aside
      className={clsx(
        'flex flex-col h-full shadow-md bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 transition-all duration-300',
        collapsed ? 'w-16 mr-4' : 'w-64 mr-8'
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        {!collapsed && <span className="font-bold text-xl">Devfolio</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 dark:text-gray-400 hover:text-blue-500 transition"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          type="button"
        >
          {collapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {menuItems.map((item) => {
          if (item.adminOnly && user?.role !== 'admin') return null;
          const isActive = activeSection === item.key;

          return (
            <button
              key={item.key}
              onClick={() => onSelect(item.key)}
              className={clsx(
                'flex items-center w-full px-3 py-2 rounded-lg transition-colors',
                isActive
                  ? 'text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
              style={isActive ? { backgroundColor: primaryColor } : undefined}
              title={collapsed ? item.label : undefined}
              type="button"
            >
              <span className="mr-3">{item.icon}</span>
              {!collapsed && item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        {!collapsed && <ThemeSwitcher />}
        {!collapsed && (
          <button
            onClick={logout}
            className="mt-4 flex items-center justify-center w-full px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-white text-sm transition"
            type="button"
          >
            <LogOut size={16} className="mr-2" />
            Выйти
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
