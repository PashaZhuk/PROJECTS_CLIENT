import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Users, Sparkles, Key, Mail } from 'lucide-react';

const HomePage = () => {
  return (
    /* Убрали min-h-[calc(100vh-4rem)], теперь высоту контролирует родительский flex-grow в App.tsx */
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 mb-6">
              <Sparkles className="mr-2 h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                Добро пожаловать!
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Начните работу с{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                нашим сервисом
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Войдите в свой аккаунт для доступа ко всем функциям платформы
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;