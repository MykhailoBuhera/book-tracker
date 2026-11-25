import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { booksRepository } from '../api/books.repository'
import { FEATURED_BOOK_IDS, type BookSearchParams } from './types'

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

export function useFeaturedBooks() {
  return useQuery({
    queryKey: [...bookKeys.all, 'featured'],
    queryFn: ({ signal }) => booksRepository.getManyByIds(FEATURED_BOOK_IDS, signal),
    staleTime: Infinity,
  })
}

export function useBook(id: string) {
  return useQuery({
    queryKey: bookKeys.detail(id),
    queryFn: ({ signal }) => booksRepository.getById(id, signal),
  })
}
