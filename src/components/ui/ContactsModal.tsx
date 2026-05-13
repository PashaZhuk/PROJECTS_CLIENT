import React from 'react';
import { X, Phone, Mail, MapPin, Clock, Headphones, Building2 } from 'lucide-react';

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

interface ContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: ContactsData | null;
  loading?: boolean;
}

const ContactsModal = ({ isOpen, onClose, contacts, loading }: ContactsModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full mx-4 max-h-[85vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-8 duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-gray-100 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Building2 size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Контакты</h2>
              <p className="text-xs text-gray-500">{contacts?.companyName || 'АйПиМатика Бел'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {loading ? (
          <div className="p-10 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto" />
            <p className="text-gray-400 text-sm mt-3">Загрузка контактов...</p>
          </div>
        ) : !contacts ? (
          <div className="p-10 text-center text-gray-400 text-sm">
            Контактные данные не найдены
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Карта */}
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <iframe
                src={`https://yandex.ru/maps/constructor/1.0/?um=constructor%3A${contacts.yandexMapId}&width=100%25&height=400&lang=ru_RU&scroll=true`}
                width="100%"
                height="320"
                className="border-0"
                allowFullScreen
                loading="lazy"
                title="Яндекс.Карта — офис АйПиМатика Бел"
              />
            </div>

            {/* Контактная информация */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Адрес */}
              <div className="flex gap-3 p-4 bg-gray-50 rounded-2xl">
                <MapPin size={20} className="text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Адрес</p>
                  <p className="text-sm text-gray-800 font-medium mt-1">{contacts.address}</p>
                </div>
              </div>

              {/* Отдел продаж */}
              <div className="flex gap-3 p-4 bg-gray-50 rounded-2xl">
                <Phone size={20} className="text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Отдел продаж</p>
                  <p className="text-sm text-gray-800 font-medium mt-1">{contacts.phone}</p>
                  <p className="text-sm text-gray-600">{contacts.mobile}</p>
                  <a href={`mailto:${contacts.email}`} className="text-sm text-blue-600 hover:underline mt-1 block">
                    {contacts.email}
                  </a>
                </div>
              </div>

              {/* Сервисный центр */}
              <div className="flex gap-3 p-4 bg-gray-50 rounded-2xl">
                <Headphones size={20} className="text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Сервисный центр</p>
                  <p className="text-sm text-gray-800 font-medium mt-1">{contacts.supportPhone}</p>
                  <a href={`mailto:${contacts.supportEmail}`} className="text-sm text-blue-600 hover:underline mt-1 block">
                    {contacts.supportEmail}
                  </a>
                </div>
              </div>

              {/* Режим работы */}
              <div className="flex gap-3 p-4 bg-gray-50 rounded-2xl">
                <Clock size={20} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Режим работы</p>
                  <p className="text-sm text-gray-800 font-medium mt-1 whitespace-pre-line">{contacts.workingHours}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactsModal;
