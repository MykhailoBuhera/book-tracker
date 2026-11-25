import type { ReactNode } from 'react'
import { Button } from './Button'

export function Loader({ label = 'Завантаження…' }: { label?: string }) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-12 text-slate-500">
      <span
        className="size-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"
        aria-hidden
      />
      {label}
    </div>
  )
}

interface ErrorStateProps {
  error: unknown
  onRetry?: () => void
  isRetrying?: boolean
}

export function ErrorState({ error, onRetry, isRetrying }: ErrorStateProps) {
  const message = error instanceof Error ? error.message : 'Сталася невідома помилка'
  return (
    <div
      role="alert"
      className="rounded-xl border border-rose-300 bg-rose-50 p-6 text-center dark:border-rose-800 dark:bg-rose-950/40"
    >
      <p className="mb-2 font-medium text-rose-700 dark:text-rose-300">Не вдалося завантажити дані</p>
      <p className="mb-4 text-sm text-rose-600 dark:text-rose-400">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} isLoading={isRetrying}>
          Спробувати ще раз
        </Button>
      )}
    </div>
  )
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-600">
      <p className="font-medium">{title}</p>
      {children && <div className="mt-2 text-sm text-slate-500">{children}</div>}
    </div>
  )
}
