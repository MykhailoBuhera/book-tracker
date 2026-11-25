import { READING_STATUSES, type ReadingStatus } from '../model/types'

const colors: Record<ReadingStatus, string> = {
  want: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200',
  reading: 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-200',
  read: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200',
}

export function StatusBadge({ status }: { status: ReadingStatus }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status]}`}>
      {READING_STATUSES[status]}
    </span>
  )
}
