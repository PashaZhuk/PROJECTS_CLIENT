import { useState } from 'react'
import { DollarSign, FileSpreadsheet, FileText, X, ExternalLink } from 'lucide-react'

const PLACEHOLDER_MODULES = [
  {
    id: 'finance',
    icon: <DollarSign size={28} />,
    title: 'Финансовая информация',
    description: 'Баланс, задолженность, переплаты',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    iconBg: 'bg-emerald-100',
  },
  {
    id: 'price',
    icon: <FileSpreadsheet size={28} />,
    title: 'Прейскурант',
    description: 'Скачать актуальный прайс-лист',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    iconBg: 'bg-blue-100',
  },
  {
    id: 'reconciliation',
    icon: <FileText size={28} />,
    title: 'Акт сверки',
    description: 'Скачать акт сверки взаиморасчётов',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    iconBg: 'bg-purple-100',
  },
]

const OneCPlaceholderModal = ({
  isOpen,
  onClose,
  title,
}: {
  isOpen: boolean
  onClose: () => void
  title: string
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl p-10 max-w-lg w-full mx-4 animate-in zoom-in-95 duration-300 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200" />

        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
        >
          <X size={18} className="text-slate-400" />
        </button>

        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 mt-2">
          <ExternalLink size={36} className="text-amber-500" />
        </div>

        <h3 className="text-2xl font-black text-slate-900 text-center mb-3">
          {title}
        </h3>

        <p className="text-slate-500 text-center font-medium leading-relaxed mb-8">
          Раздел находится в разработке. Ожидаем данные от разработчиков 1С.
          Как только интеграция будет готова — функционал появится в этом разделе.
        </p>

        <div className="inline-flex items-center gap-3 px-6 py-3 bg-amber-50 border border-amber-200 rounded-full mx-auto block w-fit">
          <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping" />
          <span className="text-xs font-black text-amber-700 uppercase tracking-widest">
            Ожидаем ответ от 1С
          </span>
        </div>
      </div>
    </div>
  )
}

const OneCIntegrationCards = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLACEHOLDER_MODULES.map((mod) => (
            <button
              key={mod.id}
              onClick={() => setActiveModal(mod.id)}
              className={`group text-left p-8 rounded-[2rem] border ${mod.border} ${mod.bg} shadow-sm hover:shadow-xl transition-all active:scale-[0.98] cursor-pointer`}
            >
              <div
                className={`w-14 h-14 ${mod.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                <span className={mod.color}>{mod.icon}</span>
              </div>
              <h3 className={`text-lg font-black text-slate-900 mb-1 ${mod.color}`}>
                {mod.title}
              </h3>
              <p className="text-[11px] font-medium text-slate-400 leading-relaxed">
                {mod.description}
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover:text-slate-500 transition-colors">
                <span>Подробнее</span>
                <span className="text-xs">→</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <OneCPlaceholderModal
        isOpen={activeModal === 'finance'}
        onClose={() => setActiveModal(null)}
        title="Финансовая информация"
      />
      <OneCPlaceholderModal
        isOpen={activeModal === 'price'}
        onClose={() => setActiveModal(null)}
        title="Прейскурант"
      />
      <OneCPlaceholderModal
        isOpen={activeModal === 'reconciliation'}
        onClose={() => setActiveModal(null)}
        title="Акт сверки"
      />
    </div>
  )
}

export default OneCIntegrationCards
