import { Link, useParams } from 'react-router'
import { ErrorState, Loader } from '../../../shared/ui/AsyncState'
import { useAuthor } from '../../authors/model/queries'
import { useLibraryEntry } from '../../library/model/queries'
import { LibraryEntryForm } from '../../library/ui/LibraryEntryForm'
import { useBook } from '../model/queries'
import { BookCover } from '../ui/BookCover'

export default function BookDetailsPage() {
  const { bookId = '' } = useParams()
  const book = useBook(bookId)
  // dependent query: the author is loaded only after we know the book's author id
  const author = useAuthor(book.data?.authorIds[0])
  const entry = useLibraryEntry(bookId)

  if (book.isPending) return <Loader label="Завантажуємо книгу…" />
  if (book.isError)
    return <ErrorState error={book.error} onRetry={() => book.refetch()} isRetrying={book.isFetching} />

  const { title, description, subjects, coverUrl, firstPublished } = book.data

  return (
    <article className="grid items-start gap-8 md:grid-cols-[300px_1fr]">
      <aside className="flex flex-col gap-6">
        <BookCover src={coverUrl} title={title} className="w-full max-w-60 self-center" />
        <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-800">
          {entry.isPending ? (
            <Loader />
          ) : entry.isError ? (
            <ErrorState error={entry.error} onRetry={() => entry.refetch()} />
          ) : (
            <LibraryEntryForm
              key={entry.data?.updatedAt ?? 'new'}
              book={{ bookId, title, authorName: author.data?.name, coverUrl }}
              entry={entry.data}
            />
          )}
        </div>
      </aside>

      <div className="flex flex-col gap-6">
        <header>
          <Link to="/books" className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
            ← До каталогу
          </Link>
          <h1 className="mt-2 text-3xl font-bold">{title}</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            {author.isLoading && 'Автор…'}
            {author.data && (
              <Link to={`/authors/${author.data.id}`} className="hover:underline">
                {author.data.name}
              </Link>
            )}
            {firstPublished && ` · ${firstPublished}`}
          </p>
        </header>

        {description ? (
          <p className="leading-relaxed whitespace-pre-line">{description}</p>
        ) : (
          <p className="text-slate-500">Опис відсутній.</p>
        )}
        {subjects.length > 0 && (
          <ul className="flex flex-wrap gap-2" aria-label="Теми">
            {subjects.map((s) => (
              <li key={s} className="rounded-full bg-slate-200 px-3 py-1 text-xs dark:bg-slate-700">
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}
