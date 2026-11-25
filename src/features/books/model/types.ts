/** UI-facing models. They do not mirror the Open Library response format. */

export interface AuthorRef {
  id: string
  name: string
}

export interface Book {
  id: string // Open Library work id, e.g. "OL27448W"
  title: string
  authors: AuthorRef[]
  year?: number
  coverUrl?: string
  editionCount: number
  rating?: number
}

export interface BookDetails {
  id: string
  title: string
  description?: string
  subjects: string[]
  coverUrl?: string
  firstPublished?: string
  authorIds: string[]
}

export const SORT_OPTIONS = {
  relevance: 'За релевантністю',
  new: 'Спершу новіші',
  old: 'Спершу старіші',
  rating: 'За рейтингом',
} as const
export type BookSort = keyof typeof SORT_OPTIONS

export const SUBJECTS = {
  dystopia: 'Антиутопія',
  fantasy: 'Фентезі',
  science_fiction: 'Наукова фантастика',
  mystery: 'Детективи',
  romance: 'Романтика',
  history: 'Історія',
  programming: 'Програмування',
} as const
export type Subject = keyof typeof SUBJECTS

/** Shown on the catalog start page: Fahrenheit 451, Fight Club, Harry Potter and the Philosopher's Stone */
export const FEATURED_BOOK_IDS = ['OL103123W', 'OL18941W', 'OL82563W']

export interface BookSearchParams {
  q: string
  subject: Subject | ''
  sort: BookSort
  page: number
}

export interface Paginated<T> {
  items: T[]
  total: number
  totalPages: number
}
