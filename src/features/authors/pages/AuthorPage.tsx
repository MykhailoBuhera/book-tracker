import { Link, useParams } from 'react-router'
import { EmptyState, ErrorState, Loader } from '../../../shared/ui/AsyncState'
import { BookCover } from '../../books/ui/BookCover'
import { useAuthor, useAuthorWorks } from '../model/queries'

export default function AuthorPage() {
  const { authorId = '' } = useParams()
  const author = useAuthor(authorId)
  const works = useAuthorWorks(authorId)

  if (author.isPending) return <Loader label="Завантажуємо автора…" />
  if (author.isError)
    return <ErrorState error={author.error} onRetry={() => author.refetch()} isRetrying={author.isFetching} />

  const { name, bio, birthDate, deathDate, photoUrl } = author.data

  return (
    <section className="flex flex-col gap-8">
      <header className="flex flex-col gap-6 sm:flex-row">
        {photoUrl && <img src={photoUrl} alt={name} className="w-40 rounded-xl object-cover" />}
        <div>
          <h1 className="text-3xl font-bold">{name}</h1>
          {(birthDate || deathDate) && (
            <p className="mt-1 text-slate-500">
              {birthDate ?? '?'} — {deathDate ?? ''}
            </p>
          )}
          {bio && <p className="mt-4 line-clamp-6 leading-relaxed whitespace-pre-line">{bio}</p>}
        </div>
      </header>

      <div>
        <h2 className="mb-4 text-xl font-semibold">
          Твори {works.data && <span className="text-slate-500">({works.data.total})</span>}
        </h2>
        {works.isPending ? (
          <Loader />
        ) : works.isError ? (
          <ErrorState error={works.error} onRetry={() => works.refetch()} isRetrying={works.isFetching} />
        ) : works.data.items.length === 0 ? (
          <EmptyState title="Творів не знайдено" />
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {works.data.items.map((w) => (
              <li key={w.id}>
                <Link to={`/books/${w.id}`} className="flex flex-col gap-2 hover:text-indigo-600 dark:hover:text-indigo-400">
                  <BookCover src={w.coverUrl} title={w.title} className="w-full" />
                  <span className="line-clamp-2 text-sm font-medium">{w.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
