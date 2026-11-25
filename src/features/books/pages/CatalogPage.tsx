import { EmptyState, ErrorState, Loader } from '../../../shared/ui/AsyncState'
import { Pagination } from '../../../shared/ui/Pagination'
import { useLibrary } from '../../library/model/queries'
import { StatusBadge } from '../../library/ui/StatusBadge'
import { useBookSearch } from '../model/queries'
import { useCatalogParams } from '../model/search-params'
import { BookCard } from '../ui/BookCard'
import { BookSearchForm } from '../ui/BookSearchForm'

export default function CatalogPage() {
  const { params, update } = useCatalogParams()
  const search = useBookSearch(params)
  const library = useLibrary()
  const statusById = new Map(library.data?.map((e) => [e.bookId, e.status]))

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Каталог книг</h1>

      {/* key: re-create the form when the URL changes (back/forward navigation) */}
      <BookSearchForm
        key={`${params.q}|${params.subject}|${params.sort}`}
        defaultValues={{ q: params.q, subject: params.subject, sort: params.sort }}
        onSubmit={(values) => update(values)}
      />

      {search.isPending ? (
        <Loader label="Шукаємо книги…" />
      ) : search.isError ? (
        <ErrorState error={search.error} onRetry={() => search.refetch()} isRetrying={search.isFetching} />
      ) : search.data.items.length === 0 ? (
        <EmptyState title="Нічого не знайдено">Спробуйте змінити запит або жанр.</EmptyState>
      ) : (
        <>
          <p className="text-sm text-slate-500" aria-live="polite">
            Знайдено: {search.data.total.toLocaleString('uk-UA')}
          </p>
          <div
            className={`grid grid-cols-2 gap-4 transition-opacity sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 ${
              search.isPlaceholderData ? 'opacity-50' : ''
            }`}
          >
            {search.data.items.map((book) => {
              const status = statusById.get(book.id)
              return <BookCard key={book.id} book={book} badge={status && <StatusBadge status={status} />} />
            })}
          </div>
          <Pagination
            page={params.page}
            totalPages={search.data.totalPages}
            onChange={(page) => {
              update({ page })
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        </>
      )}
    </section>
  )
}
