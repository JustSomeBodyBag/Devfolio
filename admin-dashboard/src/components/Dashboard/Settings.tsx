import React from 'react';
import ColorPicker from './ColorPicker';
import { useTheme } from '../../context/ThemeContext';
import ChangePasswordForm from './ChangePasswordForm';

const Settings: React.FC = () => {
  const { primaryColor, setPrimaryColor } = useTheme();

  const resetColor = () => setPrimaryColor('#3B82F6');

  return (
    <div className="p-6 max-w-md mx-auto space-y-8 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-2xl font-semibold">Настройки темы</h2>

      <div className="flex items-center space-x-4">
        <ColorPicker color={primaryColor} onChange={setPrimaryColor} />
        <button
          onClick={resetColor}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          type="button"
        >
          Сбросить цвет
        </button>
      </div>

      <button
        style={{ backgroundColor: primaryColor, color: 'white', padding: '8px 16px', borderRadius: 4 }}
      >
        Кнопка с кастомным цветом
      </button>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Настройки пользователя</h2>
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default Settings;
