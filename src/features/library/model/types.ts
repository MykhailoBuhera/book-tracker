export const READING_STATUSES = {
  want: 'Хочу прочитати',
  reading: 'Читаю',
  read: 'Прочитано',
} as const
export type ReadingStatus = keyof typeof READING_STATUSES

/** A book saved in the user's own library. */
export interface LibraryEntry {
  bookId: string
  title: string
  authorName?: string
  coverUrl?: string
  status: ReadingStatus
  rating?: number // 1..5, only for read books
  notes: string
  finishedAt?: string // yyyy-mm-dd
  addedAt: string // ISO
  updatedAt: string // ISO
}

/** What the UI sends to save an entry (timestamps are set by the repository). */
export type LibraryEntryInput = Omit<LibraryEntry, 'addedAt' | 'updatedAt'>
