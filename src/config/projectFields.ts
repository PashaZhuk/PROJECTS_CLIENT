export type FieldType = 'text' | 'textarea' | 'date' | 'select'| 'items';

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[]; // для типа 'select'
  section?: string;

}

export const PROJECT_CATEGORIES: Record<string, FormField[]> = {
  YEALINK_PHONES: [
    // --- 2. Обязательная информация о конечном Заказчике по проекту ---
    { 
      name: 'customerName', 
      label: 'Наименование Заказчика (конечного пользователя)', 
      type: 'text', 
      required: true, 
      section: '2. Информация о конечном Заказчике' 
    },
    { 
      name: 'customerInn', 
      label: 'ИНН Заказчика', 
      type: 'text', 
      required: true, 
      section: '2. Информация о конечном Заказчике' 
    },
    { 
      name: 'purchasingOrg', 
      label: 'Наименование закупочной/уполномоченной организации', 
      type: 'text', 
      required: true, 
      section: '2. Информация о конечном Заказчике' 
    },
    { 
      name: 'purchasingInn', 
      label: 'УНП закупочной организации', 
      type: 'text', 
      required: true, 
      section: '2. Информация о конечном Заказчике' 
    },
    { 
      name: 'intermediatePartner', 
      label: 'Название и УНП другого партнера (если поставка через него)', 
      type: 'text', 
      required: true, 
      section: '2. Информация о конечном Заказчике',
      placeholder: 'Если напрямую — пишите "сам"'
    },
    { 
      name: 'customerWebsite', 
      label: 'Сайт Заказчика', 
      type: 'text', 
      required: true, 
      section: '2. Информация о конечном Заказчике' 
    },
    { 
      name: 'installationAddr', 
      label: 'Адреса/Города планируемой установки оборудования', 
      type: 'text', 
      required: true, 
      section: '2. Информация о конечном Заказчике' 
    },

    // --- 3. Обязательная информация о проекте при регистрации ---
    { 
      name: 'specification', 
      label: 'Планируемая спецификация по бренду (модели/количество)', 
      type: 'items', 
      required: true, 
      section: '3. Техническая информация',
      options: [
    'Yealink T30', 'Yealink T31P', 'Yealink T33G', 
    'Yealink T43U', 'Yealink T46U', 'Yealink T48U',
    'Yealink T53W', 'Yealink T54W', 'Yealink T58W',
    'Yealink W73P', 'Yealink W70B', 'Yealink W73H'
    ]
    },
    { 
      name: 'ipAtcType', 
      label: 'К какой IP-АТС планируется подключать телефоны?', 
      type: 'text', 
      required: true, 
      section: '3. Техническая информация' 
    },
    { 
      name: 'currentTelephony', 
      label: 'Установлены ли сейчас у Заказчика АТС и телефоны? (какие)', 
      type: 'text', 
      required: true, 
      section: '3. Техническая информация' 
    },
    { 
      name: 'executionDate', 
      label: 'Планируемая дата реализации проекта', 
      type: 'date', 
      required: true, 
      section: '3. Техническая информация' 
    },
    { 
      name: 'purchaseMethod', 
      label: 'Планируемая форма закупки', 
      type: 'select', 
      options: ['прямая закупка', 'открытый тендер', 'закрытый тендер'], 
      required: true, 
      section: '3. Техническая информация' 
    },

    // --- 4. Важная информация о проекте ---
    { 
      name: 'industry', 
      label: 'Сфера деятельности Заказчика', 
      type: 'text', 
      required: true, 
      section: '4. Дополнительная информация',
      placeholder: 'напр. транспорт, госсектор...'
    },
    { 
      name: 'usageScenario', 
      label: 'Сценарий использования (замена АТС, развертывание с нуля)', 
      type: 'textarea', 
      required: true, 
      section: '4. Дополнительная информация' 
    },
    { 
      name: 'competitors', 
      label: 'Какие есть конкуренты-производители в проекте?', 
      type: 'text', 
      required: true, 
      section: '4. Дополнительная информация' 
    },
    { 
      name: 'budgetStatus', 
      label: 'Выделен ли уже бюджет у заказчика на покупку?', 
      type: 'select', 
      options: ['Да', 'Нет', 'В процессе'], 
      required: true, 
      section: '4. Дополнительная информация' 
    },
    { 
      name: 'deliverySchedule', 
      label: 'Поставка одной партией или по графику?', 
      type: 'text', 
      required: true, 
      section: '4. Дополнительная информация' 
    },
    { 
      name: 'keyRequirements', 
      label: 'Ключевые требования заказчика к решению', 
      type: 'textarea', 
      required: true, 
      section: '4. Дополнительная информация' 
    },
    { 
      name: 'additionalEquipment', 
      label: 'Какое оборудование/ПО требуется заказчику дополнительно?', 
      type: 'text', 
      required: true, 
      section: '4. Дополнительная информация' 
    },
    { 
      name: 'ydmpPlanning', 
      label: 'Планируется ли развертывание платформы YDMP?', 
      type: 'select', 
      options: ['Да', 'Нет'], 
      required: true, 
      section: '4. Дополнительная информация' 
    },
    { 
      name: 'plannedActions', 
      label: 'Планируемые действия по проекту (встречи, демо и т.д.)', 
      type: 'textarea', 
      required: true, 
      section: '4. Дополнительная информация' 
    },
    { 
      name: 'comments', 
      label: 'Дополнительные комментарии по проекту', 
      type: 'textarea', 
      required: true, 
      section: '4. Дополнительная информация' 
    },
  ],

  NETWORKING: [
    { name: 'customerName', label: 'Наименование Заказчика', type: 'text', required: true },
    { name: 'equipmentType', label: 'Тип оборудования', type: 'select', options: ['Коммутаторы', 'Маршрутизаторы', 'Wi-Fi'], required: true },
    { name: 'portCount', label: 'Общее кол-во портов', type: 'text' },
    { name: 'comments', label: 'Комментарии к проекту', type: 'textarea' },
  ]
};


// Генерируем плоский словарь меток для быстрого поиска в таблице
export const FIELD_LABELS: Record<string, string> = Object.values(PROJECT_CATEGORIES)
  .flat()
  .reduce((acc, field) => ({
    ...acc,
    [field.name]: field.label
  }), {});