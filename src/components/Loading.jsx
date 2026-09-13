export default function Loading({ message = 'جاري التحميل...', size = 'md' }) {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12" role="status" aria-live="polite">
      <div
        className={`${sizes[size]} border-gold border-t-transparent rounded-full animate-spin`}
        aria-hidden="true"
      />
      <p className="text-text-muted font-medium">{message}</p>
    </div>
  )
}