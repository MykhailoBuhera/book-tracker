import type { LibraryEntry, LibraryEntryInput } from '../model/types'

/**
 * Open Library is read-only, so the user's library lives in localStorage.
 * The repository still exposes an async API (with a small artificial latency),
 * so the UI works with it exactly like with a remote backend and the storage
 * can be swapped for a real API without touching components.
 */
const STORAGE_KEY = 'book-tracker:library'
const LATENCY_MS = 400

const delay = () => new Promise((resolve) => setTimeout(resolve, LATENCY_MS))

function readAll(): LibraryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as LibraryEntry[]
  } catch {
    return []
  }
}

function writeAll(entries: LibraryEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    throw new Error('Не вдалося зберегти дані: сховище браузера недоступне')
  }
}

export const libraryRepository = {
  async list(): Promise<LibraryEntry[]> {
    await delay()
    return readAll()
  },

  async save(input: LibraryEntryInput): Promise<LibraryEntry> {
    await delay()
    const entries = readAll()
    const now = new Date().toISOString()
    const existing = entries.find((e) => e.bookId === input.bookId)
    const entry: LibraryEntry = { ...input, addedAt: existing?.addedAt ?? now, updatedAt: now }
    writeAll(existing ? entries.map((e) => (e.bookId === input.bookId ? entry : e)) : [...entries, entry])
    return entry
  },

  async remove(bookId: string): Promise<void> {
    await delay()
    writeAll(readAll().filter((e) => e.bookId !== bookId))
  },
}
