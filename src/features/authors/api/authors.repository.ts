import { getJson } from '../../../shared/api/http'
import {
  authorPhotoUrl,
  coverUrl,
  OPEN_LIBRARY_URL as BASE_URL,
  readText,
  stripKey,
  type TextDto,
} from '../../../shared/api/open-library'
import type { Author, AuthorWork } from '../model/types'

interface AuthorDto {
  key: string
  name: string
  bio?: TextDto
  birth_date?: string
  death_date?: string
  photos?: number[]
}

interface AuthorWorksDto {
  size: number
  entries: { key: string; title: string; covers?: number[] }[]
}

export const authorsRepository = {
  async getById(id: string, signal?: AbortSignal): Promise<Author> {
    const dto = await getJson<AuthorDto>(`${BASE_URL}/authors/${id}.json`, signal)
    return {
      id: stripKey(dto.key),
      name: dto.name,
      bio: readText(dto.bio),
      birthDate: dto.birth_date,
      deathDate: dto.death_date,
      photoUrl: authorPhotoUrl(dto.photos?.[0]),
    }
  },

  async getWorks(id: string, signal?: AbortSignal): Promise<{ items: AuthorWork[]; total: number }> {
    const dto = await getJson<AuthorWorksDto>(`${BASE_URL}/authors/${id}/works.json?limit=24`, signal)
    return {
      total: dto.size,
      items: dto.entries.map((w) => ({
        id: stripKey(w.key),
        title: w.title,
        coverUrl: coverUrl(w.covers?.[0]),
      })),
    }
  },
}
