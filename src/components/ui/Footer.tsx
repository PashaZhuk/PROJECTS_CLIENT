import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t py-3 mt-auto">
      <div className="container mx-auto px-3">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-xl font-bold text-gray-900">АйПиМатика Бел</span>
            <p className="text-gray-500 text-sm mt-2">
              © {new Date().getFullYear()} Все права защищены
            </p>
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Политика конфиденциальности</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Условия использования</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Контакты</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;