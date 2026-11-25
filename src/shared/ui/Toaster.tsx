import { useToastStore } from '../store/toast-store'

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  return (
    <div aria-live="polite" className="fixed right-4 bottom-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          role={t.kind === 'error' ? 'alert' : 'status'}
          className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-white shadow-lg ${
            t.kind === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
          }`}
        >
          {t.message}
          <button
            onClick={() => dismiss(t.id)}
            aria-label="Закрити повідомлення"
            className="opacity-80 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
