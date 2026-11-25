import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from '../../../shared/store/toast-store'
import { libraryRepository } from '../api/library.repository'
import type { LibraryEntry, LibraryEntryInput } from './types'

export const libraryKeys = {
  all: ['library'] as const,
}

export function useLibrary() {
  return useQuery({ queryKey: libraryKeys.all, queryFn: libraryRepository.list })
}

/** Single entry is derived from the list via `select` — no separate cache copy. */
export function useLibraryEntry(bookId: string) {
  return useQuery({
    queryKey: libraryKeys.all,
    queryFn: libraryRepository.list,
    select: (entries) => entries.find((e) => e.bookId === bookId) ?? null,
  })
}

export function useSaveLibraryEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: LibraryEntryInput) => libraryRepository.save(input),
    onSuccess: () => toast.success('Бібліотеку оновлено'),
    onSettled: () => queryClient.invalidateQueries({ queryKey: libraryKeys.all }),
  })
}

/** Optimistic: the entry disappears immediately and comes back if saving fails. */
export function useRemoveLibraryEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (bookId: string) => libraryRepository.remove(bookId),
    onMutate: async (bookId) => {
      await queryClient.cancelQueries({ queryKey: libraryKeys.all })
      const previous = queryClient.getQueryData<LibraryEntry[]>(libraryKeys.all)
      queryClient.setQueryData<LibraryEntry[]>(libraryKeys.all, (old) =>
        old?.filter((e) => e.bookId !== bookId),
      )
      return { previous }
    },
    onError: (_error, _bookId, context) => {
      queryClient.setQueryData(libraryKeys.all, context?.previous)
      toast.error('Не вдалося видалити книгу — спробуйте ще раз')
    },
    onSuccess: () => toast.success('Книгу видалено з бібліотеки'),
    onSettled: () => queryClient.invalidateQueries({ queryKey: libraryKeys.all }),
  })
}
