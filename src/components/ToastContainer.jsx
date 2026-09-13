import { useToast } from '../hooks/useToast'
import Toast from './Toast'

export default function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div
      className="fixed top-4 left-4 z-50 flex flex-col gap-2 max-w-md w-full"
      style={{ pointerEvents: 'none' }}
      aria-live="polite"
      aria-label="الإشعارات"
    >
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={removeToast}
          style={{ pointerEvents: 'auto' }}
        />
      ))}
    </div>
  )
}