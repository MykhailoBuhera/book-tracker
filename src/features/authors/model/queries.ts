import { useQuery } from '@tanstack/react-query'
import { authorsRepository } from '../api/authors.repository'

export const authorKeys = {
  detail: (id: string) => ['authors', id] as const,
  works: (id: string) => ['authors', id, 'works'] as const,
}

/** `id` may be unknown yet (dependent query: book -> its author). */
export function useAuthor(id: string | undefined) {
  return useQuery({
    queryKey: authorKeys.detail(id ?? ''),
    queryFn: ({ signal }) => authorsRepository.getById(id!, signal),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 30, // author info almost never changes
  })
}

export function useAuthorWorks(id: string) {
  return useQuery({
    queryKey: authorKeys.works(id),
    queryFn: ({ signal }) => authorsRepository.getWorks(id, signal),
  })
}
