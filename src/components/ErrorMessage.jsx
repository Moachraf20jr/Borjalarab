import { AlertCircle, RefreshCw } from 'lucide-react'

export default function ErrorMessage({ message = 'حدث خطأ غير متوقع', onRetry, retryLabel = 'إعادة المحاولة' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 px-4 text-center" role="alert">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
        <AlertCircle size={32} className="text-red-500" aria-hidden="true" />
      </div>
      <div>
        <h3 className="text-navy font-bold text-lg mb-2">تعذر تحميل البيانات</h3>
        <p className="text-text-muted mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="btn btn-outline flex items-center gap-2"
          >
            <RefreshCw size={18} aria-hidden="true" />
            {retryLabel}
          </button>
        )}
      </div>
    </div>
  )
}