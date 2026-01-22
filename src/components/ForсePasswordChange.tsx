import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ForcePasswordChange = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { setUser } = useAuth(); // Предположим, в контексте есть setUser

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return alert("Пароли не совпадают");

    try {
      await api.post('/auth/change-password', { newPassword });
      // Обновляем локальный стейт, чтобы убрать форму
      setUser((prev: any) => ({ ...prev, mustChangePassword: false }));
      alert("Пароль успешно обновлен!");
    } catch (err) {
      alert("Ошибка при смене пароля");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-[9999]">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Смена временного пароля</h2>
        <p className="text-gray-600 mb-6 text-sm">Администратор создал для вас аккаунт. Пожалуйста, установите свой собственный пароль для продолжения.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="password" 
            placeholder="Новый пароль" 
            className="w-full p-3 border rounded-xl"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Подтвердите пароль" 
            className="w-full p-3 border rounded-xl"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">
            Обновить пароль
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForcePasswordChange;