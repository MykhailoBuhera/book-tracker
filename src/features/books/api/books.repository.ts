import { getJson } from '../../../shared/api/http'
import {
  coverUrl,
  OPEN_LIBRARY_URL as BASE_URL,
  readText,
  stripKey,
  type TextDto,
} from '../../../shared/api/open-library'
import type { Book, BookDetails, BookSearchParams, Paginated, Subject } from '../model/types'

export const PAGE_SIZE = 12
// Open Library gets very slow on deep offsets, so we cap pagination.
const MAX_PAGES = 50
// Genres that need a custom Open Library query instead of the plain `subject` param.
// Dystopia: "Fiction, dystopian" covers Fahrenheit 451 & co., and Chuck Palahniuk's
// "Adjustment Day" (OL19739254W) is added explicitly — Open Library doesn't tag it as dystopian.
const SUBJECT_QUERIES: Partial<Record<Subject, string>> = {
  dystopia: 'subject:"Fiction, dystopian" OR key:"/works/OL19739254W"',
}
const SEARCH_FIELDS =
  'key,title,author_name,author_key,first_publish_year,cover_i,edition_count,ratings_average'

/* ---------- Raw API shapes (never leave this file) ---------- */

interface SearchDocDto {
  key: string // "/works/OL27448W"
  title: string
  author_name?: string[]
  author_key?: string[]
  first_publish_year?: number
  cover_i?: number
  edition_count?: number
  ratings_average?: number
}

interface SearchResponseDto {
  numFound: number
  docs: SearchDocDto[]
}

interface WorkDto {
  key: string
  title: string
  description?: TextDto
  subjects?: string[]
  covers?: number[]
  first_publish_date?: string
  authors?: { author: { key: string } }[]
}

/* ---------- DTO -> model mappers ---------- */

function toBook(doc: SearchDocDto): Book {
  const names = doc.author_name ?? []
  return {
    id: stripKey(doc.key),
    title: doc.title,
    authors: (doc.author_key ?? []).map((id, i) => ({ id, name: names[i] ?? 'Невідомий автор' })),
    year: doc.first_publish_year,
    coverUrl: coverUrl(doc.cover_i),
    editionCount: doc.edition_count ?? 0,
    rating: doc.ratings_average ? Math.round(doc.ratings_average * 10) / 10 : undefined,
  }
}

function toBookDetails(work: WorkDto): BookDetails {
  return {
    id: stripKey(work.key),
    title: work.title,
    // descriptions often end with a markdown "----------" block of links — drop it
    description: readText(work.description)?.split(/\r?\n-{3,}/)[0].trim(),
    subjects: (work.subjects ?? []).slice(0, 12),
    coverUrl: coverUrl(work.covers?.[0], 'L'),
    firstPublished: work.first_publish_date,
    authorIds: (work.authors ?? []).map((a) => stripKey(a.author.key)),
  }
}

/* ---------- Repository ---------- */

export const booksRepository = {
  async search(params: BookSearchParams, signal?: AbortSignal): Promise<Paginated<Book>> {
    const url = new URL(`${BASE_URL}/search.json`)
    const subjectQuery = params.subject && SUBJECT_QUERIES[params.subject]
    if (subjectQuery) {
      url.searchParams.set('q', params.q ? `(${params.q}) AND (${subjectQuery})` : subjectQuery)
    } else {
      if (params.q) url.searchParams.set('q', params.q)
      // The API needs at least one criterion; without one we browse fiction.
      const subject = params.subject || (params.q ? '' : 'fiction')
      if (subject) url.searchParams.set('subject', subject)
    }
    if (params.sort !== 'relevance') url.searchParams.set('sort', params.sort)
    url.searchParams.set('page', String(params.page))
    url.searchParams.set('limit', String(PAGE_SIZE))
    url.searchParams.set('fields', SEARCH_FIELDS)

    const data = await getJson<SearchResponseDto>(url.toString(), signal)
    return {
      items: data.docs.map(toBook),
      total: data.numFound,
      totalPages: Math.min(Math.ceil(data.numFound / PAGE_SIZE), MAX_PAGES),
    }
  },

  /** Several works in one request, returned in the order of `ids`. */
  async getManyByIds(ids: string[], signal?: AbortSignal): Promise<Book[]> {
    const url = new URL(`${BASE_URL}/search.json`)
    url.searchParams.set('q', `key:(${ids.map((id) => `/works/${id}`).join(' OR ')})`)
    url.searchParams.set('fields', SEARCH_FIELDS)
    const data = await getJson<SearchResponseDto>(url.toString(), signal)
    const books = data.docs.map(toBook)
    return ids.flatMap((id) => books.find((b) => b.id === id) ?? [])
  },

  async getById(id: string, signal?: AbortSignal): Promise<BookDetails> {
    const work = await getJson<WorkDto>(`${BASE_URL}/works/${id}.json`, signal)
    return toBookDetails(work)
  },
}
