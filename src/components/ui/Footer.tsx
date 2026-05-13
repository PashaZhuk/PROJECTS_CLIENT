import React, { useState, useEffect } from 'react';
import ContactsModal from './ContactsModal';

interface ContactsData {
  address: string;
  city: string;
  phone: string;
  mobile: string;
  email: string;
  supportEmail: string;
  supportPhone: string;
  workingHours: string;
  yandexMapId: string;
  companyName: string;
}

const Footer = () => {
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [contacts, setContacts] = useState<ContactsData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isContactsOpen) {
      setLoading(true);
      fetch('/api/settings/contacts')
        .then(r => r.json())
        .then(data => {
          if (data?.success && data.data) {
            setContacts(data.data);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isContactsOpen]);

  return (
    <>
      <footer className="bg-white border-t py-3 mt-auto">
        <div className="container mx-auto px-3">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-xl font-bold text-gray-900">{contacts?.companyName || 'АйПиМатика Бел'}</span>
              <p className="text-gray-500 text-sm mt-2">
                © {new Date().getFullYear()} Все права защищены
              </p>
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Политика конфиденциальности</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Условия использования</a>
              <button
                onClick={() => setIsContactsOpen(true)}
                className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer bg-transparent border-none underline-offset-2 hover:underline"
              >
                Контакты
              </button>
            </div>
          </div>
        </div>
      </footer>

      <ContactsModal
        isOpen={isContactsOpen}
        onClose={() => setIsContactsOpen(false)}
        contacts={contacts}
        loading={loading}
      />
    </>
  );
};

export default Footer;
