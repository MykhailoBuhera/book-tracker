/** Helpers shared by the Open Library repositories (books, authors). */

export const OPEN_LIBRARY_URL = 'https://openlibrary.org'

export type TextDto = string | { value: string }

export const readText = (text?: TextDto) => (typeof text === 'string' ? text : text?.value)

/** "/works/OL1W" -> "OL1W", "/authors/OL2A" -> "OL2A" */
export const stripKey = (key: string) => key.split('/').pop() ?? key

export const coverUrl = (coverId: number | undefined, size: 'M' | 'L' = 'M') =>
  coverId && coverId > 0 ? `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg` : undefined

export const authorPhotoUrl = (photoId: number | undefined) =>
  photoId && photoId > 0 ? `https://covers.openlibrary.org/a/id/${photoId}-M.jpg` : undefined
