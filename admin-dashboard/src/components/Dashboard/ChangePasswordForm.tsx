import React, { useState } from "react";
import api from "../../api/axios";

interface ChangePasswordResponse {
  message?: string;
}

const ChangePasswordForm: React.FC = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!newPassword) return setError("Введите новый пароль");
    if (newPassword !== confirmNewPassword) return setError("Пароли не совпадают");

    setLoading(true);
    try {
      const res = await api.post<ChangePasswordResponse>("/auth/change-credentials", {
        oldPassword,
        newPassword,
        newUsername: null,
      });
      setMessage(res.data.message || "Пароль успешно обновлен");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Ошибка при обновлении пароля");
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (
    id: string,
    label: string,
    value: string,
    onChange: (v: string) => void
  ) => (
    <div className="mb-4">
      <label htmlFor={id} className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        id={id}
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={label}
        className="w-full max-w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--custom-color)] transition"
        required
      />
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-8 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg"
    >
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
        Изменить пароль
      </h2>

      {renderInput("oldPassword", "Старый пароль", oldPassword, setOldPassword)}
      {renderInput("newPassword", "Новый пароль", newPassword, setNewPassword)}
      {renderInput("confirmNewPassword", "Подтвердите новый пароль", confirmNewPassword, setConfirmNewPassword)}

      {message && <p className="text-green-600 dark:text-green-400 mb-4 text-center">{message}</p>}
      {error && <p className="text-red-600 dark:text-red-400 mb-4 text-center">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded-xl text-white font-semibold transition disabled:cursor-not-allowed disabled:bg-blue-300"
        style={{
          backgroundColor: loading ? "#93c5fd" : "var(--custom-color)",
        }}
      >
        {loading ? "Обновляем..." : "Обновить пароль"}
      </button>
    </form>
  );
};

export default ChangePasswordForm;
