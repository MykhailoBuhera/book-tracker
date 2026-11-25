import type { ComponentType } from 'react'
import { createBrowserRouter, Navigate } from 'react-router'
import { Loader } from '../shared/ui/AsyncState'
import { Layout } from './Layout'
import NotFoundPage from './NotFoundPage'

// Lazy routes: every page is a separate chunk loaded on first visit.
const page = (load: () => Promise<{ default: ComponentType }>) => () =>
  load().then((m) => ({ Component: m.default }))

export const router = createBrowserRouter(
  [
    {
      element: <Layout />,
      hydrateFallbackElement: <Loader />,
      children: [
        { index: true, element: <Navigate to="/books" replace /> },
        { path: 'books', lazy: page(() => import('../features/books/pages/CatalogPage')) },
        { path: 'books/:bookId', lazy: page(() => import('../features/books/pages/BookDetailsPage')) },
        { path: 'authors/:authorId', lazy: page(() => import('../features/authors/pages/AuthorPage')) },
        { path: 'library', lazy: page(() => import('../features/library/pages/LibraryPage')) },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
)
