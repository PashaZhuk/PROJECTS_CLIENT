import { Download } from 'lucide-react';
import type { ActiveTabType } from '../../types';

const BynIcon = () => (
  <svg className="inline-block w-[0.55em] h-[0.7em]" viewBox="0 0 360.67 446.4" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M475.61,528.84c0-72.5-62.75-131.27-140.16-131.27H227.58V263.37H426v-49.6H178v290h-63.1v49.7H178V660.17h49.54l107.92-.07c77.36,0,140.11-58.77,140.11-131.26Zm-248-25.1V447.1c35.89,0,72.35.07,107.87.07,50,0,90.56,36.57,90.56,81.67s-40.54,81.67-90.56,81.7l-107.87,0V553.44h112.7v-49.7Z" transform="translate(-114.94 -213.77)"/>
  </svg>
);

const PartnerSidebar = ({ setActiveTab }: { setActiveTab: (tab: ActiveTabType) => void }) => {
  return (
    <aside className="w-80 bg-white border-l border-slate-100 flex flex-col h-full shrink-0 overflow-hidden">
      {/* 1. Информация по компании */}
      <div className="flex-none flex flex-col px-6 py-4">
        <div className="mb-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">Информация по компании</span>
        </div>

        {/* Активные сегменты — показать первый, если есть ещё — многоточие с тултипом */}
        <div className="flex items-center justify-between py-1.5">
          <span className="text-[13px] font-medium text-slate-500">Активные сегменты</span>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-slate-700">TOP-1</span>
            {/* Группа для тултипа с многоточием */}
            <div className="relative group/tip">
              <span className="text-xs font-medium text-slate-300 cursor-help tracking-wider">•••</span>
              {/* Тултип со списком сегментов */}
              <div className="absolute bottom-full right-0 z-50 mb-2
                opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible
                transition-all duration-200">
                <div className="bg-slate-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-xl">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">TOP-1</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">TOP-2</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Активных заказов — кнопка */}
        <button onClick={() => setActiveTab('orders-list')} className="flex items-center justify-between py-1.5 w-full hover:bg-slate-50 px-2 -mx-2 rounded-lg transition-colors">
          <span className="text-[13px] font-medium text-slate-500">Активных заказов</span>
          <span className="text-sm font-bold text-slate-800">3</span>
        </button>

        {/* Активных проектов — кнопка */}
        <button onClick={() => setActiveTab('projects-list')} className="flex items-center justify-between py-1.5 w-full hover:bg-slate-50 px-2 -mx-2 rounded-lg transition-colors">
          <span className="text-[13px] font-medium text-slate-500">Активных проектов</span>
          <span className="text-sm font-bold text-slate-800">20</span>
        </button>
      </div>

      <div className="h-px bg-slate-100 mx-6" />

      {/* 2. Финансы */}
      <div className="flex-none flex flex-col px-6 py-4">
        <div className="mb-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">Финансы</span>
        </div>
        <div className="grid grid-cols-[1fr_auto] gap-x-2 gap-y-2.5">
          {/* Отсрочка после отгрузки */}
          <span className="text-[13px] font-medium text-slate-500">Отсрочка после отгрузки</span>
          <span className="inline-flex items-center justify-end gap-0.5 text-sm font-bold text-slate-800">10 000,00 <BynIcon /></span>
          {/* Внесено предоплаты */}
          <span className="text-[13px] font-medium text-slate-500">Внесено предоплаты</span>
          <span className="inline-flex items-center justify-end gap-0.5 text-sm font-bold text-slate-800">7 000,00 <BynIcon /></span>
          {/* Просрочена оплата */}
          <span className="text-[13px] font-medium text-slate-500">Просрочена оплата после отгрузки</span>
          <span className="inline-flex items-center justify-end gap-0.5 text-sm font-bold text-slate-800">2 000,00 <BynIcon /></span>
          {/* Переплата */}
          <span className="text-[13px] font-medium text-slate-500">Переплата</span>
          <span className="inline-flex items-center justify-end gap-0.5 text-sm font-bold text-slate-800">0,23 <BynIcon /></span>
        </div>

        {/* Скачать акт сверки — строка + кнопка */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-[13px] font-medium text-slate-500">Скачать акт сверки за 3 месяца</span>
          <button
            onClick={() => {
              // TODO: 1С запрос для формирования акта сверки
              console.log('Запрос на формирование акта сверки');
            }}
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-50 to-blue-100 border border-blue-100 text-blue-500 hover:from-blue-100 hover:to-blue-200 transition-all shadow-sm"
            title="Скачать акт сверки"
          >
            <Download size={14} />
          </button>
        </div>
      </div>

      <div className="h-px bg-slate-100 mx-6" />

      {/* Пустое место для будущего раздела */}
      <div className="flex-1 min-h-0" />

      <div className="h-px bg-slate-100 mx-6" />

      {/* 3. Сервисы */}
      <div className="flex-none flex flex-col px-6 py-4">
        <div className="mb-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">Сервисы</span>
        </div>
        <a
          href="https://by.warranty.ipmatika.ru/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between py-1.5 w-full hover:bg-slate-50 px-2 -mx-2 rounded-lg transition-colors text-[13px] font-medium text-slate-500"
        >
          Проверка гарантийного срока
        </a>
        <a
          href="https://ipmatika.teamly.ru/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between py-1.5 w-full hover:bg-slate-50 px-2 -mx-2 rounded-lg transition-colors text-[13px] font-medium text-slate-500"
        >
          База знаний АйПиМатика
        </a>
      </div>

      <div className="h-px bg-slate-100 mx-6" />

      {/* 4. Скачать прейскурант */}
      <div className="flex-none flex items-center justify-between px-6 py-3">
        <span className="text-[13px] font-medium text-slate-500">Скачать прейскурант</span>
        <button
          onClick={() => {
            // TODO: implement pricelist download
            console.log('Скачать прейскурант');
          }}
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-50 to-blue-100 border border-blue-100 text-blue-500 hover:from-blue-100 hover:to-blue-200 transition-all shadow-sm"
          title="Скачать прейскурант"
        >
          <Download size={14} />
        </button>
      </div>
    </aside>
  );
};

export default PartnerSidebar;
