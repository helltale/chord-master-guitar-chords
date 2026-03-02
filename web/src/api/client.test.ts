import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  ApiError,
  createArtist,
  getSong,
  search,
} from './client'

vi.mock('@/config/env', () => ({ apiBaseUrl: '/api/amdm/v1' }))

describe('api client', () => {
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('getSong', () => {
    it('sends GET to /songs/:id and returns parsed song', async () => {
      const song = {
        song_id: '11111111-1111-1111-1111-111111111111',
        title: 'Test',
        slug: 'test',
      }
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers(),
        json: () => Promise.resolve(song),
      })

      const result = await getSong(song.song_id)

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/amdm/v1/songs/11111111-1111-1111-1111-111111111111',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      )
      expect(result).toEqual(song)
    })

    it('throws ApiError with status and message on 404', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: () => Promise.resolve('not found'),
      })

      let err: ApiError | null = null
      try {
        await getSong('00000000-0000-0000-0000-000000000000')
      } catch (e) {
        err = e as ApiError
      }
      expect(err).toBeInstanceOf(ApiError)
      expect(err?.status).toBe(404)
      expect(err?.message).toBe('not found')
    })
  })

  describe('search', () => {
    it('sends GET to /search with query and returns SearchResult', async () => {
      const searchResult = {
        artists: [],
        total_artists: 0,
        songs: [],
        total_songs: 0,
      }
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers(),
        json: () => Promise.resolve(searchResult),
      })

      const result = await search({ q: 'foo', limit: 10 })

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/api/amdm/v1/search'),
        expect.any(Object)
      )
      const url = fetchMock.mock.calls[0][0]
      expect(url).toContain('q=foo')
      expect(url).toContain('limit=10')
      expect(result).toEqual(searchResult)
    })
  })

  describe('createArtist', () => {
    it('sends POST with body and returns Artist', async () => {
      const artist = {
        artist_id: '22222222-2222-2222-2222-222222222222',
        name: 'Artist',
        slug: 'artist',
      }
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 201,
        headers: new Headers(),
        json: () => Promise.resolve(artist),
      })

      const result = await createArtist({ name: 'Artist', slug: 'artist' })

      expect(fetchMock).toHaveBeenCalledWith(
        '/api/amdm/v1/artists',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'Artist', slug: 'artist' }),
        })
      )
      expect(result).toEqual(artist)
    })

    it('throws ApiError on 400', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: () => Promise.resolve('validation error'),
      })

      await expect(
        createArtist({ name: 'x', slug: 'x' })
      ).rejects.toThrow(ApiError)
    })
  })

  describe('ApiError', () => {
    it('exposes status and message', () => {
      const err = new ApiError(500, 'server error')
      expect(err.name).toBe('ApiError')
      expect(err.status).toBe(500)
      expect(err.message).toBe('server error')
    })
  })
})
