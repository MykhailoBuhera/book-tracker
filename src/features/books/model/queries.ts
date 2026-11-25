import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { booksRepository } from '../api/books.repository'
import type { BookSearchParams } from './types'

export const bookKeys = {
  all: ['books'] as const,
  search: (params: BookSearchParams) => [...bookKeys.all, 'search', params] as const,
  detail: (id: string) => [...bookKeys.all, 'detail', id] as const,
}

export function useBookSearch(params: BookSearchParams) {
  return useQuery({
    queryKey: bookKeys.search(params),
    queryFn: ({ signal }) => booksRepository.search(params, signal),
    // keep the old page visible while the next one loads
    placeholderData: keepPreviousData,
  })
}

export function useBook(id: string) {
  return useQuery({
    queryKey: bookKeys.detail(id),
    queryFn: ({ signal }) => booksRepository.getById(id, signal),
  })
}
