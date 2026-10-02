import { useToast } from '../hooks/useToast'
import Toast from './Toast'

export default function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div
      className="toast-container"
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