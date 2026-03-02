import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSearch } from './useSearch'

const searchMock = vi.fn()
vi.mock('@/api/client', () => ({
  search: (...args: unknown[]) => searchMock(...args),
}))

describe('useSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    searchMock.mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('when query is empty', () => {
    it('clears artists/songs and does not call search API', async () => {
      searchMock.mockResolvedValue({
        artists: [],
        total_artists: 0,
        songs: [{ song_id: '1', title: 'x', slug: 'x' }],
        total_songs: 1,
      })
      const { rerender, result } = renderHook(
        ({ query, limit }) => useSearch(query, limit),
        { initialProps: { query: 'foo', limit: 20 } }
      )
      await act(async () => {
        await vi.advanceTimersByTimeAsync(350)
      })
      expect(result.current.songs).toHaveLength(1)
      expect(searchMock).toHaveBeenCalledWith({ q: 'foo', limit: 20 })

      await act(async () => {
        rerender({ query: '', limit: 20 })
      })
      expect(result.current.artists).toEqual([])
      expect(result.current.songs).toEqual([])
      expect(result.current.total).toBe(0)

      const callCountAfterClear = searchMock.mock.calls.length
      await vi.advanceTimersByTimeAsync(500)
      expect(searchMock.mock.calls.length).toBe(callCountAfterClear)
    })
  })

  describe('when query is non-empty', () => {
    it('calls search API after debounce and sets artists/songs/total on success', async () => {
      const songs = [{ song_id: '1', title: 'Song One', slug: 'song-one' }]
      searchMock.mockResolvedValue({
        artists: [],
        total_artists: 0,
        songs,
        total_songs: 1,
      })
      const { result } = renderHook(
        ({ query, limit }) => useSearch(query, limit),
        { initialProps: { query: 'song', limit: 20 } }
      )
      expect(searchMock).not.toHaveBeenCalled()
      await act(async () => {
        await vi.advanceTimersByTimeAsync(300)
      })
      expect(searchMock).toHaveBeenCalledWith({ q: 'song', limit: 20 })
      expect(result.current.loading).toBe(false)
      expect(result.current.songs).toEqual(songs)
      expect(result.current.total).toBe(1)
    })

    it('sets error and clears artists/songs on API failure', async () => {
      const err = new Error('network error')
      searchMock.mockRejectedValue(err)
      const { result } = renderHook(
        ({ query, limit }) => useSearch(query, limit),
        { initialProps: { query: 'fail', limit: 20 } }
      )
      await act(async () => {
        await vi.advanceTimersByTimeAsync(300)
      })
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(err)
      expect(result.current.artists).toEqual([])
      expect(result.current.songs).toEqual([])
      expect(result.current.total).toBe(0)
    })
  })
})
