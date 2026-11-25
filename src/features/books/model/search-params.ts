import { useSearchParams } from 'react-router'
import { z } from 'zod'
import { SORT_OPTIONS, SUBJECTS, type BookSearchParams, type BookSort, type Subject } from './types'

const subjectKeys = Object.keys(SUBJECTS) as Subject[]
const sortKeys = Object.keys(SORT_OPTIONS) as BookSort[]

/** Schema of the catalog search form (also used to validate URL params). */
export const bookSearchSchema = z.object({
  q: z
    .string()
    .trim()
    .max(100, 'Запит — не довше 100 символів')
    .refine((v) => v === '' || v.length >= 3, 'Введіть щонайменше 3 символи'),
  subject: z.union([z.literal(''), z.enum(subjectKeys)]),
  sort: z.enum(sortKeys),
})
export type BookSearchFormValues = z.infer<typeof bookSearchSchema>

/** URL is the single source of truth for catalog filters: ?q=&subject=&sort=&page= */
export function useCatalogParams() {
  const [searchParams, setSearchParams] = useSearchParams()

  const parsed = bookSearchSchema.safeParse({
    q: searchParams.get('q') ?? '',
    subject: searchParams.get('subject') ?? '',
    sort: searchParams.get('sort') ?? 'relevance',
  })
  const filters: BookSearchFormValues = parsed.success ? parsed.data : { q: '', subject: '', sort: 'relevance' }
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const params: BookSearchParams = { ...filters, page }

  const update = (next: Partial<BookSearchParams>) => {
    const merged = { ...params, page: 1, ...next }
    const query = new URLSearchParams()
    if (merged.q) query.set('q', merged.q)
    if (merged.subject) query.set('subject', merged.subject)
    if (merged.sort !== 'relevance') query.set('sort', merged.sort)
    if (merged.page > 1) query.set('page', String(merged.page))
    setSearchParams(query)
  }

  return { params, update }
}
