/**
 * Typed API client for AmDm Guitar Chords backend.
 * Infrastructure layer: only HTTP and schema types.
 */
import { apiBaseUrl } from '@/config/env'
import type {
  Artist,
  ArtistList,
  ArtistWithSongs,
  CreateArtistRequest,
  CreateSongRequest,
  Song,
  SongList,
  UpdateSongRequest,
} from './schemas'

const base = apiBaseUrl.replace(/\/$/, '')

async function request<T>(
  path: string,
  options: RequestInit & { method?: string; body?: unknown } = {}
): Promise<T> {
  const { method = 'GET', body, ...rest } = options
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(rest.headers as Record<string, string>),
  }
  const res = await fetch(url, {
    ...rest,
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new ApiError(res.status, text || res.statusText)
  }
  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return undefined as T
  }
  return res.json() as Promise<T>
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// --- Artists ---

export function listArtists(params?: { limit?: number; offset?: number }): Promise<ArtistList> {
  const sp = new URLSearchParams()
  if (params?.limit != null) sp.set('limit', String(params.limit))
  if (params?.offset != null) sp.set('offset', String(params.offset))
  const q = sp.toString()
  return request<ArtistList>(`/artists${q ? `?${q}` : ''}`)
}

export function createArtist(body: CreateArtistRequest): Promise<Artist> {
  return request<Artist>('/artists', { method: 'POST', body })
}

export function getArtistBySlug(artistSlug: string): Promise<ArtistWithSongs> {
  return request<ArtistWithSongs>(`/artists/${encodeURIComponent(artistSlug)}`)
}

// --- Songs ---

export function listSongs(params?: {
  artist_id?: string
  limit?: number
  offset?: number
}): Promise<SongList> {
  const sp = new URLSearchParams()
  if (params?.artist_id != null) sp.set('artist_id', params.artist_id)
  if (params?.limit != null) sp.set('limit', String(params.limit))
  if (params?.offset != null) sp.set('offset', String(params.offset))
  const q = sp.toString()
  return request<SongList>(`/songs${q ? `?${q}` : ''}`)
}

export function createSong(body: CreateSongRequest): Promise<Song> {
  return request<Song>('/songs', { method: 'POST', body })
}

export function getSong(songId: string): Promise<Song> {
  return request<Song>(`/songs/${encodeURIComponent(songId)}`)
}

export function updateSong(songId: string, body: UpdateSongRequest): Promise<Song> {
  return request<Song>(`/songs/${encodeURIComponent(songId)}`, { method: 'PUT', body })
}

export function transposeSong(songId: string, semitones: number): Promise<Song> {
  return request<Song>(
    `/songs/${encodeURIComponent(songId)}/transpose?semitones=${encodeURIComponent(semitones)}`,
    { method: 'POST' }
  )
}

// --- Search ---

export function search(params: {
  q: string
  limit?: number
  offset?: number
}): Promise<SongList> {
  const sp = new URLSearchParams()
  sp.set('q', params.q)
  if (params.limit != null) sp.set('limit', String(params.limit))
  if (params.offset != null) sp.set('offset', String(params.offset))
  return request<SongList>(`/search?${sp.toString()}`)
}
