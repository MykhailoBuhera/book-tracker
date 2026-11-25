export class HttpError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

/** Thin fetch wrapper: the only place in the app that talks HTTP. */
export async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new HttpError(response.status, `Запит не вдався (HTTP ${response.status})`)
  }
  return (await response.json()) as T
}
