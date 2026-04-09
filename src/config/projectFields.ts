export type FieldType = 'text' | 'textarea' | 'date' | 'select' | 'items';

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  section?: string;
}

export const PROJECT_CATEGORIES: Record<string, FormField[]> = {
  YEALINK_PHONES: [
    {
      name: 'customerName',
      label: 'Наименование Заказчика (конечного пользователя)',
      type: 'text',
      required: true,
      section: '2. Информация о конечном Заказчике',
    },
    {
      name: 'customerInn',
      label: 'ИНН Заказчика',
      type: 'text',
      required: true,
      section: '2. Информация о конечном Заказчике',
    },
    {
      name: 'purchasingOrg',
      label: 'Наименование закупочной/уполномоченной организации',
      type: 'text',
      required: true,
      section: '2. Информация о конечном Заказчике',
    },
    {
      name: 'purchasingInn',
      label: 'УНП закупочной организации',
      type: 'text',
      required: true,
      section: '2. Информация о конечном Заказчике',
    },
    {
      name: 'intermediatePartner',
      label: 'Название и УНП другого партнера (если поставка через него)',
      type: 'text',
      required: true,
      section: '2. Информация о конечном Заказчике',
      placeholder: 'Если напрямую — пишите "сам"',
    },
    {
      name: 'customerWebsite',
      label: 'Сайт Заказчика',
      type: 'text',
      required: true,
      section: '2. Информация о конечном Заказчике',
    },
    {
      name: 'installationAddr',
      label: 'Адреса/Города планируемой установки оборудования',
      type: 'text',
      required: true,
      section: '2. Информация о конечном Заказчике',
    },
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
        'Yealink W73P', 'Yealink W70B', 'Yealink W73H',
      ],
    },
    {
      name: 'ipAtcType',
      label: 'К какой IP-АТС планируется подключать телефоны?',
      type: 'text',
      required: true,
      section: '3. Техническая информация',
    },
    {
      name: 'currentTelephony',
      label: 'Установлены ли сейчас у Заказчика АТС и телефоны? (какие)',
      type: 'text',
      required: true,
      section: '3. Техническая информация',
    },
    {
      name: 'executionDate',
      label: 'Планируемая дата реализации проекта',
      type: 'date',
      required: true,
      section: '3. Техническая информация',
    },
    {
      name: 'purchaseMethod',
      label: 'Планируемая форма закупки',
      type: 'select',
      options: ['прямая закупка', 'открытый тендер', 'закрытый тендер'],
      required: true,
      section: '3. Техническая информация',
    },
    {
      name: 'industry',
      label: 'Сфера деятельности Заказчика',
      type: 'text',
      required: true,
      section: '4. Дополнительная информация',
      placeholder: 'напр. транспорт, госсектор...',
    },
    {
      name: 'usageScenario',
      label: 'Сценарий использования (замена АТС, развертывание с нуля)',
      type: 'textarea',
      required: true,
      section: '4. Дополнительная информация',
    },
    {
      name: 'competitors',
      label: 'Какие есть конкуренты-производители в проекте?',
      type: 'text',
      required: true,
      section: '4. Дополнительная информация',
    },
    {
      name: 'budgetStatus',
      label: 'Выделен ли уже бюджет у заказчика на покупку?',
      type: 'select',
      options: ['Да', 'Нет', 'В процессе'],
      required: true,
      section: '4. Дополнительная информация',
    },
    {
      name: 'deliverySchedule',
      label: 'Поставка одной партией или по графику?',
      type: 'text',
      required: true,
      section: '4. Дополнительная информация',
    },
    {
      name: 'keyRequirements',
      label: 'Ключевые требования заказчика к решению',
      type: 'textarea',
      required: true,
      section: '4. Дополнительная информация',
    },
    {
      name: 'additionalEquipment',
      label: 'Какое оборудование/ПО требуется заказчику дополнительно?',
      type: 'text',
      required: true,
      section: '4. Дополнительная информация',
    },
    {
      name: 'ydmpPlanning',
      label: 'Планируется ли развертывание платформы YDMP?',
      type: 'select',
      options: ['Да', 'Нет'],
      required: true,
      section: '4. Дополнительная информация',
    },
    {
      name: 'plannedActions',
      label: 'Планируемые действия по проекту (встречи, демо и т.д.)',
      type: 'textarea',
      required: true,
      section: '4. Дополнительная информация',
    },
    {
      name: 'comments',
      label: 'Дополнительные комментарии по проекту',
      type: 'textarea',
      required: true,
      section: '4. Дополнительная информация',
    },
  ],

  NETWORKING: [
    {
      name: 'customerName',
      label: 'Наименование Заказчика',
      type: 'text',
      required: true,
      section: '1. Информация о Заказчике',
    },
    {
      name: 'customerInn',
      label: 'ИНН Заказчика',
      type: 'text',
      required: true,
      section: '1. Информация о Заказчике',
    },
    {
      name: 'installationAddr',
      label: 'Адрес установки',
      type: 'text',
      required: true,
      section: '1. Информация о Заказчике',
    },
    {
      name: 'equipmentType',
      label: 'Тип оборудования',
      type: 'select',
      options: ['Коммутаторы', 'Маршрутизаторы', 'Wi-Fi'],
      required: true,
      section: '2. Техническая информация',
    },
    {
      name: 'portCount',
      label: 'Общее количество портов',
      type: 'text',
      section: '2. Техническая информация',
    },
    {
      name: 'executionDate',
      label: 'Планируемая дата реализации',
      type: 'date',
      required: true,
      section: '2. Техническая информация',
    },
    {
      name: 'comments',
      label: 'Комментарии к проекту',
      type: 'textarea',
      section: '3. Дополнительно',
    },
  ],

  // Добавлена категория VIDEO_CONFERENCE — была в UI, но отсутствовала в конфиге
  VIDEO_CONFERENCE: [
    {
      name: 'customerName',
      label: 'Наименование Заказчика',
      type: 'text',
      required: true,
      section: '1. Информация о Заказчике',
    },
    {
      name: 'customerInn',
      label: 'ИНН Заказчика',
      type: 'text',
      required: true,
      section: '1. Информация о Заказчике',
    },
    {
      name: 'installationAddr',
      label: 'Адрес установки',
      type: 'text',
      required: true,
      section: '1. Информация о Заказчике',
    },
    {
      name: 'roomCount',
      label: 'Количество переговорных комнат',
      type: 'text',
      required: true,
      section: '2. Техническая информация',
    },
    {
      name: 'vcsSystem',
      label: 'Предпочитаемая платформа ВКС',
      type: 'select',
      options: ['Yealink MVC', 'Cisco Webex', 'Zoom Rooms', 'Другое'],
      required: true,
      section: '2. Техническая информация',
    },
    {
      name: 'currentSystem',
      label: 'Текущая система видеосвязи (если есть)',
      type: 'text',
      section: '2. Техническая информация',
    },
    {
      name: 'executionDate',
      label: 'Планируемая дата реализации',
      type: 'date',
      required: true,
      section: '2. Техническая информация',
    },
    {
      name: 'purchaseMethod',
      label: 'Форма закупки',
      type: 'select',
      options: ['прямая закупка', 'открытый тендер', 'закрытый тендер'],
      required: true,
      section: '2. Техническая информация',
    },
    {
      name: 'keyRequirements',
      label: 'Ключевые требования к системе',
      type: 'textarea',
      required: true,
      section: '3. Дополнительно',
    },
    {
      name: 'comments',
      label: 'Дополнительные комментарии',
      type: 'textarea',
      section: '3. Дополнительно',
    },
  ],
};

export const FIELD_LABELS: Record<string, string> = Object.values(PROJECT_CATEGORIES)
  .flat()
  .reduce((acc, field) => ({ ...acc, [field.name]: field.label }), {});
