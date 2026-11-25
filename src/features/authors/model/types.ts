export interface Author {
  id: string
  name: string
  bio?: string
  birthDate?: string
  deathDate?: string
  photoUrl?: string
}

export interface AuthorWork {
  id: string
  title: string
  coverUrl?: string
}
