import { Inbox, FolderOpen, FileText, PlusCircle } from 'lucide-react'

const icons = {
  consultations: Inbox,
  projects: FolderOpen,
  articles: FileText,
  default: Inbox
}

const messages = {
  consultations: 'لا توجد طلبات استشارة حالياً',
  projects: 'لا توجد مشاريع متاحة حالياً',
  articles: 'لا توجد مقالات متاحة حالياً',
  default: 'لا توجد بيانات متاحة حالياً'
}

const actions = {
  consultations: null,
  projects: { label: 'إضافة مشروع', icon: PlusCircle },
  articles: { label: 'إضافة مقال', icon: PlusCircle }
}

export default function EmptyState({ type = 'default', onAction, message }) {
  const Icon = icons[type] || icons.default
  const action = actions[type]

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 px-4 text-center" role="status">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
        <Icon size={32} className="text-text-muted" aria-hidden="true" />
      </div>
      <div>
        <h3 className="text-navy font-bold text-lg mb-2">{message || messages[type] || messages.default}</h3>
        {action && onAction && (
          <button
            onClick={onAction}
            className="btn btn-primary flex items-center gap-2 mt-2"
          >
            <action.icon size={18} aria-hidden="true" />
            {action.label}
          </button>
        )}
      </div>
    </div>
  )
}