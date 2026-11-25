import type { ReactNode } from 'react'
import { Link } from 'react-router'
import type { Book } from '../model/types'
import { BookCover } from './BookCover'

interface BookCardProps {
  book: Book
  /** Extra content, e.g. library status badge */
  badge?: ReactNode
}

export function BookCard({ book, badge }: BookCardProps) {
  return (
    <article className="flex flex-col gap-2 rounded-xl bg-white p-3 shadow-sm transition hover:shadow-md dark:bg-slate-800">
      <Link to={`/books/${book.id}`} className="rounded-lg focus-visible:outline-2 focus-visible:outline-indigo-500">
        <BookCover src={book.coverUrl} title={book.title} className="w-full" />
      </Link>
      <h3 className="line-clamp-2 font-semibold">
        <Link to={`/books/${book.id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
          {book.title}
        </Link>
      </h3>
      <p className="line-clamp-1 text-sm text-slate-600 dark:text-slate-400">
        {book.authors.length === 0
          ? 'Автор невідомий'
          : book.authors.slice(0, 2).map((a, i) => (
              <span key={a.id}>
                {i > 0 && ', '}
                <Link to={`/authors/${a.id}`} className="hover:underline">
                  {a.name}
                </Link>
              </span>
            ))}
      </p>
      <div className="mt-auto flex flex-wrap items-center gap-2 text-xs text-slate-500">
        {book.year && <span>{book.year}</span>}
        {book.rating && <span>★ {book.rating}</span>}
        {badge}
      </div>
    </article>
  )
}
