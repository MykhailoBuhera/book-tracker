import { Link, useSearchParams } from 'react-router'
import { EmptyState, ErrorState, Loader } from '../../../shared/ui/AsyncState'
import { Button } from '../../../shared/ui/Button'
import { BookCover } from '../../books/ui/BookCover'
import { useLibrary, useRemoveLibraryEntry } from '../model/queries'
import { READING_STATUSES, type LibraryEntry, type ReadingStatus } from '../model/types'
import { StatusBadge } from '../ui/StatusBadge'

const SORTS = {
  updated: 'Нещодавно змінені',
  title: 'За назвою',
  rating: 'За моєю оцінкою',
} as const
type LibrarySort = keyof typeof SORTS

const comparators: Record<LibrarySort, (a: LibraryEntry, b: LibraryEntry) => number> = {
  updated: (a, b) => b.updatedAt.localeCompare(a.updatedAt),
  title: (a, b) => a.title.localeCompare(b.title),
  rating: (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
}

const isStatus = (v: string | null): v is ReadingStatus => v !== null && v in READING_STATUSES
const isSort = (v: string | null): v is LibrarySort => v !== null && v in SORTS

export default function LibraryPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const statusParam = searchParams.get('status')
  const sortParam = searchParams.get('sort')
  const status = isStatus(statusParam) ? statusParam : null
  const sort: LibrarySort = isSort(sortParam) ? sortParam : 'updated'

  const library = useLibrary()
  const remove = useRemoveLibraryEntry()

  const setParam = (key: string, value: string | null) =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value) next.set(key, value)
      else next.delete(key)
      return next
    })

  if (library.isPending) return <Loader label="Завантажуємо бібліотеку…" />
  if (library.isError)
    return <ErrorState error={library.error} onRetry={() => library.refetch()} isRetrying={library.isFetching} />

  const entries = library.data
  const visible = entries.filter((e) => !status || e.status === status).sort(comparators[sort])
  const count = (s: ReadingStatus) => entries.filter((e) => e.status === s).length

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Моя бібліотека</h1>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label="Фільтр за статусом" className="flex flex-wrap gap-2">
          <Button variant={status ? 'secondary' : 'primary'} aria-pressed={!status} onClick={() => setParam('status', null)}>
            Усі ({entries.length})
          </Button>
          {(Object.keys(READING_STATUSES) as ReadingStatus[]).map((s) => (
            <Button
              key={s}
              variant={status === s ? 'primary' : 'secondary'}
              aria-pressed={status === s}
              onClick={() => setParam('status', s)}
            >
              {READING_STATUSES[s]} ({count(s)})
            </Button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm">
          Сортування
          <select className="input" value={sort} onChange={(e) => setParam('sort', e.target.value)}>
            {Object.entries(SORTS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {visible.length === 0 ? (
        <EmptyState title={entries.length === 0 ? 'Бібліотека порожня' : 'Немає книг із таким статусом'}>
          <Link to="/books" className="text-indigo-600 hover:underline dark:text-indigo-400">
            Знайти книги в каталозі
          </Link>
        </EmptyState>
      ) : (
        <ul className="flex flex-col gap-3">
          {visible.map((e) => (
            <li key={e.bookId} className="flex gap-4 rounded-xl bg-white p-3 shadow-sm dark:bg-slate-800">
              <BookCover src={e.coverUrl} title={e.title} className="w-16 shrink-0" />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <Link to={`/books/${e.bookId}`} className="font-semibold hover:text-indigo-600 dark:hover:text-indigo-400">
                  {e.title}
                </Link>
                {e.authorName && <span className="text-sm text-slate-500">{e.authorName}</span>}
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <StatusBadge status={e.status} />
                  {e.rating && <span aria-label={`Оцінка ${e.rating} з 5`}>{'★'.repeat(e.rating)}</span>}
                  {e.finishedAt && <span className="text-slate-500">завершено {e.finishedAt}</span>}
                </div>
                {e.notes && <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{e.notes}</p>}
              </div>
              <div className="flex flex-col gap-2 self-center">
                <Link
                  to={`/books/${e.bookId}`}
                  className="rounded-lg px-3 py-1.5 text-center text-sm text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-slate-700"
                >
                  Редагувати
                </Link>
                <Button variant="danger" className="px-3 py-1.5" onClick={() => remove.mutate(e.bookId)}>
                  Видалити
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
